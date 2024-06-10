// server/src/controllers/digitalArchive/DigitalArchiveController.js
import createDigitalArchive from '../../useCases/createDigitalArchive/CreateDigitalArchive';
import StorageService from '../../services/storage/StorageService';
import CustomError from '../../utils/CustomError';
import IrysClient from '../../lib/IrysClient';
import DigitalArchive from '../../models/digitalArchive/DigitalArchive';
import getDigitalArchive from '../../useCases/getDigitalArchive/GetDigitalArchive';
import { getEncryptedContent } from '../../utils/digitalArchiveUtils';
import { getPrivateKey } from '../../utils/userUtils';


const create = async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;

    try {
        if (!content) {
            throw new CustomError('Content is required', 400);
        }
        const digitalArchive = await createDigitalArchive(userId, content);
        const size = Buffer.byteLength(content, 'utf8');
        const fee = await StorageService.calculateFee(size); // awaitを追加
        await Promise.all([
            StorageService.store(digitalArchive), // IrysClient.storeからStorageService.storeに変更
            //ArweaveClient.store(digitalArchive.encryptedContent),
        ]);

        // TODO: 実際の課金処理を実装する
        console.log(`User ${userId} was charged ${fee} for storing ${size} bytes.`);

        res.status(201).json({ message: 'Digital archive created successfully', digitalArchive });
    } catch (error) {
        console.error('Error during digital archive creation:', error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
            //res.status(400).json({ message: 'Bad Request', details: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error', details: 'An unexpected error occurred. Please try again later.' });
        }
    }
};


const get = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // JWTからユーザーIDを取得

    try {
        const digitalArchive = await DigitalArchive.findOne({ _id: id, owner: userId }); // ユーザーIDを条件に追加
        if (!digitalArchive) {
            return res.status(404).json({ message: 'Digital archive not found' });
        }

        const encryptedContent = await getEncryptedContent(digitalArchive);
        const privateKey = await getPrivateKey(userId); // ユーザーIDからprivateKeyを取得する関数
        const decryptedContent = await getDigitalArchive(digitalArchive.id, privateKey);

        res.status(200).json({ digitalArchive: { ...digitalArchive.toObject(), content: decryptedContent } });
    } catch (error) {
        console.error('Error retrieving digital archive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const update = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    try {
        const digitalArchive = await DigitalArchive.findOne({ _id: id, owner: userId });
        if (!digitalArchive) {
            return res.status(404).json({ message: 'Digital archive not found' });
        }

        const updatedDigitalArchive = await updateDigitalArchive(digitalArchive, content);
        res.status(200).json({ message: 'Digital archive updated successfully', digitalArchive: updatedDigitalArchive });
    } catch (error) {
        console.error('Error updating digital archive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const digitalArchive = await DigitalArchive.findOne({ _id: id, owner: userId });
        if (!digitalArchive) {
            return res.status(404).json({ message: 'Digital archive not found' });
        }

        await deleteDigitalArchive(digitalArchive);
        res.status(200).json({ message: 'Digital archive deleted successfully' });
    } catch (error) {
        console.error('Error deleting digital archive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export default {
    create,
    get,
    update,
    remove
};

/*
役割：デジタルアーカイブの作成、取得、更新、削除を担当するコントローラー
デジタルアーカイブの作成時には、StorageServiceを使用してデータを保存し、料金の計算と課金処理を行う
*/

/*
200 OK：リクエストが成功し、レスポンスにデータが含まれています。
201 Created：リクエストが成功し、新しいリソースが作成されました。
400 Bad Request：リクエストが無効であるか、必要なデータが欠落しています。
401 Unauthorized：認証が必要ですが、提供されていないか、無効です。
404 Not Found：リクエストされたリソースが見つかりません。
500 Internal Server Error：サーバー内でエラーが発生しました。
*/

// const get = async (req, res) => {
//     const { id } = req.params;
//     const privateKey = req.body.privateKey;

//     try {
//         const digitalArchive = await DigitalArchive.findById(id);
//         if (!digitalArchive) {
//             return res.status(404).json({ message: 'Digital archive not found' });
//         }

//         const encryptedContent = await getEncryptedContent(digitalArchive);
//         const decryptedContent = await getDigitalArchive(digitalArchive, privateKey, encryptedContent);

//         res.status(200).json({ digitalArchive: { ...digitalArchive.toObject(), content: decryptedContent } });
//     } catch (error) {
//         console.error('Error retrieving digital archive:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };