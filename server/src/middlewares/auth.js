// server/src/middlewares/auth.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;