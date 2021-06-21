#!/bin/bash -ilex
echo "npm start--------------->"
npm -v

npm install
npm run build

echo "删除旧版本"
rm -rf /home/liuge/docker/nginx/wwwroot/mp/*
echo "复习新版本到mp目录"
cp -r dist/. /home/liuge/docker/nginx/wwwroot/mp
