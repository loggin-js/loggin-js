#!/usr/bin/env bash

echo "Running pre-commit hook"
./scripts/run-tests.bash
RED='\033[0;31m'

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 echo "${RED}Tests an linting must pass before commit!"
 exit 1
fi