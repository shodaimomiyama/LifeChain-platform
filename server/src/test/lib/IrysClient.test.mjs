// src/test/lib/IrysClient.test.mjs
import IrysClient from '../../lib/IrysClient';
import { jest } from '@jest/globals';

describe('IrysClient', () => {
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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fund the Irys node', async () => {
        const amount = 1;
        const expectedFundedAmount = '1000000000000';

        IrysClient.irys.fund = jest.fn().mockResolvedValueOnce({ quantity: expectedFundedAmount });
        IrysClient.irys.utils.toAtomic = jest.fn().mockReturnValueOnce(expectedFundedAmount);
        IrysClient.irys.utils.fromAtomic = jest.fn().mockReturnValueOnce(amount);
        IrysClient.irys.token = 'ETH';

        await IrysClient.fund(amount);

        expect(IrysClient.irys.fund).toHaveBeenCalledWith(expectedFundedAmount);
        expect(IrysClient.irys.utils.toAtomic).toHaveBeenCalledWith(amount);
        expect(IrysClient.irys.utils.fromAtomic).toHaveBeenCalledWith(expectedFundedAmount);
    });

    it('should upload data', async () => {
        const data = 'Test data';
        const expectedReceipt = { id: 'Receipt ID' };

        IrysClient.irys.upload.mockResolvedValueOnce(expectedReceipt);

        const receipt = await IrysClient.upload(data);

        expect(IrysClient.irys.upload).toHaveBeenCalledWith(data);
        expect(receipt).toEqual(expectedReceipt);
    });

    it('should retrieve a receipt', async () => {
        const transactionID = 'Transaction ID';
        const expectedReceipt = { id: 'Receipt ID', data: 'Receipt data' };

        IrysClient.irys.utils.getReceipt.mockResolvedValueOnce(expectedReceipt);

        const receipt = await IrysClient.getReceipt(transactionID);

        expect(IrysClient.irys.utils.getReceipt).toHaveBeenCalledWith(transactionID);
        expect(receipt).toEqual(expectedReceipt);
    });

    it('should get the price for a given number of bytes', async () => {
        const numBytes = 1024;
        const expectedPrice = '1000000000000';

        IrysClient.irys.getPrice.mockResolvedValueOnce(expectedPrice);
        IrysClient.irys.utils.fromAtomic.mockReturnValueOnce(0.001);

        const price = await IrysClient.getPrice(numBytes);

        expect(IrysClient.irys.getPrice).toHaveBeenCalledWith(numBytes);
        expect(IrysClient.irys.utils.fromAtomic).toHaveBeenCalledWith(expectedPrice);
        expect(price).toBe(0.001);
    });
});