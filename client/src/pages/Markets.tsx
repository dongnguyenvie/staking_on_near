import { useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useNear } from '#providers/NearProvider'
import dayjs from '#utils/dayjs'
import { utils } from 'near-api-js'

export default function Markets() {
  const { stakingContract, accountId, onStake, storageBalance } = useNear()
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

  // console.log({ stakingData, decimalsData })
  const totalClaimable = useMemo(() => stakingData?.total_amount || 0, [stakingData])
  const stakeds = useMemo(() => stakingData?.stakes || [], [stakingData])

  const handleStake = () => {
    onStake({ amount: `${amount}` })
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
          Total token staked: <span className="text-red-400"> {totalClaimable}</span>
        </p>
        <p className="font-bold w-full">
          award per hour: <span className="text-red-400"> {rewardPerHour}</span>
        </p>
        <div className="border border-neutral-500 p-2 rounded w-full">
          {stakeds.map((staked, idx) => {
            return (
              <div key={idx} className="border-t border-emerald-700">
                <p>amount: {staked.amount}</p>
                <p>reward: {utils.format.formatNearAmount(staked.claimable)}</p>
                <p>since: {dayjs(staked.since).format('DD/MM/YYYY HH:MM')} || </p>
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

function durationAsString(ms: any, maxPrecission = 3) {
  const duration = dayjs.duration(ms)

  const items = [] as any
  items.push({ timeUnit: 'd', value: Math.floor(duration.asDays()) })
  items.push({ timeUnit: 'h', value: duration.hours() })
  items.push({ timeUnit: 'm', value: duration.minutes() })
  items.push({ timeUnit: 's', value: duration.seconds() })

  const formattedItems = items.reduce((accumulator, { value, timeUnit }) => {
    if (accumulator.length >= maxPrecission || (accumulator.length === 0 && value === 0)) {
      return accumulator
    }

    accumulator.push(`${value}${timeUnit}`)
    return accumulator
  }, [])

  return formattedItems.length !== 0 ? formattedItems.join(' ') : '-'
}
