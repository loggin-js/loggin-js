#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

printf "\n Installing hooks..."
# this command creates symlink to our pre-commit script
if [ -f $GIT_DIR/hooks/pre-commit ]; then
    printf "\n pre-commit already exists, removing it..."
    rm $GIT_DIR/hooks/pre-commit
fi

ln -s ../../scripts/pre-commit.bash $GIT_DIR/hooks/pre-commit
printf "\n\033[1;32m Installed hooks OK!\n"