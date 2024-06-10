// server/src/models/user/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    encryptedPrivateKey: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

export default User;