const express = require ('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const User = require ('../models/user');

const router = express.Router();

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
            return res.status(400).send({error: 'User already exists'});
        
        const user =await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
        
    } catch(err) {
        return res.status(400).send({error : 'Failed on register'});
    }
});

//Search for a user in MongoDB to login
router.post('/authenticate', async(req, res) =>{
    const {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({error: 'User does not exist'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Wrong password'});

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
            return res.status(400).send({error: 'User does not exist'});

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours()+1);
        
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from:'josegorgonho@eng.ci.ufpb.br',
            template:'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err){
                console.log(err);
                return res.status(400).send({error: 'Could not send mail, try again in a few seconds'});
            }
            return res.send();
        })

    } catch (err) {
        console.log(err);
        res.status(400).send({error: 'Error, try again in a few seconds'});

    }
});


//Reset password based on the token sent to mail
router.post('/reset_password', async (req,res) => {
    const{email ,token, password} = req.body ;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if(!user)
            return res.status(400).send({error: 'User does not exist'});

        if(token !== user.passwordResetToken)
            return res.status(400).send({error: "Invalid Token"});
        
        const now = new Date();

        if( now> user.passwordResetExpires)
        return res.status(400).send({error: 'Token is not valid anymore, try again'});

        user.password = password;

        await user.save();

        res.send();

    } catch (err) {
        return res.status(400).send({error: 'Failed reseting password, try again'});
    }

});

//Give admin to a user
router.post('/admin', async(req, res) =>{
    try {
        const {email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user)
            return res.status(400).send({error: 'User does not exist'});

        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error: 'Wrong password'});
        
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
        return res.status(400).send({error: 'Failed giving admin, try again'});
    }
});

module.exports = app => app.use('/auth', router);