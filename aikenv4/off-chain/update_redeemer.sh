#!/bin/bash

vkey_hash="$1"    # User's verification key hash
image_hash="$2"   # Generated image hash

# Create redeemer with dynamic values
cat > ./compiled/redeemer.json << EOF
{
    "constructor": 0,
    "fields": [
        {
            "int": 0
        },
        {
            "bytes": "$vkey_hash"
        },
        {
            "bytes": "$image_hash"
        }
    ]
}
EOF 