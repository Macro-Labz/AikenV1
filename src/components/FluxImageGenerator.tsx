import { useState } from "react";

interface FluxImageGeneratorProps {
    onImageGenerated: (imageUrl: string) => void;
    prompt: string;
}

export const FluxImageGenerator = ({ onImageGenerated, prompt }: FluxImageGeneratorProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateImage = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            
            if (data.images?.[0]?.url) {
                onImageGenerated(data.images[0].url);
            } else {
                setError("No image was generated");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image");
            console.error("Error generating image:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return { generateImage, isLoading, error };
}; 