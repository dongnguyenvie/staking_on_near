import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs
export type Dayjs = dayjs.Dayjs

export const isDateEqual = (date1: Dayjs, date2: Dayjs) => {
  return date1.isSame(date2, 'year') && date1.isSame(date2, 'month') && date1.isSame(date2, 'date')
}
