import React from 'react';
import { CardanoWallet } from '@meshsdk/react';

export default function HomePage() {
    return (
        <div className="home-page">
            <header className="home-header">
                <h1>AIKEN Smart Contract NFT Generator and Minting Service</h1>
                <div className="mb-20">
                    <CardanoWallet />
                </div>
            </header>
            
            <div className="home-content">
                <div className="side-container left-container">
                    {/* Left column content */}
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
                            {/* Image will be displayed here */}
                            <div className="placeholder-text">
                                Generated image will appear here
                            </div>
                        </div>
                    </div>
                    <div className="bottom-container">
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                className="message-input" 
                                placeholder="Type your prompt here..."
                            />
                            <button className="send-button">
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
                        <div className="right-container-content-header">
                            <h2>Generated Image Details:</h2>
                        </div>
                        <div className="right-container-content-body">
                            <p>Details about your generated image will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    