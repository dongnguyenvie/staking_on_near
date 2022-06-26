type Args = Record<string, any>
// ref https://docs.near.org/docs/api/naj-quick-reference#contract
export interface INearParams<T = Args> {
  callbackUrl?: string // callbackUrl after the transaction approved (optional)
  meta?: string // meta information NEAR Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param
  args: T
  gas?: number // attached GAS (optional)
  amount?: number // attached deposit in yoctoNEAR (optional)
}
