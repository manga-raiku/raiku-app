#!/bin/bash
#
# blend S
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Copied .env.example => .env"
else
  echo "File .env exists"
fi

sudo apt update -y
sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y
pnpm i
pnpm build:npm
npx cypress install
