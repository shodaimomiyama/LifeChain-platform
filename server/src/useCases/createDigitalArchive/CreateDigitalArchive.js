// server/src/useCases/createDigitalArchive/CreateDigitalArchive.js
import DigitalArchive from '../../models/digitalArchive/DigitalArchive';
import EncryptionService from '../../services/encryption/EncryptionService';
import StorageService from '../../services/storage/StorageService';

const createDigitalArchive = async (userId, content) => {
    const symmetricKey = await EncryptionService.generateSymmetricKey();
    const encryptedContent = await EncryptionService.encryptData(content, symmetricKey);
    const encryptedSymmetricKey = await EncryptionService.encryptSymmetricKey(symmetricKey, userId);

    const digitalArchive = new DigitalArchive({
        owner: userId,
        encryptedContent,
        encryptedSymmetricKey,
    });

    await StorageService.store(digitalArchive);
    await digitalArchive.save();

    return digitalArchive;
};

export default createDigitalArchive;

/*
役割：デジタルアーカイブの作成に関するビジネスロジックを担当するユースケース
EncryptionServiceとStorageServiceを使用して、デジタルアーカイブの作成、暗号化、保存を行う
*/
