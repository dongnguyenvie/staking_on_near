```bash
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
```

```rust
BorshSerialize, BorshDeserialize, => de and seri code onchain
Deserialize, Serialize => json for client
PanicOnDefault => {
    // normal case is default tu dong call new function
    // manually call init config contructure
    //     | ^^^^^^^^^^^^^^^ the trait `Default` is not implemented for `Stakeable`
}
```

```bash
# near call dev-1654609907459-16983689322351 stake '{"amount": "6000" }' --accountId nolannguyen.testnet --gas 300000000000000 --depositYocto 1

near view dev-1654609907459-16983689322351 has_stake '{"_staker": "nolannguyen.testnet" }' --accountId nolannguyen.testnet

near call dev-1653846714290-58446128043200 storage_deposit '{}'  --accountId dev-1654609907459-16983689322351 --amount 0.00235

# near call dev-1656265123675-10728825751930 new '{}'
near call dev-1656267374524-76899217654291 ft_on_transfer '{"sender_id":"nolannguyen.testnet", "amount": "1000", "msg":"staking"}' --accountId nolannguyen.testnet
near view dev-1656265123675-10728825751930 has_stake '{"_staker": "dev-1654609907459-16983689322351" }' --accountId nolannguyen.testnet
```

### apply algorithm to caculate award for staking token
```
- user will give 0.1% per hour
- (((now - locked_time) / 1hour) * locked_amount) * 0.1% => (((now - locked_time) / 1hour) * locked_amount) / 1000
```
