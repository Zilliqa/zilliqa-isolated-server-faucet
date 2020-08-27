#!/bin/bash

echo "Environment is $DEPLOY_ENV"
if [ "$DEPLOY_ENV" = "dev" ]; then
    [ -e ./.env_dev ] && . ./.env_dev
    node ./dist/server.js
else
    echo "Not dev env"
    echo "$MODE"
    cat ./state/faucet-state.json

    if [ "$MODE" == "load" ]; then
        echo "loading state"
        node ./dist/server.js
    else
        echo "deleting state"
        rm ./state/*
        node ./dist/server.js
    fi
fi
