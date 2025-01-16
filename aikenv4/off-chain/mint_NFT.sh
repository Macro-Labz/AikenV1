#!/bin/bash

# Get parameters
utxoin="$1"
paymentAddress="$2"   # Changed from user_vkey_file
imageUrl="$3"

# Get policy ID
policyid=$(cat ./compiled/nft_token.pid)

# Update redeemer with user's key hash
./update_redeemer.sh "$vkey_hash" "$image_hash"

policyid=$(cat ../compiled/nft_token.pid)
service_address=$(cat ../env/wallets/address01/payment.ak)  # Your payment address
service_fee=2000000  # 2 ADA service fee
output="1500000"     # Minimum UTxO for NFT
tokenamount="1"
tokenname="$(echo -n "NFT-AI-GEN-TEST" | xxd -ps | tr -d '\n')"
mintingScript="../compiled/nft_token.uplc"
collateral="$3"
ownerPKH="$4"

cardano-cli conway transaction build \
  $PREVIEW \
  --tx-in $utxoin1 \
  --required-signer-hash $ownerPKH \
  --tx-in-collateral $collateral \
  --tx-out $service_address+$service_fee \
  --tx-out $address+$output+"$tokenAmount $policyid.$tokenname" \
  --change-address $address \
  --mint "$tokenMintedamount $policyid.$tokenname" \
  --mint-script-file $mintingScript \
  --mint-redeemer-file ../values/redeemer.json \
  --metadata-json-file ../values/NFTmetadata.json \
  --out-file mint_NFT.unsigned

cardano-cli conway transaction sign \
    --tx-body-file mint_NFT.unsigned \
    --signing-key-file $HOME/env/wallets/address01/addr01-skey.ak \
    --signing-key-file $HOME/Dev/Wallets/Adr07.skey \   #change this to the correct signing key
    $PREVIEW \
    --out-file mint_NFT.signed

cardano-cli conway transaction submit \
    $PREVIEW \
    --tx-file mint_NFT.signed