const express = require ('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const User = require ('../models/user');

const router = express.Router();

//Get user ID and make a unique token based on a Secret key hide in /config
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn : 86400
    });
}

//Create new user
router.post('/register', async(req, res)=>{
    const {email} = req.body;
    
    try{
        if(await User.findOne({email}))
            return res.status(400).send({error: 'Usuário já existe'});
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
        
    } catch(err) {
        return res.status(400).send({error : 'Falha ao criar usuário'});
    }
});

//Search for a user in MongoDB to login
router.post('/authenticate', async(req, res) =>{
    const {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({error: 'Usuário não existe'});

    //Compare typed password with the real password stored on MongoDB
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Senha errada'});

    //Hide password from user, then it won't be sent as response
    user.password = undefined;

    res.send({
        user, 
        token: generateToken({ id: user.id }),
    });

});

//Send token to e-mail to reset password
router.post('/forgot_password', async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        
        if(!user)
            return res.status(400).send({error: 'Usuário não existe'});

        //Generate a random token to be used to reset password
        const token = crypto.randomBytes(20).toString('hex');

        //Gives 1 hour before token expires
        const now = new Date();
        now.setHours(now.getHours()+1);
        
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        //Send mail based on forgot_password.html in /resources/mail/auth/
        //This mail will be captured by mailtrap, check /modules/mailer for more info
        mailer.sendMail({
            to: email,
            from:'josegorgonho@eng.ci.ufpb.br',
            template:'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err){
                console.log(err);
                return res.status(400).send({error: 'Falha ao enviar e-mail, tente novamente em alguns segundos'});
            }
            return res.send();
        })

    } catch (err) {
        console.log(err);
        res.status(400).send({error: 'Erro, tente novamente em alguns segundos'});

    }
});


//Reset password based on the token sent to mail
router.post('/reset_password', async (req,res) => {
    const{email ,token, password} = req.body ;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if(!user)
            return res.status(400).send({error: 'Usuário não existe'});

        if(token !== user.passwordResetToken)
            return res.status(400).send({error: "Token inválido"});
        
        const now = new Date();

        if( now > user.passwordResetExpires)
        return res.status(400).send({error: 'Token não é mais válido, tente novamente'});

        //If it gets here, password will be reset, because token and user are valid and not expired
        user.password = password;

        await user.save();

        res.send();

    } catch (err) {
        return res.status(400).send({error: 'Falha ao mudar senha, tente novamente'});
    }

});

//Give admin to a user
router.post('/admin', async(req, res) =>{
    try {
        const {email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user)
            return res.status(400).send({error: 'Usuário não existe'});

        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error: 'Senha errada'});
        
        //The only info changed will be "isAdmin" boolean, the rest still the same
        await User.findByIdAndUpdate(user._id, {
            name: user.name,
            email: user.email,
            password: user.password,
            passwordResetToken: user.passwordResetToken,
            passwordResetExpires: user.passwordResetExpires,
            createdAt: user.createdAt,
            isAdmin: true,
            avatar: user.avatar
        }, { new: true});

        res.send();
    } catch (err) {
        console.log(err)
        return res.status(400).send({error: 'Falha ao dar administrador, tente novamente'});
    }
});

module.exports = app => app.use('/auth', router);