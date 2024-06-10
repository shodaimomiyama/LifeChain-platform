// KeyManagementService.test.js
import KeyManagementService from '../../../services/keyManagement/keyManagementService'

describe('KeyManagementService', () => {
    let keyManagementService;

    beforeEach(() => {
        keyManagementService = new KeyManagementService();
    });

    describe('generateKeyPair', () => {
        it('should generate a new key pair', async () => {
            const owner = 'Owner Address';
            const keyPairId = 'Key Pair ID';

            const keyPair = await keyManagementService.generateKeyPair(owner, keyPairId);

            expect(keyPair.publicKey).toBeDefined();
            expect(keyPair.privateKey).toBeDefined();
            expect(keyPair.owner).toBe(owner);
            expect(keyPair.id).toBe(keyPairId);
        });
    });

    describe('transferOwnership', () => {
        it('should transfer ownership of a key pair', async () => {
            const oldOwner = 'Old Owner Address';
            const newOwner = 'New Owner Address';
            const keyPairId = 'Key Pair ID';

            await keyManagementService.generateKeyPair(oldOwner, keyPairId);
            await keyManagementService.transferOwnership(oldOwner, newOwner, keyPairId);

            const keyPair = await keyManagementService.getKeyPairById(keyPairId);
            expect(keyPair.owner).toBe(newOwner);
        });

        it('should throw an error if the current owner does not match', async () => {
            const oldOwner = 'Old Owner Address';
            const newOwner = 'New Owner Address';
            const keyPairId = 'Key Pair ID';

            await keyManagementService.generateKeyPair(oldOwner, keyPairId);

            await expect(
                keyManagementService.transferOwnership('Wrong Owner', newOwner, keyPairId)
            ).rejects.toThrow('Current owner does not match');
        });
    });

    describe('getKeyPairById', () => {
        it('should return the key pair by ID', async () => {
            const owner = 'Owner Address';
            const keyPairId = 'Key Pair ID';

            const generatedKeyPair = await keyManagementService.generateKeyPair(owner, keyPairId);
            const retrievedKeyPair = await keyManagementService.getKeyPairById(keyPairId);

            expect(retrievedKeyPair).toEqual(generatedKeyPair);
        });

        it('should throw an error if the key pair does not exist', async () => {
            await expect(
                keyManagementService.getKeyPairById('Non-existent Key Pair ID')
            ).rejects.toThrow('Key pair not found');
        });
    });
});