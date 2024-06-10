// src/test/services/storage/StorageService.test.mjs
import StorageService from '../../../services/storage/StorageService';
import IrysClient from '../../../lib/IrysClient';
import { jest } from '@jest/globals';

//jest.mock('../../../lib/IrysClient');

describe('StorageService', () => {

    let storageService;

    beforeEach(() => {
        IrysClient.irys = {
            upload: jest.fn(),
            utils: {
                getReceipt: jest.fn(),
                toAtomic: jest.fn(),
                fromAtomic: jest.fn(), // fromAtomicのモックを追加
            },
            getPrice: jest.fn(),
        };

        storageService = new StorageService();

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should store a digital archive', async () => {
        const digitalArchive = {
            encryptedContent: 'Encrypted content',
            encryptedSymmetricKey: 'Encrypted key',
            owner: 'User ID',
        };

        IrysClient.irys.upload.mockResolvedValueOnce({ id: 'Receipt ID' });
        IrysClient.irys.getPrice.mockResolvedValueOnce(0.000001);

        await storageService.store(digitalArchive);

        expect(IrysClient.irys.upload).toHaveBeenCalledWith('Encrypted content');
        expect(digitalArchive.irysId).toBe('Receipt ID');
        expect(digitalArchive.encryptedSymmetricKey).toBe('Encrypted key');
        expect(IrysClient.irys.getPrice).toHaveBeenCalled();

        console.log("you stored a digital archive successfly");
    });

    it('should retrieve a digital archive', async () => {
        const receiptId = 'Receipt ID';
        const data = 'Encrypted content';
        IrysClient.irys.utils.getReceipt.mockResolvedValueOnce({ id: receiptId });
        global.fetch = jest.fn().mockResolvedValueOnce({
            text: jest.fn().mockResolvedValueOnce(data),
        });

        const result = await storageService.retrieve(receiptId);

        expect(IrysClient.irys.utils.getReceipt).toHaveBeenCalledWith(receiptId);
        expect(global.fetch).toHaveBeenCalledWith(`https://gateway.irys.xyz/${receiptId}`);
        expect(result).toBe(data);

        // const receiptId = 'Receipt ID';
        // const encryptedContent = 'Encrypted content';

        // IrysClient.irys.utils.getReceipt.mockResolvedValueOnce({ data: encryptedContent });

        // const result = await storageService.retrieve(receiptId);

        // expect(IrysClient.irys.utils.getReceipt).toHaveBeenCalledWith(receiptId);
        // expect(result).toBe(encryptedContent); //resultの型が期待する型と違っている。これは構造上の本質的な問題。

        console.log("you retrieved a digital archive successfly");
    });

    it('should calculate the fee for storing data', async () => {
        const size = 1024;
        const pricePerByte = 0.001;

        IrysClient.irys.getPrice.mockResolvedValueOnce(pricePerByte.toString()); // Convert to string
        IrysClient.irys.getPrice.mockResolvedValueOnce(pricePerByte);

        const fee = await storageService.calculateFee(size);

        expect(IrysClient.irys.getPrice).toHaveBeenCalledWith(size);
        expect(IrysClient.irys.utils.fromAtomic).toHaveBeenCalledWith(pricePerByte.toString()); // Update this line
        expect(fee).toBe(pricePerByte);
    });
});


// // IrysClientのモックを作成
// const mockIrysClient = {
//     upload: jest.fn(),
//     getReceipt: jest.fn(),
//     getPrice: jest.fn(),
//     fund: jest.fn(),
// };


// const mockStorageService = {
//     store: jest.fn(),
//     retrieve: jest.fn(),
//     calculateFee: jest.fn(),
// };


// // StorageServiceのコンストラクタにモックを注入
// jest.mock('../../../lib/IrysClient', () => {
//     return jest.fn().mockImplementation(() => mockIrysClient);
// });

// jest.mock('../../../services/storage/StorageService', () => {
//     return jest.fn().mockImplementation(() => mockStorageService);
// });


// describe('StorageService', () => {

//     jest.setTimeout(10000); // タイムアウト時間を10秒に設定

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     beforeEach(() => {
//         // storageService = new StorageService();
//         mockIrysClient.upload.mockClear();
//         mockIrysClient.getReceipt.mockClear();
//         mockIrysClient.getPrice.mockClear();
//         mockIrysClient.fund.mockClear();
//         mockStorageService.store.mockClear();
//         mockStorageService.retrieve.mockClear();
//         mockStorageService.calculateFee.mockClear();
//     });

//     beforeAll(async () => {
//         // テスト実行前にIrysノードに資金を提供
//         await mockIrysClient.fund(1);
//     });


//     it('should store a digital archive', async () => {
//         const digitalArchive = {
//             encryptedContent: 'Encrypted content',
//             encryptedSymmetricKey: 'Encrypted key',
//             owner: 'User ID',
//         };

//         mockIrysClient.upload.mockResolvedValueOnce({ id: 'Receipt ID' });
//         mockIrysClient.getPrice.mockResolvedValueOnce(0.000001);

//         const result = await mockStorageService.store(digitalArchive);

//         expect(mockIrysClient.upload).toHaveBeenCalledWith('Encrypted content');
//         expect(result.irysId).toBe('Receipt ID');
//         expect(result.encryptedSymmetricKey).toBe('Encrypted key');
//         expect(mockIrysClient.getPrice).toHaveBeenCalled();
//     });

//     it('should retrieve a digital archive', async () => {
//         const receiptId = 'Receipt ID';
//         const encryptedContent = 'Encrypted content';

//         mockIrysClient.getReceipt.mockResolvedValueOnce({ data: encryptedContent });

//         const result = await mockStorageService.retrieve(receiptId);

//         expect(mockIrysClient.getReceipt).toHaveBeenCalledWith(receiptId);
//         expect(result).toBe(encryptedContent);
//     });

//     it('should calculate the fee for storing data', async () => {
//         const size = 1024;
//         const pricePerByte = 0.001;

//         mockIrysClient.getPrice.mockResolvedValueOnce(pricePerByte);

//         const fee = await mockStorageService.calculateFee(size);

//         expect(mockIrysClient.getPrice).toHaveBeenCalledWith(size);
//         expect(fee).toBe(pricePerByte);
//     });
// });

//この部分では、StorageServiceの各メソッドに対するテストを追加しています。IrysClientのメソッドをモックし、storeメソッドがデータを正しく保存できること、retrieveメソッドが保存されたデータを取得できること、およびcalculateFeeメソッドが正しく料金を計算できることを確認しています


