import React, { useState } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { FluxImageGenerator } from '../components/FluxImageGenerator';
import { AdaPriceDisplay } from '../components/AdaPriceDisplay';
import { BtcPriceDisplay } from '../components/BtcPriceDisplay';

export default function HomePage() {
    const { connected, wallet } = useWallet();
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [isMinting, setIsMinting] = useState(false);
    
    const { generateImage, isLoading, error } = FluxImageGenerator({
        onImageGenerated: setGeneratedImage,
        prompt
    });

    const handleGenerateImage = async () => {
        if (!prompt) return;
        await generateImage();
    };

    const handleMint = async () => {
        if (!connected || !generatedImage) return;
        
        try {
            setIsMinting(true);

            // 1. Get user's UTxOs with minimum ADA
            const utxos = await wallet.getUtxos();
            console.log('Available UTxOs:', utxos);  // Debug log

            const suitableUtxo = utxos.find(utxo => {
                const lovelaceAmount = utxo.output.amount.find(a => a.unit === 'lovelace');
                console.log('UTxO amount:', lovelaceAmount);  // Debug log
                return lovelaceAmount && BigInt(lovelaceAmount.quantity) >= BigInt(7000000);
            });

            if (!suitableUtxo) {
                throw new Error('No UTxO with sufficient ADA found (need at least 7 ADA)');
            }

            // Format UTxO string correctly
            const utxoString = `${suitableUtxo.input.txHash}#${suitableUtxo.input.outputIndex}`;
            console.log('UTxO string:', utxoString);  // Debug log

            // 2. Get user's payment address
            const addresses = await wallet.getUsedAddresses();
            if (!addresses.length) {
                throw new Error('No address found');
            }
            const paymentAddress = addresses[0];

            // 3. Call minting endpoint and wait for response
            const response = await fetch('/api/mint-nft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    utxo: utxoString,
                    paymentAddress: paymentAddress,
                    imageUrl: generatedImage,
                    prompt: prompt
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to mint NFT');
            }

            // 4. Get transaction to sign from response
            const { transaction } = await response.json();

            // 5. Sign transaction with wallet
            const signedTx = await wallet.signTx(transaction);

            // 6. Submit signed transaction
            const txHash = await wallet.submitTx(signedTx);

            console.log('NFT minted successfully, txHash:', txHash);
        } catch (error: any) {
            console.error("Error minting NFT:", error);
            alert(error.message || 'Failed to mint NFT');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>AIKEN Smart Contract NFT Generator and Minting Service</h1>
                <div className="header-controls">
                    <div className="price-container">
                        <BtcPriceDisplay />
                        <AdaPriceDisplay />
                    </div>
                    <div className="mb-20">
                        <CardanoWallet />
                    </div>
                </div>
            </header>
            
            <div className="home-content">
                <div className="side-container left-container">
                    <div className="left-container-content">
                        <div className="left-container-content-header">
                            <h2>How this application works:</h2>
                        </div>
                        <div className="left-container-content-body">
                            <p>This is a simple application that allows you to generate an image from text and mint it as an NFT on the Cardano blockchain.</p>
                        </div>
                    </div>
                </div>
                
                <div className="main-content">
                    <div className="main-container">
                        <div className="image-container">
                            {isMinting ? (
                                <div className="loading-spinner">Generating...</div>
                            ) : generatedImage ? (
                                <img 
                                    src={generatedImage} 
                                    alt="Generated artwork" 
                                    className="generated-image"
                                />
                            ) : (
                                <div className="placeholder-text">
                                    Generated image will appear here
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bottom-container">
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                className="message-input" 
                                placeholder="Type your prompt here..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleGenerateImage();
                                    }
                                }}
                            />
                            <button 
                                className="send-button"
                                onClick={handleGenerateImage}
                                disabled={isMinting}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="send-icon"
                                >
                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="side-container right-container">
                    <div className="right-container-content">
                        <div>
                            <div className="right-container-content-header">
                                <h2>Generated Image Details:</h2>
                            </div>
                            <div className="right-container-content-body">
                                <p>Prompt: {prompt || 'No prompt yet'}</p>
                            </div>
                        </div>
                        <div className="mint-button-wrapper">
                            <button 
                                className="mint-button"
                                onClick={handleMint}
                                disabled={!connected || !generatedImage || isMinting}
                            >
                                {isMinting ? 'Minting...' : 'MINT as NFT'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    