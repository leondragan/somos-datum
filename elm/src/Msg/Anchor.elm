module Msg.Anchor exposing (FromAnchorMsg(..), ToAnchorMsg(..))

import Model.Ledger exposing (EscrowItem, Ledgers)
import Model.Wallet exposing (Wallet)


type ToAnchorMsg
    = InitProgram Wallet
    | PurchasePrimary Wallet
    | SubmitToEscrow Price Ledgers
    | PurchaseSecondary EscrowItem Wallet


type alias Price =
    String


type
    FromAnchorMsg -- TODO; clean up failures in favor of generic
    -- state lookup attempt
    = SuccessOnStateLookup String
    | FailureOnStateLookup String
      -- init program attempt
    | FailureOnInitProgram String
      -- purchase primary attempt
    | FailureOnPurchasePrimary String
      -- submit to escrow attempt
    | FailureOnSubmitToEscrow String
      -- purchase secondary attempt
    | FailureOnPurchaseSecondary String
