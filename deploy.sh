#!/bin/bash
set -e

GIT_HEAD=`git rev-parse --short --verify HEAD`

mkdir -p dist
cp -r favicon.ico pls.*.js index.html style.css assets/ dist/

sed -i  \
    -e "s/%git-hash%/$GIT_HEAD/" \
    -e "s/css\"/css?${GIT_HEAD}.css\"/" \
    -e "s/'pls.watch.js'/'pls.watch.js?${GIT_HEAD}.js'/" \
    -e "s/'pls.watch.editor.js'/'pls.watch.editor.js?${GIT_HEAD}.js'/" \
    dist/index.html

