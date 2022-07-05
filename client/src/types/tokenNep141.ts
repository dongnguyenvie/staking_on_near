import { Contract } from 'near-api-js'

export interface TokenNep141Contract extends Contract {
  ft_transfer_call(
    payload?: { receiver_id: string; amount: string; msg: string },
    gas?: string,
    attachedDeposit?: string
  ): Promise<any>

  storage_balance_of(payload: {
    account_id: string
  }): Promise<null | { total: string; available: string }>
}

// near call dev-1653846714290-58446128043200

// ft_transfer_call '{"receiver_id": "dev-1654609907459-16983689322351", "amount": "6000", "msg": "staking"}' --accountId .testnet --gas 300000000000000  --depositYocto 1
