### Steps
```bash
sh scripts/build.sh
sh scripts/deploy.sh
sh scripts/init_total_supply.sh
```


### explaining
```
symbol: XXX
decimals: 12
totalSupply: 1000000000000
=> it means we have only [1 XXX]
=> because 1000000000000 / (12 * 10)
```
###
```
near call dev-1653846714290-58446128043200 ft_transfer_call '{"receiver_id": "dev-1654609907459-16983689322351", "amount": "6000", "msg": "staking"}' --accountId nolannguyen.testnet --gas 300000000000000  --depositYocto 1

```