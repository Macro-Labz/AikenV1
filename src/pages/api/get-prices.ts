import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,cardano&vs_currencies=usd');
        const data = await response.json();
        
        return res.status(200).json({
            btc: data.bitcoin.usd,
            ada: data.cardano.usd
        });
    } catch (error) {
        console.error('Error fetching prices:', error);
        return res.status(500).json({ message: 'Failed to fetch prices' });
    }
} 