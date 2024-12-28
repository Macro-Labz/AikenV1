use aiken/builtin.{blake2b_256}
use aiken/cbor
use aiken/collection/dict
use aiken/collection/list
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
 
validator receipt {
  // This validator expects a minting transaction
  mint(_r: Data, policy_id: PolicyId, self: Transaction) {
    let Transaction { inputs, mint, .. } = self
 
    // Select the first input and concatenate its output reference and index to
    // generate the expected token name
    expect Some(first_input) = list.at(inputs, 0)
    expect [Pair(asset_name, quantity)] =
      mint |> assets.tokens(policy_id) |> dict.to_pairs()
 
    let expected_token_name =
      first_input.output_reference
        |> cbor.serialise
        |> blake2b_256
 
    // Compare the asset name with the first utxo output reference
    asset_name == expected_token_name && quantity == 1
  }
 
  // The validator will fail if the transaction is not for minting.
  else(_) {
    fail
  }
}