#!/usr/bin/env bash

# if any command inside script returns error, exit and return that error 
set -e

# magic line to ensure that we're always inside the root of our application,
# no matter from which directory we'll run script
# thanks to it we can just enter `./scripts/run-tests.bash`
cd "${0%/*}/.."

# let's fake failing test for now 
echo "Running tests"
# echo "............................" 
$testres = $(npm test)

echo " > Test ended: " + $testres

echo "Linting"
$lintres = $(npm run lint)
echo " > Lint ended: " + $lintres

# echo "Failed!" && exit 1

# example of commands for different languages
# eslint .         # JS code quality check
# npm test         # JS unit tests
# flake8 .         # python code quality check
# nosetests        # python nose 
# just put your usual test command here 