// server/src/services/storage/StorageService.js
import IrysClient from '../../lib/IrysClient';
import CustomError from '../../utils/CustomError'
import EncryptionService from '../encryption/EncryptionService';
import DigitalArchive from '../../models/digitalArchive/DigitalArchive'

class StorageService {

    constructor() {
        this.irysClient = IrysClient;
    }

    async store(digitalArchive) {
        const { encryptedContent, encryptedSymmetricKey } = digitalArchive;
        try {
            const receipt = await this.irysClient.upload(encryptedContent);
            digitalArchive.irysId = receipt.id;
            digitalArchive.encryptedSymmetricKey = encryptedSymmetricKey;
            const size = Buffer.byteLength(encryptedContent, 'utf8');
            const fee = await this.calculateFee(size);
            console.log(`User ${digitalArchive.owner} was charged ${fee} for storing ${size} bytes.`);
            return digitalArchive;
        } catch (error) {
            console.error('Error storing digital archive:', error);
            throw new CustomError('Error storing digital archive', 500);
        }
    }


    async retrieve(id) {
        try {
            const receipt = await this.irysClient.getReceipt(id);
            const gatewayUrl = `https://gateway.irys.xyz/${receipt.id}`;
            const response = await fetch(gatewayUrl);
            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Error retrieving from Irys:', error);
            throw new CustomError('Error retrieving digital archive', 500);
        }
    }

    async calculateFee(size) {
        const pricePerByte = await this.irysClient.getPrice(size);
        return pricePerByte;
    }
}

export default StorageService;

/*
役割：デジタルアーカイブの保存と取得を担当するサービス
IrysClientとArweaveClientを使用して、データの保存と取得を行う
デジタルアーカイブの保存時には、料金の計算も行う
*/