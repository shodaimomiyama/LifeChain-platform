// server/src/utils/userUtils.js

import User from '../models/user/User';
import { decrypt } from './encryptionUtils';

export const getPrivateKey = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }


    const encryptionKey = user.encryptionKey; // ユーザー固有の暗号化キーを取得
    const encryptedPrivateKey = user.encryptedPrivateKey;
    const privateKey = await decrypt(encryptedPrivateKey, encryptionKey); // 復号化に暗号化キーを使用

    return privateKey;
};
