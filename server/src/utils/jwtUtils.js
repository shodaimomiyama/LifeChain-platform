// server/src/utils/jwtUtils.js
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export {
    generateToken,
    verifyToken,
};



/*
役割：JWTトークンの生成と検証を行うユーティリティ
JWTトークンの生成と、トークンからユーザーIDを抽出する処理を提供する
*/