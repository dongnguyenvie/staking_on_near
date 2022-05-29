#!/bin/bash

cd "`dirname $0`"
cd ..

CONTRACT_FILE=./res/nolan_token.wasm

near dev-deploy --wasmFile $CONTRACT_FILE