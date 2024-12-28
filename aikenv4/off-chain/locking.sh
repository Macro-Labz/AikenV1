utxoin="________________INSERT UTXO HASH HERE______________#__INSERT UTXO INDEX HERE__"   
address=$(cat ./compiled/INSERT CONTRACT ADDRESS HERE)
output="INSERT OUTPUT AMOUNT HERE"
  #utxoin will have the utxo hash and the index for use in the transaction
  #address will be the address of the wallet that will send the funds
  #output will be the amount of funds to be sent to the address
cardano-cli conway transaction build \
  --testnet-magic 2 \
  --tx-in $utxoin \
  --tx-out $address+$output \
  --tx-out-datum-hash-file ./values/datum.json \
  --change-address _________________INSERT CHANGE ADDRESS HERE________________ \
  --out-file simple.unsigned
 #change address is the address of the wallet that will send the remaining funds in the utxo after the transaction is completed and fees are paid

cardano-cli conway transaction sign \
    --tx-body-file simple.unsigned \
    --signing-key-file $HOME/env/wallets/____INSERT WALLET NAME HERE____/______INSERT SIGNING KEY FILE HERE______ \
    --testnet-magic 2 \
    --out-file simple.signed
 #signing key file is the signing key of the wallet that will send the funds
cardano-cli conway transaction submit \
    --testnet-magic 2 \
    --tx-file simple.signed

    #cardano-cli conway address key-hash --payment-verification-key-file enterprise.vkey  use this command to ge the address key hash from the payment verification key
    #cardano-cli conway transaction submit $PREVIEW --tx-file paymentTx.signed   use this command to submit the transaction
    #testnet magic is the network magic number for the testnet ie. preview is 2 and mainnet is 1