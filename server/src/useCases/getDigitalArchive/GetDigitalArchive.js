// server/src/useCases/getDigitalArchive/GetDigitalArchive.js
import DigitalArchive from '../../models/digitalArchive/DigitalArchive';
import StorageService from '../../services/storage/StorageService';
import EncryptionService from '../../services/encryption/EncryptionService';
import { getEncryptedContent } from '../../utils/digitalArchiveUtils';

const getDigitalArchive = async (digitalArchiveId, privateKey) => {
    const digitalArchive = await DigitalArchive.findById(digitalArchiveId);
    if (!digitalArchive) {
        throw new Error('Digital archive not found');
    }

    const encryptedContent = await getEncryptedContent(digitalArchive);
    const symmetricKey = await EncryptionService.decryptSymmetricKey(
        digitalArchive.encryptedSymmetricKey,
        privateKey
    );
    const content = await EncryptionService.decryptData(encryptedContent, symmetricKey);

    return { ...digitalArchive.toObject(), content };
};

export default getDigitalArchive;

/*
役割：デジタルアーカイブの取得に関するビジネスロジックを担当するユースケース
StorageServiceとEncryptionServiceを使用して、デジタルアーカイブの取得と復号化を行う
*/