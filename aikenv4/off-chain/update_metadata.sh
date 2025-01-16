#!/bin/bash

# Takes 4 parameters:
image_url="$1"   # The FLUX generated image URL
prompt="$2"      # The user's prompt that generated the image
policy_id="$3"   # The policy ID from the mint.ak validator
token_name="$4"  # The name for this specific NFT

# Creates a new metadata file with the actual values
cat > ./compiled/NFTmetadata.json << EOF
{
    "721": {
        "$policy_id": {
            "$token_name": {
                "name": "Generated NFT",
                "image": "$image_url",
                "mediaType": "image/jpeg",
                "description": "AI Generated NFT using FLUX",
                "prompt": "$prompt"
            }
        }
    }
}
EOF