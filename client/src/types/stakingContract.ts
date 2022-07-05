import { Contract } from 'near-api-js'

export interface StakingContract extends Contract {
  has_stake(payload?: { staker: string }): Promise<HasStakeResp>
  decimals(): Promise<number>
  reward_per_hour(): Promise<number>
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
