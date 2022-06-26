use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, ext_contract, near_bindgen, AccountId, Balance, PromiseOrValue, PromiseResult,
};
use near_sdk::{Gas, PanicOnDefault};

pub const REWARD_PER_HOUR: usize = 1_000;
pub const ONE_HOUR: u64 = 3600_000;
pub const FT_TRANSFER_GAS: Gas = Gas(10_000_000_000_000);

pub const DEPOSIT_ONE_YOCTO: Balance = 1;
pub const NO_DEPOSIT: Balance = 0;
pub const FT_HARVEST_CALLBACK_GAS: Gas = Gas(10_000_000_000_000);

#[ext_contract(ext_ft)]
trait FungibleToken {
    // change methods
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
    fn ft_transfer_call(
        &mut self,
        receiver_id: String,
        amount: String,
        memo: Option<String>,
        msg: String,
    ) -> U128;

    // view methods
    fn ft_total_supply(&self) -> String;
    fn ft_balance_of(&self, account_id: String) -> String;
}

// #[ext_contract(ext_self)]
// pub trait StakeableCallback {
//     fn ft_on_transfer(&mut self, sender_id: ValidAccountId, amount: U128, msg: String) -> String;
// }

/**
 * @notice
 * A stake struct is used to represent the way we store stakes,
 * A Stake will contain the users address, the amount staked and a timestamp,
 * Since which is when the stake was made
 */

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Stake {
    address: AccountId,
    amount: U128,
    since: u64,
    claimable: U128,
}

/**
 * @notice Stakeholder is a staker that has active stakes
 */
#[derive(Clone, BorshSerialize, BorshDeserialize)]
pub struct StakeHolder {
    address: AccountId,
    address_stakes: Vec<Stake>,
}

/**
 * @notice
 * StakingSummary is a struct that is used to contain all stakes performed by a certain account
 */
#[derive(Clone, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct StakingSummary {
    total_amount: U128,
    stakes: Vec<Stake>,
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshSerialize, BorshDeserialize)]
pub struct Stakeable {
    /**
     * @notice
     *   This is a array where we store all Stakes that are performed on the Contract
     *   The stakes for each address are stored at a certain index, the index can be found using the stakes mapping
     */
    stakeholders: Vec<StakeHolder>,
    /**
     * @notice
     * stakes is used to keep track of the INDEX for the stakers in the stakes array
     */
    stakes: LookupMap<AccountId, usize>,
    /**
    * @notice
     rewardPerHour is 1000 because it is used to represent 0.001, since we only use integer numbers
     This will give users 0.1% reward for each staked token / H
    */
    reward_per_hour: usize,

    nolan_token_id: AccountId,
    owner_id: AccountId,
}

// impl Default for Stakeable {
//     fn default() -> Self {
//         Self {
//             stakeholders: Vec::new(),
//             stakes: LookupMap::new(b"stakes".to_vec()),
//             reward_per_hour: REWARD_PER_HOUR,
//             nolan_token_id: "",
//         }
//     }
// }

#[near_bindgen]
impl Stakeable {
    #[init]
    pub fn new(owner_id: AccountId, nolan_token_id: AccountId) -> Self {
        Self {
            stakeholders: Vec::new(),
            stakes: LookupMap::new(b"stakes".to_vec()),
            reward_per_hour: REWARD_PER_HOUR,
            nolan_token_id,
            owner_id,
        }
    }
}

#[near_bindgen]
impl Stakeable {
    /**
     * @notice _addStakeholder takes care of adding a stakeholder to the stakeholders array
     */
    fn _add_stakeholder(&mut self, stake_id: AccountId) -> usize {
        let stakeholder: StakeHolder = StakeHolder {
            address: stake_id.to_owned(),
            address_stakes: Vec::new(),
        };
        self.stakeholders.push(stakeholder);
        let user_index: usize = self.stakeholders.len() - 1;
        self.stakes.insert(&stake_id, &user_index);

        return user_index;
    }

    /**
     * @notice
     * _Stake is used to make a stake for an sender. It will remove the amount staked from the stakers account and place those tokens inside a stake container
     * StakeID
     */
    fn _stake(&mut self, sender: AccountId, amount: U128) {
        assert!(amount.0 > 0, "Cannot stake nothing");
        let index: usize;
        // let sender = env::signer_account_id();
        // Mappings in solidity creates all values, but empty, so we can just check the address
        match self.stakes.get(&sender) {
            Some(_index) => {
                index = _index;
            }
            None => {
                index = self._add_stakeholder(sender.to_owned());
            }
        }

        env::log_str(&format!("index={}", index.to_string()));

        match self.stakeholders.get_mut(index) {
            Some(stakeholder) => {
                let stake = Stake {
                    address: sender,
                    amount: amount,
                    since: env::block_timestamp_ms(),
                    claimable: U128(0),
                };
                stakeholder.address_stakes.push(stake);
            }
            None => {}
        }
    }

    /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
     */
    fn _withd_raw_stake(&mut self, amount: U128, index: usize) -> U128 {
        U128(0)
    }
}

#[near_bindgen]
impl Stakeable {
    /**
     * @notice
     * readonly
     * calculateStakeReward is used to calculate how much a user should be rewarded for their stakes
     * and the duration the stake has been active
     */
    pub fn calculate_stake_reward(&self, current_stake: Stake) -> U128 {
        // First calculate how long the stake has been active
        // Use current seconds since epoch - the seconds since epoch the stake was made
        // The output will be duration in SECONDS ,
        // We will reward the user 0.1% per Hour So thats 0.1% per 3600 seconds
        // the alghoritm is  seconds = block.timestamp - stake seconds (block.timestap - _stake.since)
        // hours = Seconds / 3600 (seconds /3600) 3600 is an variable in Solidity names hours
        // we then multiply each token by the hours staked , then divide by the rewardPerHour rate
        // return (((block.timestamp - _current_stake.since) / 1 hours) * _current_stake.amount) / rewardPerHour;
        let timestamp = env::block_timestamp_ms();
        return U128(
            (((timestamp - current_stake.since) / ONE_HOUR) as u128 * current_stake.amount.0)
                / self.reward_per_hour as u128,
        );
    }
    /**
     * @notice
     * readonly
     * hasStake is used to check if a account has stakes and the total amount along with all the seperate stakes
     */
    pub fn has_stake(&self, _staker: AccountId) -> StakingSummary {
        // totalStakeAmount is used to count total staked amount of the address
        let mut total_stake_amount: U128 = U128(0);
        let stake_index = self.stakes.get(&_staker).unwrap();
        let stakeholder = self.stakeholders.get(stake_index).unwrap().clone();

        // Keep a summary in memory since we need to calculate this
        let mut summary = StakingSummary {
            total_amount: U128(0),
            stakes: stakeholder.address_stakes,
        };

        // Itterate all stakes and grab amount of stakes
        for stake in summary.stakes.iter_mut() {
            let available_reward = self.calculate_stake_reward(stake.to_owned());
            stake.claimable = available_reward;
            total_stake_amount = U128(total_stake_amount.0 + stake.amount.0);
        }

        // // Assign calculate amount to summary
        summary.total_amount = total_stake_amount;
        return summary;
    }

    // /**
    //  * Add functionality like burn to the _stake afunction
    //  *
    //  */
    // #[payable]
    // pub fn stake(&mut self, amount: U128) {
    //     // A -> sender    => A(client) call B => C
    //     // B
    //     // cross contract  C
    //     // C -> b
    //     assert!(amount.0 > 0, "amount must be greater than zero");
    //     env::log_str(&format!(
    //         "current_account_id={}",
    //         env::current_account_id().to_string()
    //     ));

    //     env::log_str(&format!(
    //         "current_account_id={}",
    //         env::current_account_id().to_string()
    //     ));

    //     let account_id = env::predecessor_account_id();

    //     let ext_ft = ext_self::ext(env::current_account_id())
    //         .with_static_gas(FT_HARVEST_CALLBACK_GAS)
    //         .with_attached_deposit(NO_DEPOSIT);
    //     ext_ft::ext(self.nolan_token_id.clone())
    //         .with_static_gas(FT_HARVEST_CALLBACK_GAS)
    //         .with_attached_deposit(NO_DEPOSIT)
    //         .ft_balance_of(account_id.to_string())
    //         .then(ext_ft.ft_transfer_callback(account_id, env::current_account_id(), amount));
    // }

    /**
     * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    pub fn withdraw_stake(amount: U128, stake_index: usize) {}
}

#[near_bindgen]
impl Stakeable {
    pub fn ft_on_transfer(
        &mut self,
        sender_id: ValidAccountId,
        amount: U128,
        msg: String,
    ) -> String {
        let processor = env::predecessor_account_id();
        let account_id = env::signer_account_id();
        assert_ne!(processor, account_id.clone(), "Oops1");
        assert!(amount.0 > 0, "Oops2");
        match msg.as_str() {
            "staking" => {
                self._stake(sender_id.clone(), amount);
                format!(
                    "Account={} stake {} is successfully",
                    sender_id.to_string(),
                    amount.0.to_string()
                )
            }
            _ => "Oops".to_string(),
        }
    }
}
