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
near call dev-1654609907459-16983689322351 stake '{"amount": "6000" }' --accountId nolannguyen.testnet --gas 300000000000000 --depositYocto 1
```