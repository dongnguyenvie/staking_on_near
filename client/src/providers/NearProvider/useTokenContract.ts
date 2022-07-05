import { WalletConnection } from 'near-api-js'
import * as nearAPI from 'near-api-js'
import { useMemo } from 'react'
import { tokenConfig } from '#utils/token'
import { StakingContract } from '#types/stakingContract'
import { TOKEN_NEP141_CONTRACT } from '#utils/constants'
import { TokenNep141Contract } from '#types/tokenNep141'

export const oracleContract = import.meta.env.VITE_ORACLE_CONTRACT

const assetIds = Object.keys(tokenConfig)

const initContract = (wallet: WalletConnection) =>
  new nearAPI.Contract(wallet.account(), TOKEN_NEP141_CONTRACT, {
    viewMethods: ['storage_balance_of'],
    changeMethods: ['ft_transfer_call'],
  }) as TokenNep141Contract

interface StakingContractProps {
  wallet: WalletConnection
}
export const useTokenContract = (props: StakingContractProps) => {
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
