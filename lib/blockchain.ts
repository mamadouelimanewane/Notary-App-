import { createHash } from 'crypto';

export interface Block {
    blockId: string;
    previousHash: string;
    currentHash: string;
    timestamp: string;
    data: any;
    signature?: string;
}

export class BlockchainService {
    /**
     * Computes a SHA-256 hash for a given data object and previous hash.
     */
    static computeHash(data: any, previousHash: string, timestamp: string): string {
        const content = JSON.stringify(data) + previousHash + timestamp;
        return createHash('sha256').update(content).digest('hex');
    }

    /**
     * Creates a new block for the chain.
     */
    static createBlock(data: any, previousBlock: Block | null): Block {
        const timestamp = new Date().toISOString();
        const previousHash = previousBlock ? previousBlock.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
        const blockId = crypto.randomUUID();

        const currentHash = this.computeHash(data, previousHash, timestamp);

        return {
            blockId,
            previousHash,
            currentHash,
            timestamp,
            data, // In a real blockchain, we might only store the merkle root, but here we store the data snapshot
        };
    }

    /**
     * Verifies the integrity of a chain of blocks.
     */
    static verifyChain(chain: Block[]): boolean {
        for (let i = 0; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = i > 0 ? chain[i - 1] : null;

            // 1. Verify previous hash link
            const expectedPreviousHash = previousBlock
                ? previousBlock.currentHash
                : '0000000000000000000000000000000000000000000000000000000000000000';

            if (currentBlock.previousHash !== expectedPreviousHash) {
                console.error(`Blockchain Break at block ${i}: Previous hash mismatch`);
                return false;
            }

            // 2. Verify current hash integrity
            const recalculatedHash = this.computeHash(
                currentBlock.data,
                currentBlock.previousHash,
                currentBlock.timestamp
            );

            if (currentBlock.currentHash !== recalculatedHash) {
                console.error(`Blockchain Break at block ${i}: Hash invalid`);
                return false;
            }
        }
        return true;
    }
}
