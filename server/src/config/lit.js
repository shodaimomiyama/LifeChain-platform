// src/config/lit.js
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { ethers } from "ethers";

const createLitContractClient = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const litContracts = new LitContracts({
        signer,
        network: process.env.LIT_NETWORK,
    });

    await litContracts.connect();

    return litContracts;
};

export default createLitContractClient;