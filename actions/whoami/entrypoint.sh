#!/bin/sh

balena login --token ${API_TOKEN}

exec node /usr/src/app/build/main.js