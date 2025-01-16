use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId}
use cardano/transaction.{Input, OutputReference, Transaction}

pub type ConditionsRedeemer {
  action: Action,
  owner: VerificationKeyHash,
  image_hash: ByteArray,
}

// Hash of the generated image for verification

pub type Action =
  Int

validator ea_nft(unique_utxo: OutputReference, token_name: AssetName) {
  mint(
    redeemer: ConditionsRedeemer,
    policy_id: PolicyId,
    transaction: Transaction,
  ) {
    and {
      // Verify UTxO is being spent
      utxo_spent(unique_utxo, transaction)?,
      // Verify only one token is being minted
      there_can_be_only_one(transaction, policy_id, token_name)?,
      // Verify owner signature
      must_be_signed_by(transaction, redeemer.owner)?,
    }
  }

  else(_) {
    fail
  }
}

pub fn utxo_spent(utxo_ref: OutputReference, tx_info: Transaction) {
  let Transaction { inputs, .. } = tx_info
  inputs |> list.any(fn(input) { input.output_reference == utxo_ref })
}

pub fn there_can_be_only_one(
  tx_info: Transaction,
  policy_id: PolicyId,
  token_name: AssetName,
) {
  let Transaction { mint, .. } = tx_info
  expect [Pair(asset_name, amount)] =
    dict.to_pairs(assets.tokens(mint, policy_id))
  amount == 1 && asset_name == token_name
}

pub fn must_be_signed_by(transaction: Transaction, vk: VerificationKeyHash) {
  list.has(transaction.extra_signatories, vk)
}
