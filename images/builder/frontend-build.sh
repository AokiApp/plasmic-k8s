#!/bin/sh

# please make sure to give environment variables to the container


cd /app/plasmic/platform/wab/
yarn rsbuild build

cp -r /app/plasmic/platform/wab/build /app/build
