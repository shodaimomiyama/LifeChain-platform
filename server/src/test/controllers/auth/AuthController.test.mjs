// server/test/controllers/auth/AuthController.test.mjs
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../../app';
import User from '../../../models/user/User';
import db from '../../../config/database';
import jwt from 'jsonwebtoken';
import CustomError from '../../../utils/CustomError';
import createDigitalArchive from '../../../useCases/createDigitalArchive/CreateDigitalArchive';
import DigitalArchive from '../../../models/digitalArchive/DigitalArchive';
import { jest } from '@jest/globals';

describe('AuthController', () => {

    //このファイルの各テストが実行される前に、関数を実行します。 関数がpromiseを返す、またはジェネレータ関数の場合、Jestはテストを実行する前にpromiseが解決されるのを待ちます。オプションとして、timeout(ミリ秒) を指定して、中断前にどのくらい待機するかを指定することができます。
    beforeAll(async () => {
        try {
            await db.connect();
            console.log('MongoDB connected');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }, 60000);


    afterAll(async () => {
        await User.deleteMany({});
        await db.disconnect();
    });

    beforeEach(async () => {
        await User.deleteMany({ email: 'test@example.com' });
    });

    describe('GET /api/digitalArchive/:id', () => {
        it('should retrieve a digital archive', async () => {

            // ユーザーを作成
            const user = await User.create({
                email: 'test@example.com',
                password: 'password',
                walletAddress: '0x1234567890123456789012345678901234567890',
                encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
            });

            const digitalArchive = await DigitalArchive.create({
                owner: user._id,
                content: 'Test content',
                arweaveId: 'test-arweave-id',
                irysId: 'test-irys-id',
                encryptedSymmetricKey: 'test-encrypted-symmetric-key',
                encryptedContent: 'test-encrypted-content',
            });
            // ...
        });
        // ...
    });

    describe('POST /api/auth/login', () => {
        it('should return a token when provided with valid credentials', async () => {
            const password = 'testpassword';
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                email: 'test@example.com',
                password: hashedPassword,
                walletAddress: '0x1234567890123456789012345678901234567890',
                encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password })
                .expect(200); // ステータスコードを200に変更

            expect(response.body.token).toBeDefined();
        });

        it('should return a 401 error when provided with invalid credentials', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' })
                .expect(401);
        });
    });

    describe('POST /api/auth/register', () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password',
                    walletAddress: '0x1234567890123456789012345678901234567890',
                    encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');

            const user = await User.findOne({ email: 'test@example.com' });
            expect(user).toBeDefined();
            expect(user.password).not.toBe('password');
            expect(user.walletAddress).toBe('0x1234567890123456789012345678901234567890');
        });

        it('should return an error if the user already exists', async () => {
            await User.create({
                email: 'test@example.com',
                password: 'password',
                walletAddress: '0x1234567890123456789012345678901234567890',
                encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password',
                    walletAddress: '0x1234567890123456789012345678901234567890',
                    encryptedPrivateKey: 'dummy-encrypted-private-key', // ダミーの値を設定
                });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('User already exists');
        });
    });
});