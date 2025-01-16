import { useState, useEffect } from 'react';

export const ViperPriceDisplay = () => {
    const [price, setPrice] = useState<number | null>(null);

    const fetchPrice = async () => {
        try {
            const response = await fetch('/api/get-prices');
            const data = await response.json();
            setPrice(data.viper);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="viper-price">
            {price ? `VIPER: ₳${price.toFixed(6)}` : 'Loading...'}
        </div>
    );
}; 