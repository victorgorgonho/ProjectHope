const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken:{
        type: String,
        select: false,
    },
    passwordResetExpires:{
        select: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
    },
    tokenExpo: {
        type: String,
        default: 'ExponentPushToken[cySFImCY27rNJi97aIYrWa]', //My Device Expo Token
    },
});

//Hash to encrypt password in a way that if someone ever access database, won't be able to steal password
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;