```
1000


(1000 - 500) /


(((block.timestamp - _current_stake.since) / 1 hours) * _current_stake.amount) / rewardPerHour;

timelock / 1hour
hour_time_lock * amount
(1000 * 5000) /

1h = 0.1%
100h = 10%
lock = 1000
=> 1100
100 * 1000 / 0.1

```

### Testing staking and withdraw

```
near call dev-1656267374524-76899217654291 ft_on_transfer '{"sender_id":"nolannguyen.testnet", "amount": "1000", "msg":"staking"}' --accountId nolannguyen.testnet

near view dev-1656267374524-76899217654291 has_stake '{"staker":"nolannguyen.testnet"}' --accountId nolannguyen.testnet

near call dev-1656267374524-76899217654291 withdraw_stake '{"amount": "400", "stake_index": 0}' --accountId nolannguyen.testnet
```

##

1kitu -> 1byte
100k byte(1trieu ki tu) -> 1near
/8 ra byte -> 8bit = 1byte

###

```
normal case
0.25 near ->


pub(crate) fn refund_deposit(storage_used: u64) {
    // Tính lượng tiền cần nạp để cover storage
    let required_cost = env::storage_byte_cost() * Balance::from(storage_used);
    let attached_deposit = env::attached_deposit();

    // Nếu người dùng deposit lượng tiền ít hơn lượng cần thiết để lưu data -> Báo lỗi
    assert!(
        attached_deposit >= required_cost,
        "Must attach {} yoctoNear to cover storage",
        required_cost
    );

    let refund_amount = attached_deposit -
```
