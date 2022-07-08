import BigNumber from 'bignumber.js'

export const tokenDecimal = new BigNumber(10).pow(16)

export const formatUnits = (bignum: string | number, decimal = 18) => {
  let num = new BigNumber(bignum)
  let denom = new BigNumber(10).pow(decimal)
  return num.dividedBy(denom).decimalPlaces(2)
}
