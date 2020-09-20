#!/bin/bash

echo "Environment is $DEPLOY_ENV"
if [ "$DEPLOY_ENV" = "dev" ]; then
    [ -e ./.env_dev ] && . ./.env_dev
    node ./dist/server.js
else
    echo "Not dev env"
    [ -e ./.env ] && . ./.env
    node ./dist/server.js
fi
