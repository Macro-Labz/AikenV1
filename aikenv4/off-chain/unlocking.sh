utxoin="________________INSERT UTXO HASH HERE________________#___INSERT UTXO INDEX HERE___"
address=________________INSERT CHANGE ADDRESS HERE________________
collateral="________________INSERT COLLATERAL HASH HERE________________" 
output="________________INSERT OUTPUT AMOUNT HERE________________"
signer1=$(cat $HOME/env/wallets/____INSERT WALLET NAME HERE____/______INSERT SIGNING KEY FILE HERE______)
signer2=$(cat $HOME/env/wallets/____INSERT WALLET NAME HERE____/______INSERT SIGNING KEY FILE HERE______)
# collateral is an additional utxo that is required to be included in the transaction to cover the fees for the transaction in the case of a failed transaction
# Can be the application creators personal utxo or can be a dynamic input for the user that is creating the transaction and if that is the case....
# ...then the user will need to have a utxo that is large enough to cover the fees for the transaction and it will have to be specified in the locking shell script as....
# ...an additional input lock utxo and will have to be returned to the user in the unlocking shell script as an additional output lock utxo ie change address....
# ...depending on the design requiremnts of the application 
#signer1 and signer2 are the signing keys for the two required signers for the transaction
cardano-cli conway transaction build \
  --testnet-magic 2 \
  --tx-in $utxoin \
  --tx-in-script-file ./compiled/simple.uplc \
  --tx-in-datum-file ./values/datum.json \
  --tx-in-redeemer-file ./values/value_0.json \
  --required-signer-hash $signer1 \
  --required-signer-hash $signer2 \
  --tx-in-collateral $collateral \
  --tx-out $address+$output \
  --change-address _________________INSERT CHANGE ADDRESS HERE________________ \
  --out-file simple_unlocking.unsigned
#change address is the address of the wallet that will send the remaining funds in the utxo after the transaction is completed and fees are paid
#simple.uplc is the compiled script that is being used to lock the funds 
# It is ^^ created when you use the command aiken build --output simple.uplc after the locking script is created and the validator is.....
# ... compiled make sure routing is correct and formated correctly
cardano-cli conway transaction sign \
    --tx-body-file simple_unlocking.unsigned \
    --signing-key-file $HOME/env/wallets/____INSERT WALLET NAME HERE____/______INSERT SIGNING KEY FILE HERE______ \
    --signing-key-file $HOME/env/wallets/____INSERT WALLET NAME HERE____/______INSERT SIGNING KEY FILE HERE______ \
    $PREVIEW \
    --out-file simple_unlocking.signed
#signing keys are required for anyone that wants to pull value out of a locked tx. 
#this section ^ can be either dynamic to the user that creates the tx or filled in manually for simple designs for testing purposes
cardano-cli conway transaction submit \
    $PREVIEW \
    --tx-file simple_unlocking.signed
    #$PREVIEW is the preview flag for the testnet ie. 2 for testnet and 1 for mainnet