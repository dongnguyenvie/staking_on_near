import { Contract } from 'near-api-js'

export interface StakingContract extends Contract {
  has_stake(payload?: { _staker: string }): Promise<HasStakeResp>
}

interface HasStakeResp {
  total_amount: string
  stakes: Stake[]
}

interface Stake {
  address: string
  amount: string
  since: number
  claimable: string
}
