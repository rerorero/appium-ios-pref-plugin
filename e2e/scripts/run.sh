#!/bin/bash

set -eu

echo "building plugin..."
yarn build

echo "starting appium server..."
yarn appium server -- --port=4567 --log-level=debug --use-plugins=appium-ios-pref-plugin &
appium_pid=$!

function cleanup {
  echo "killing appium server"
  kill $appium_pid
  exit
}

trap cleanup EXIT

echo "waiting for Appium server to be up"
sleep 5

yarn run e2e

sleep 3

