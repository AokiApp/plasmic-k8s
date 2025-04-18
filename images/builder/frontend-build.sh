#!/bin/sh

# please make sure to give environment variables to the container


cd /app/plasmic/platform/wab/
yarn rsbuild build

git rev-parse --short HEAD > /app/plasmic/platform/wab/GIT-REVISION
git rev-parse --abbrev-ref HEAD > /app/plasmic/platform/wab/GIT-BRANCH

cp -r /app/plasmic/platform/wab/build /app/build