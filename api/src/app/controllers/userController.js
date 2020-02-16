const express = require('express');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

//List existing users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()

        return res.send({ users });
    } catch (err) {
        return res.status(400).send({ erro: 'Failed loading users' });
    }
});


//Update existing user info
router.put('/:userId', async (req, res) => {
    try {
        const { name } = req.body;

        const user = await User.findOneAndUpdate({_id: req.params.userId}, { 
            name
        }, { new: true });

        return res.send({ user });

    } catch (err) {
        return res.status(400).send({ erro: 'Failed updating user' });
    }
});

//Update existing user profile picture
router.put('/:userId/avatar', async (req, res) => {
    try {
        const { avatar } = req.body;

        const user = await User.findOneAndUpdate({_id: req.params.userId}, { 
            avatar
        }, { new: true });

        return res.send({ user });
    } catch (err) {
        return res.status(400).send({ erro: 'Failed updating Avatar' });
    }
});

module.exports = app => app.use('/user', router);