#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

echo "Installing hooks..."
# this command creates symlink to our pre-commit script
if [ -f $GIT_DIR/hooks/pre-commit ]; then
    echo "pre-commit already exists, removing it..."
    rm $GIT_DIR/hooks/pre-commit
fi

ln -s ../../scripts/pre-commit.bash $GIT_DIR/hooks/pre-commit
printf "Installed hooks \033[1;32mOK!"