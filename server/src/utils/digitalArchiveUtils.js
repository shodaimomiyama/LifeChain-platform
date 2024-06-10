// server/src/utils/digitalArchiveUtils.js
import StorageService from '../services/storage/StorageService';

const getEncryptedContent = async (digitalArchive) => {
    let encryptedContent;
    try {
        encryptedContent = await StorageService.retrieve(digitalArchive.irysId);
    } catch (error) {
        console.error('Error retrieving from Irys:', error);
        encryptedContent = await StorageService.retrieve(digitalArchive.arweaveId);
    }
    return encryptedContent;
};

export {
    getEncryptedContent,
};