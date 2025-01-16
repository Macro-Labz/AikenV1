#!/bin/bash

PAYMENT_AMOUNT=7000000  # 7 ADA in lovelace
utxoin="$1"   # Pass UTxO as parameter
address=$(cat ./compiled/simple.addr)
signing_key="$3"  # User's signing key file path

# Let cardano-cli calculate the minimum fee
fee=$(cardano-cli conway transaction build \
  --tx-body-file simple.unsigned \
  --tx-in-count 1 \
  --tx-out-count 2 \
  --witness-count 1 \
  --testnet-magic 2)

TOTAL_AMOUNT=$((PAYMENT_AMOUNT + fee))

cardano-cli conway transaction build \
  --testnet-magic 2 \
  --tx-in $utxoin \
  --tx-out $address+$TOTAL_AMOUNT \
  --tx-out-datum-hash-file ./values/datum.json \
  --change-address $2 \
  --out-file simple.unsigned

cardano-cli conway transaction sign \
    --tx-body-file simple.unsigned \
    --signing-key-file $signing_key \
    --testnet-magic 2 \
    --out-file simple.signed

cardano-cli conway transaction submit \
    --testnet-magic 2 \
    --tx-file simple.signed

    #cardano-cli conway address key-hash --payment-verification-key-file enterprise.vkey  use this command to ge the address key hash from the payment verification key
    #cardano-cli conway transaction submit $PREVIEW --tx-file paymentTx.signed   use this command to submit the transaction
    #testnet magic is the network magic number for the testnet ie. preview is 2 and mainnet is 1