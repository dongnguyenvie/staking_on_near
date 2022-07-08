import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import * as nearAPI from 'near-api-js'
import { ConnectConfig, Near, utils, WalletConnection } from 'near-api-js'
import { useStakingContract } from './useStakingContract'
import { useTokenContract } from './useTokenContract'
import { STAKING_CONTRACT } from '#utils/constants'
import { formatUnits } from '#utils/number'

const nearConfig: ConnectConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  headers: {
    'Content-Type': 'application/json',
  },
}

const initNear = async () =>
  await nearAPI.connect(
    Object.assign(
      { deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  )
const initWallet = (near: Near) => new nearAPI.WalletConnection(near, null)

interface INearContext {
  walletReady: boolean
  nearReady: boolean
  nearLoading: boolean
  walletLoading: boolean
  near: Near
  wallet: WalletConnection
  onSignIn: () => void
  stakingContract: ReturnType<typeof useStakingContract>
  ready: boolean

  onStake: (params: { amount: string }) => Promise<any>
  accountId: string
  storageBalance: any
}
const NearContext = createContext<INearContext>({} as unknown as INearContext)
type NearProviderProps = {
  children: ReactNode
}

function NearProvider({ children }: NearProviderProps) {
  const [near, setNear] = useState<Near>()
  const [wallet, setWallet] = useState<WalletConnection>()
  const [nearLoading, setNearLoading] = useState(false)
  const [storageBalance, setStorageBalance] = useState<any>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const stakingContract = useStakingContract({ wallet: wallet! })
  const tokenContract = useTokenContract({ wallet: wallet! })

  const nearReady = useMemo(() => {
    return !nearLoading && !!near
  }, [near, nearLoading])

  const walletReady = useMemo(() => {
    return !walletLoading && !!wallet
  }, [wallet, walletLoading])

  const ready = useMemo(() => {
    return walletReady && nearReady
  }, [walletReady, nearReady])

  const accountId = useMemo(() => {
    return wallet?.getAccountId()
  }, [wallet])

  const connectNear = async () => {
    setNearLoading(true)
    try {
      const near = await initNear()
      setNear(near)
    } catch (error) {
      console.log('connectNear::', error)
    }
    setNearLoading(false)
  }

  const connectWallet = async () => {
    if (!near) return
    setWalletLoading(true)
    try {
      const wallet = await initWallet(near)
      setWallet(wallet)
    } catch (error) {
      console.log('connectWallet::', error)
    }
    setWalletLoading(false)
  }

  const signIn = () => {
    if (!walletReady) return
    wallet!.requestSignIn(
      '', // contract requesting access
      'Nolan App' // optional
      // 'http://localhost:3000/markets?flg=success', // optional
      // 'http://localhost:3000/markets?flg=failure'
    )
  }

  const stake = async ({ amount }: { amount: string }) => {
    const { contract, ready } = tokenContract
    if (!ready) return

    const resp = await contract.ft_transfer_call(
      {
        receiver_id: STAKING_CONTRACT,
        amount: formatUnits(amount, -18).toString(),
        msg: 'staking',
      },
      '300000000000000',
      '1'
    )

    return resp
  }

  const fetchStorageBalance = async ({ accountId }: any) => {
    const { contract, ready } = tokenContract
    const resp = await contract.storage_balance_of({ account_id: accountId })
    setStorageBalance(resp)
  }

  useEffect(() => {
    connectNear()
  }, [])

  useEffect(() => {
    connectWallet()
  }, [near])

  useEffect(() => {
    if (!accountId) return
    fetchStorageBalance({ accountId })
  }, [accountId])

  return (
    <NearContext.Provider
      value={{
        walletReady,
        nearReady,
        nearLoading,
        walletLoading,
        near: near!,
        wallet: wallet!,
        onSignIn: signIn,
        ready: ready,
        stakingContract: stakingContract,
        onStake: stake,
        accountId: accountId,
        storageBalance: storageBalance,
      }}
    >
      {children}
    </NearContext.Provider>
  )
}

const useNear = () => useContext(NearContext)

export { NearProvider, NearContext, useNear }
