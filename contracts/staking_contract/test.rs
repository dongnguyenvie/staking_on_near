fn main() {
    const ONE_HOUR: u128 = 3600_000;
    let timestamp = 1657006788911;
    let duration = (timestamp - 1656996479907 as u128) as u128;
    // env::log_str(format!("timestamp={}", timestamp.to_string(),).as_str());
    let c = ((duration * 3000 * u128::pow(10, 15) as u128 * 15 as u128) / ONE_HOUR as u128)
        / 1000 as u128;
    println!("{:?}", c.to_string());
}
