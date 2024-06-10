// src/lib/LitActions.js
import { LitNodeClient } from '@lit-protocol/lit-node-client';

class LitActions {
    constructor(litNodeClient) {
        this.litNodeClient = litNodeClient;
    }

    async encryptWithPKP(data, pkpPublicKey) {
        const { encryptedString, symmetricKey } = await LitNodeClient.encryptString(
            data,
            pkpPublicKey
        );
        return { encryptedString, symmetricKey };
    }

    async decryptWithPKP(encryptedString, symmetricKey, pkpPublicKey) {
        const decryptedString = await LitNodeClient.decryptString(
            encryptedString,
            symmetricKey,
            pkpPublicKey
        );
        return decryptedString;
    }

    async checkAccess(pkpPublicKey, accessControlConditions) {
        const accessControlConditionsMet = await LitNodeClient.executeAccessControlConditions(
            accessControlConditions,
            pkpPublicKey
        );
        return accessControlConditionsMet;
    }
}

export default LitActions;