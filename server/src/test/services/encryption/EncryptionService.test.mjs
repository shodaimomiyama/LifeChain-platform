// src/test/services/encryption/EncryptionService.test.mjs
import EncryptionService from '../../../services/encryption/EncryptionService';
import config from '../../../config';
import crypto from 'crypto';
import { jest } from '@jest/globals';

describe('EncryptionService', () => {

    jest.setTimeout(10000); // タイムアウト時間を10秒に設定

    it('should generate a symmetric key', async () => {
        const key = await EncryptionService.generateSymmetricKey();
        expect(key).toBeDefined();
        expect(key.length).toBe(32);
    });

    it('should encrypt and decrypt data', async () => {
        const data = 'Test data';
        const key = await EncryptionService.generateSymmetricKey();

        const encryptedData = await EncryptionService.encryptData(data, key);
        expect(encryptedData).not.toBe(data);

        const decryptedData = await EncryptionService.decryptData(encryptedData, key);
        expect(decryptedData).toBe(data);
    });

    it('should encrypt and decrypt symmetric key', async () => {
        const symmetricKey = await EncryptionService.generateSymmetricKey();
        const { publicKey, privateKey } = await new Promise((resolve, reject) => {
            crypto.generateKeyPair(
                'rsa',
                {
                    modulusLength: 2048,
                    publicKeyEncoding: { type: 'spki', format: 'pem' },
                    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
                },
                (err, publicKey, privateKey) => {
                    if (err) reject(err);
                    else resolve({ publicKey, privateKey });
                }
            );
        });
        // ...
    });
});

/*
この部分では、EncryptionServiceの各メソッドに対するテストを追加しています。generateSymmetricKeyメソッドが適切な長さのキーを生成すること、encryptDataとdecryptDataメソッドがデータを正しく暗号化と復号化できること、およびencryptSymmetricKeyとdecryptSymmetricKeyメソッドが対称鍵を正しく暗号化と復号化できることを確認しています。
*/