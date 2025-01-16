#!/bin/bash

CHANGE_AMOUNT=2000000  # 2 ADA in lovelace

utxoin="$1"
address="$2"
collateral="$3"

cardano-cli conway transaction build \
  --testnet-magic 2 \
  --tx-in $utxoin \
  --tx-in-script-file ./compiled/simple.uplc \
  --tx-in-datum-file ./values/datum.json \
  --tx-in-redeemer-file ./values/redeemer.json \
  --mint-script-file ./compiled/mint.uplc \
  --mint "1 $policy_id.$token_name" \
  --tx-out "$address+$CHANGE_AMOUNT + 1 $policy_id.$token_name" \
  --tx-in-collateral $collateral \
  --change-address $address