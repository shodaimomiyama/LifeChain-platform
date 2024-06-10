// src/lib/IrysClient.js
import Irys from "@irys/sdk";
import * as dotenv from 'dotenv';

dotenv.config();
//import { getIrys } from "@irys/sdk";

class IrysClient {

    constructor() {
        this.irys = null;
        this.init();
    }

    async init() {
        try {
            const network = "devnet";
            const providerUrl = "https://arweave.devnet.irys.xyz";
            const token = "ethereum";

            this.irys = new Irys({
                network,
                token,
                key: process.env.PRIVATE_KEY,
                config: { providerUrl },
            });
            return this.irys;
        } catch (error) {
            console.error('Error initializing IrysClient:', error);
            throw error;
        }
    }


    async fund(amount) {
        try {
            const fundTx = await this.irys.fund(this.irys.utils.toAtomic(amount));
            console.log(`Successfully funded ${this.irys.utils.fromAtomic(fundTx.quantity)} ${this.irys.token}`);
        } catch (e) {
            console.log("Error funding node ", e);
        }
    };

    async getLoadedBalance() {
        const atomicBalance = await this.irys.getLoadedBalance();
        const convertedBalance = this.irys.utils.fromAtomic(atomicBalance);
        return convertedBalance;
    };

    async getPrice(numBytes) {
        const priceAtomic = await this.irys.getPrice(numBytes);
        const priceConverted = this.irys.utils.fromAtomic(priceAtomic);
        return priceConverted;
    };

    async upload(data) {
        if (!this.irys) {
            throw new Error('IrysClient not initialized');
        }
        try {
            const receipt = await this.irys.upload(data);
            console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
            return receipt;
        } catch (error) {
            console.error("Error uploading data", error);
            throw error;
        }
    };

    async uploadFile(filePath, tags) {
        try {
            const response = await this.irys.uploadFile(filePath, tags);
            return response;
        } catch (e) {
            console.log("Error uploading file ", e);
            throw e;
        }
    };

    async uploadFolder(folderPath, options) {
        try {
            const response = await this.irys.uploadFolder(folderPath, options);
            return response;
        } catch (e) {
            console.log("Error uploading folder ", e);
            throw e;
        }
    };

    async getReceipt(transactionID) {
        if (!this.irys) {
            throw new Error('IrysClient not initialized');
        }
        try {
            const receipt = await this.irys.utils.getReceipt(transactionID);
            return receipt;
        } catch (error) {
            console.error('Error getting receipt:', error);
            throw error;
        }
    };
}

export default new IrysClient();

