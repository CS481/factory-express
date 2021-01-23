#!/bin/bash
export DB_USR=testuser
export DB_PWD=952bfbp7qQue7QT
export DB_NAME=test
export DB_HOST=cluster0.hgu8w.mongodb.net
./node_modules/.bin/babel src --out-dir lib
node node_modules/jest/bin/jest.js lib