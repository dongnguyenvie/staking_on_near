#!/bin/bash
# set -e
# cd ..
cd "`dirname $0`"
cd ..
cargo build --all --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/*.wasm ./res/