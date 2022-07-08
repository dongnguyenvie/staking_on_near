import { useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useNear } from '#providers/NearProvider'
import dayjs from '#utils/dayjs'
import { formatUnits } from '#utils/number'

export default function Markets() {
  const { stakingContract, accountId, onStake, storageBalance, onWithdrawStake } = useNear()
  const { contract, ready } = stakingContract
  const [amount, setAmount] = useState(3000)

  const { data: stakingData } = useQuery(
    'staking.has_stake',
    () => contract.has_stake({ staker: accountId }),
    {
      enabled: ready && !!accountId,
    }
  )

  const { data: rewardPerHour } = useQuery(
    'staking.reward_per_hour',
    () => contract.reward_per_hour(),
    {
      enabled: ready && !!accountId,
    }
  )

  const totalClaimable = useMemo(() => stakingData?.total_amount || 0, [stakingData])
  const stakeds = useMemo(() => stakingData?.stakes || [], [stakingData])

  const handleStake = () => {
    onStake({ amount: `${amount}` })
  }

  const handleWithdrawStake = ({ amount, index }: any) => {
    onWithdrawStake({ amount, index })
  }

  if (!accountId) {
    return (
      <div>
        Click <b>"Connect wallet"</b> to connect near wallet, then u can stake, Pls
      </div>
    )
  }

  if (!storageBalance) {
    return <div>U need to storage_deposit to dev-1653846714290-58446128043200</div>
  }

  return (
    <>
      <div className="flex flex-wrap">
        <p className="text-lg">Account: {accountId}</p>
        <p className="font-bold w-full">
          Total token staked:{' '}
          <span className="text-red-400"> {formatUnits(totalClaimable).toString()} TOKEN</span>
        </p>
        <p className="font-bold w-full">
          award per hour: <span className="text-red-400"> {rewardPerHour}</span>
        </p>
        <p>xxx:{stakeds.length}</p>
        <div className="border border-neutral-500 p-2 rounded w-full mt-5">
          {stakeds.map((staked, idx) => {
            return (
              <div key={idx} className="border-b border-emerald-700 pb-2">
                <div>
                  <p>amount: {formatUnits(staked.amount).toString()}</p>
                  <p>reward: {formatUnits(staked.claimable).decimalPlaces(5).toString()}</p>
                  <p>since: {dayjs(staked.since).format('DD/MM/YYYY HH:MM')} || </p>
                </div>
                <div>
                  <Claimable
                    defaultAmount={formatUnits(staked.claimable)
                      .plus(formatUnits(staked.claimable))
                      .toNumber()}
                    onWithdrawStake={handleWithdrawStake}
                    index={idx}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="w-full mt-8">
          <input
            type="number"
            className=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            placeholder="Number input"
          />
          <button
            onClick={handleStake}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
          >
            stake {amount}
          </button>
        </div>
      </div>
    </>
  )
}

const Claimable = ({
  defaultAmount,
  onWithdrawStake,
  index,
}: {
  defaultAmount: number
  onWithdrawStake: ({ amount, index }: { amount: number; index: number }) => void
  index: number
}) => {
  const [amount, setAmount] = useState(defaultAmount)

  const handleChange = (e: any) => {
    let value = +e.target.value
    setAmount(value > defaultAmount ? defaultAmount : value)
    // setAmount(value)
  }

  const handleWithdrawStake = () => {
    onWithdrawStake({ amount, index })
  }

  return (
    <div className="flex items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleWithdrawStake}
      >
        Claim
      </button>
      <input
        type="number"
        className="ml-2 form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        value={amount}
        onChange={handleChange}
        placeholder="Number input"
      />
    </div>
  )
}
