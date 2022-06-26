import { useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useNear } from '#providers/NearProvider'

export default function Markets() {
  const { stakingContract, accountId, onStake } = useNear()
  const { contract, ready } = stakingContract
  const [amount, setAmount] = useState(3000)

  const { data: stakingData } = useQuery(
    'staking.has_stake',
    () => contract.has_stake({ _staker: accountId }),
    {
      enabled: ready && !!accountId,
    }
  )

  const handleStake = () => {
    onStake({ amount: '3000' })
  }

  if (!accountId) {
    return (
      <div>
        Click <b>"Connect wallet"</b> to connect near wallet, then u can stake, Pls
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap justify-around">
        <div className="w-full">
          <h1>Demo</h1>
        </div>
        <div className="w-full">
          <pre>{JSON.stringify(stakingData, null, 2)}</pre>
        </div>
        <div className="w-full">
          <input
            type="number"
            className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            placeholder="Number input"
          />
          <button
            onClick={handleStake}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            stake {amount}
          </button>
        </div>
      </div>
    </>
  )
}
