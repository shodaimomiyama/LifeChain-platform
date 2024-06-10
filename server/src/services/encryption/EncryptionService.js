// server/src/services/encryption/EncryptionService.js
import crypto from 'crypto';
import config from '../../config';

const generateSymmetricKey = async () => {
    return crypto.randomBytes(config.encryptionKeyLength);
};

const encryptData = async (data, symmetricKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return iv.toString('hex') + encryptedData;
};

const decryptData = async (encryptedData, symmetricKey) => {
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const data = encryptedData.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
    let decryptedData = decipher.update(data, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
};

const encryptSymmetricKey = async (symmetricKey, publicKey) => {
    const encryptedSymmetricKey = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        symmetricKey
    );
    return encryptedSymmetricKey.toString('hex');
};

const decryptSymmetricKey = async (encryptedSymmetricKey, privateKey) => {
    const encryptedSymmetricKeyBuffer = Buffer.from(encryptedSymmetricKey, 'hex');
    const decryptedSymmetricKey = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        encryptedSymmetricKeyBuffer
    );
    return decryptedSymmetricKey;
};

const encryptWithPublicKey = async (symmetricKey, publicKey) => {
    const buffer = Buffer.from(symmetricKey);
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        buffer
    );
    return encrypted.toString('base64');
};

const decryptWithPrivateKey = async (encryptedSymmetricKey, privateKey) => {
    const buffer = Buffer.from(encryptedSymmetricKey, 'base64');
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        buffer
    );
    return decrypted;
};

export default {
    generateSymmetricKey,
    encryptData,
    decryptData,
    encryptSymmetricKey,
    decryptSymmetricKey,
    encryptWithPublicKey,
    decryptWithPrivateKey,
};