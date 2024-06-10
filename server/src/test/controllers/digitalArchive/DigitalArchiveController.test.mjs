// server/test/controllers/digitalArchive/DigitalArchiveController.test.js
import request from 'supertest';
import app from '../../../app';
import DigitalArchive from '../../../models/digitalArchive/DigitalArchive';
import User from '../../../models/user/User';
import db from '../../../config/database';
import jwt from 'jsonwebtoken';
import CustomError from '../../../utils/CustomError';
import createDigitalArchive from '../../../useCases/createDigitalArchive/CreateDigitalArchive';
import { jest } from '@jest/globals';

describe('DigitalArchiveController', () => {
    // let user;
    let token;

    // jest.setTimeout(10000); // タイムアウト時間を10秒に設定
    beforeAll(async () => {
        await db.connect();
    }, 60000); // 60秒のタイムアウトを設定


    afterAll(async () => {
        await User.deleteMany({});
        await DigitalArchive.deleteMany({});
        await db.disconnect();
    }, 60000);

    beforeEach(async () => {
        await User.deleteMany({ email: 'test@example.com' });
        await DigitalArchive.deleteMany();
    });

    afterEach(async () => {
        await User.deleteMany({ email: 'test@example.com' });
        await DigitalArchive.deleteMany();
    });


    describe('POST /api/digitalArchive', () => {

        it('should create a new digital archive', async () => {
            const user = await User.create({
                email: 'test@example.com',
                password: 'password',
                walletAddress: '0x1234567890123456789012345678901234567890',
                encryptedPrivateKey: 'your-secret-encryption-key'
            });
            token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); //ユーザーIDを使用してJWTトークンを生成しています。

            const response = await request(app)
                .post('/api/digitalArchive')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Test content' }); //APIエンドポイントにPOSTリクエストを送信しています。


            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Digital archive created successfully');

            const digitalArchive = await DigitalArchive.findOne({ owner: user._id }); //作成されたデジタルアーカイブをデータベースから取得しています。
            expect(digitalArchive).toBeDefined(); //デジタルアーカイブが定義されていることを期待しています。
            expect(digitalArchive.encryptedContent).toBeDefined(); //デジタルアーカイブの暗号化されたコンテンツが定義されていることを期待しています。
        });

        it('should return a 401 error if no token is provided', async () => {
            const response = await request(app)
                .post('/api/digitalArchive')
                .send({ content: 'Test content' });

            expect(response.status).toBe(401); //エラーコード「401」は、Webサイトのアクセスやログインに必要なIDやパスワードが間違っており、認証に失敗したときに表示。s
            expect(response.body.message).toBe('No token provided');
        });
    });

    describe('GET /api/digitalArchive/:id', () => {
        it('should retrieve a digital archive', async () => {
            const user = await User.create({
                email: 'test@example.com',
                password: 'password',
                walletAddress: '0x1234567890123456789012345678901234567890',
                encryptedPrivateKey: 'your-secret-encryption-key'
            });
            token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            const digitalArchive = new DigitalArchive({
                owner: user._id,
                encryptedContent: 'Encrypted Test content',
                encryptedSymmetricKey: 'Encrypted symmetric key',
                irysId: 'irys-id',
                arweaveId: 'arweave-id',
            });
            await digitalArchive.save();

            const response = await request(app)
                .get(`/api/digitalArchive/${digitalArchive._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.digitalArchive._id).toBe(digitalArchive._id.toString());
            expect(response.body.digitalArchive.encryptedContent).toBe(digitalArchive.encryptedContent);
        });

        // ...
    });

});

// beforeAll(async () => {
    //     try {
    //         await db.connect();
    //         await User.deleteMany({}); // 全ユーザーを削除
    //         user = await User.create({ email: 'test@example.com', password: 'password', walletAddress: '0x1234567890123456789012345678901234567890', });
    //         token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    //         //token = generateToken(user._id);
    //     } catch (error) {
    //         console.error('データベースへの接続エラー:', error);
    //         throw error;
    //     }

    // });

    // afterEach(async () => {
    //     await DigitalArchive.deleteMany();
    //     await User.deleteMany({});
    // });

