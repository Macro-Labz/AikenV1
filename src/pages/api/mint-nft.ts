import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { utxo, paymentAddress, imageUrl, prompt } = req.body;

    try {
        // 1. Update metadata
        await execAsync(`
            ${path.join(process.cwd(), 'aikenv4/off-chain/update_metadata.sh')} \
            "${imageUrl}" \
            "${prompt}" \
            "$(cat ${path.join(process.cwd(), 'aikenv4/off-chain/compiled/nft_token.pid')})" \
            "NFT-AI-GEN-TEST"
        `);

        // 2. Build the transaction
        const { stdout: txHex } = await execAsync(`
            ${path.join(process.cwd(), 'aikenv4/off-chain/mint_NFT.sh')} \
            "${utxo}" \
            "${paymentAddress}" \
            "${imageUrl}"
        `);

        return res.status(200).json({ 
            transaction: txHex,
            message: 'Transaction ready for signing' 
        });
    } catch (error) {
        console.error('Error minting NFT:', error);
        return res.status(500).json({ message: 'Failed to mint NFT' });
    }
} 