// src/services/keyManagement/KeyManagementService.js

import { LitContracts } from "@lit-protocol/contracts-sdk";
import { ethers } from "ethers";
import EncryptionService from "../encryption/EncryptionService";
import LitActions from "../../lib/LitActions";


class KeyManagementService {
    constructor(contractClient) {
        this.contractClient = contractClient;
    }

    async generateKeyPair(owner, keyPairId) {
        const wallet = ethers.Wallet.createRandom();
        const publicKey = wallet.publicKey;
        const privateKey = wallet.privateKey;

        await this.contractClient.mintPKP({
            owner,
            publicKey,
            tokenId: keyPairId,
        });

        return {
            id: keyPairId,
            publicKey,
            privateKey,
            owner,
        };
    }

    async transferOwnership(currentOwner, newOwner, keyPairId) {
        const keyPair = await this.getKeyPairById(keyPairId);

        if (keyPair.owner !== currentOwner) {
            throw new Error("Current owner does not match");
        }

        await this.contractClient.transferPKP({
            from: currentOwner,
            to: newOwner,
            tokenId: keyPairId,
        });

        keyPair.owner = newOwner;
        return keyPair;
    }

    async getKeyPairById(keyPairId) {
        const tokenId = keyPairId;
        const pkpInfo = await this.contractClient.getPKPInfo({ tokenId });

        if (!pkpInfo) {
            throw new Error("Key pair not found");
        }

        return {
            id: tokenId,
            publicKey: pkpInfo.publicKey,
            owner: pkpInfo.owner,
        };
    }

    async encryptPrivateKey(privateKey, publicKey) {
        const encryptedPrivateKey = await EncryptionService.encryptWithPublicKey(
            privateKey,
            publicKey
        );
        return encryptedPrivateKey;
    }

    async decryptPrivateKey(encryptedPrivateKey, privateKey) {
        const decryptedPrivateKey = await EncryptionService.decryptWithPrivateKey(
            encryptedPrivateKey,
            privateKey
        );
        return decryptedPrivateKey;
    }
    async setDecryptionConditions(keyPairId, conditions) {
        const encryptedConditions = await LitActions.encryptWithSymmetricKey(
            conditions,
            keyPairId
        );

        await this.contractClient.setDecryptionConditions({
            tokenId: keyPairId,
            conditions: encryptedConditions,
        });
    }

    async getDecryptionConditions(keyPairId) {
        const encryptedConditions = await this.contractClient.getDecryptionConditions(
            { tokenId: keyPairId }
        );

        const conditions = await LitActions.decryptWithSymmetricKey(
            encryptedConditions,
            keyPairId
        );

        return conditions;
    }

}

export default KeyManagementService;