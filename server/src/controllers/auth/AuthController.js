// src/controllers/auth/AuthController.js

import bcrypt from 'bcrypt';
import User from '../../models/user/User';
import { generateToken } from '../../utils/jwtUtils';
import { generateEncryptionKey } from '../../utils/encryptionUtils';

const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({ token }); // ステータスコードを200に変更
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const register = async (req, res) => {
    const { email, password, walletAddress } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { walletAddress }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const encryptionKey = generateEncryptionKey();
        const newUser = new User({
            email,
            password: hashedPassword,
            walletAddress,
            encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Invalid user data', details: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default {
    login,
    register,
};

/*
役割：ユーザー認証に関連するコントローラー
ログイン処理とユーザー登録処理を担当
JWTトークンの生成と発行を行う
*/