// server/test/middlewares/auth.test.js
import jwt from 'jsonwebtoken';
import authMiddleware from '../../middlewares/auth';
import { jest } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();

describe('Authentication Middleware', () => {

    jest.setTimeout(10000); // タイムアウト時間を10秒に設定

    it('should set req.userId if a valid token is provided', () => {
        const req = {
            headers: {
                authorization: jwt.sign({ userId: 'user-id' }, process.env.JWT_SECRET),
            },
        };
        const res = {};
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(req.userId).toBe('user-id');
        expect(next).toHaveBeenCalled();
    });

    it('should return a 401 error if no token is provided', () => {
        const req = {
            headers: {},
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return a 401 error if an invalid token is provided', () => {
        const req = {
            headers: {
                authorization: 'invalid-token',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });
});