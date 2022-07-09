import { WalletConnection } from 'near-api-js'
import * as nearAPI from 'near-api-js'
import { useMemo } from 'react'
import { tokenConfig } from '#utils/token'
import { useQuery, useMutation } from 'react-query'
import { StakingContract } from '#types/stakingContract'
import keyBy from 'lodash/keyBy'
import { STAKING_CONTRACT } from '#utils/constants'

export const oracleContract = import.meta.env.VITE_ORACLE_CONTRACT

const assetIds = Object.keys(tokenConfig)

const initContract = (wallet: WalletConnection) =>
  new nearAPI.Contract(wallet.account(), STAKING_CONTRACT, {
    viewMethods: ['has_stake', 'decimals', 'reward_per_hour'],
    changeMethods: ['withdraw_stake'],
  }) as StakingContract

interface StakingContractProps {
  wallet: WalletConnection
}
export const useStakingContract = (props: StakingContractProps) => {
  const { wallet } = props

  const contract = useMemo(() => {
    if (!wallet) return
    return initContract(wallet)
  }, [wallet])

  const ready = useMemo(() => {
    return !!contract
  }, [contract])

  return {
    contract: contract!,
    ready,
  }
}
