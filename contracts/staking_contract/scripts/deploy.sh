#!/bin/bash

cd "`dirname $0`"
cd ..

CONTRACT_FILE=./res/staking_contract.wasm

near dev-deploy --wasmFile $CONTRACT_FILE
