#!/usr/bin/env bash
./node_modules/.bin/tsc

nodejs ./dist/main.js "$@"
