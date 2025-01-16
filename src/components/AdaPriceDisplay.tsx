import { useState, useEffect } from 'react';

export const AdaPriceDisplay = () => {
    const [price, setPrice] = useState<number | null>(null);

    const fetchPrice = async () => {
        try {
            const response = await fetch('/api/get-prices');
            const data = await response.json();
            setPrice(data.ada);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPrice();
        // Update price every 60 seconds
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ada-price">
            {price ? `ADA: $${price.toFixed(2)}` : 'Loading...'}
        </div>
    );
}; 