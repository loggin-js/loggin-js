#!/usr/bin/env bash
 
 
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.jsx\?$')
BIN_PATH="$(git rev-parse --show-toplevel)/node_modules/.bin"
 
eslint() {
  ESLINT="$BIN_PATH/eslint"
 
  # Check for eslint
  if [[ ! -x "$ESLINT" ]]; then
    printf "\t\033[41mPlease install ESLint\033[0m\n"
    exit 1
  fi
 
  echo "Linting modified files"
 
  echo $STAGED_FILES | xargs $ESLINT
 
  if [[ $? == 0 ]]; then
    printf "\n\033[1;32m ✔ Lint Passed\033[0m\n\n"
  else
    printf "\n\033[41mLint X Failed:\033[0m Fix lint errors and try again!\n"
    exit 1
  fi
}
 
jest() {
  JEST="$BIN_PATH/jest"
 
  # Check for jest
  if [[ ! -x "$JEST" ]]; then
    printf "\t\033[41mPlease install Jest\033[0m\n"
    exit 1
  fi
 
  echo "Testing related to modified files"
 
  $JEST --bail --findRelatedTests $STAGED_FILES
 
  if [[ $? == 0 ]]; then
    printf "\n\033[1;32m ✔ Test Passed\n\n"
  else
    printf "\n\033[41m X Test Failed:\033[0m Fix test errors and try again!\n"
    exit 1
  fi
}
 
# Exit if no files modified
if [[ "$STAGED_FILES" = "" ]]; then
  echo "--- No files stashed ---"
  printf "\n\033[1;32m ✔ Linting\033[0m - skipped"
  printf "\n\033[1;32m ✔ Tests\033[0m - skipped\n\n"
  exit 0
fi

eslint
jest
 
exit $?