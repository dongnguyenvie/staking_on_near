use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::{ext_contract, near_bindgen, AccountId};

pub const REWARD_PER_HOUR: usize = 1_000;

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

/**
 * @notice
 * A stake struct is used to represent the way we store stakes,
 * A Stake will contain the users address, the amount staked and a timestamp,
 * Since which is when the stake was made
 */
pub struct Stake {
    address: AccountId,
    amount: U128,
    since: U128,
    claimable: U128,
}

/**
 * @notice Stakeholder is a staker that has active stakes
 */
pub struct StakeHolder {
    address: AccountId,
    address_stakes: Vec<Stake>,
}

/**
 * @notice
 * StakingSummary is a struct that is used to contain all stakes performed by a certain account
 */
pub struct StakingSummary {
    total_amount: U128,
    stakes: Vec<Stake>,
}

#[near_bindgen]
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
    rewardPerHour: usize,
}

impl Default for Stakeable {
    fn default() -> Self {
        Self {
            stakeholders: Vec::new(),
            stakes: LookupMap::new(b"stakes".to_vec()),
            rewardPerHour: REWARD_PER_HOUR,
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
    fn _stake(&mut self, _amount: U128) {}

    /**
     * @notice
     * readonly
     * calculateStakeReward is used to calculate how much a user should be rewarded for their stakes
     * and the duration the stake has been active
     */
    pub fn calculate_stake_reward(&mut self, _current_stake: AccountId) -> U128 {
        U128(0)
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

    /**
     * @notice
     * readonly
     * hasStake is used to check if a account has stakes and the total amount along with all the seperate stakes
     */
    pub fn has_stake(_staker: AccountId) -> StakingSummary {
        StakingSummary {}
    }
}
