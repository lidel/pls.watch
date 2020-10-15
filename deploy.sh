#!/bin/bash
set -e

GIT_HEAD=`git rev-parse --short --verify HEAD`

sed -i  \
    -e "s/%git-hash%/$GIT_HEAD/" \
    -e "s/css\"/css?${GIT_HEAD}\"/" \
    -e "s/'pls.watch.js'/'pls.watch.js?${GIT_HEAD}'/" \
    -e "s/'pls.watch.editor.js'/'pls.watch.editor.js?${GIT_HEAD}'/" \
    index.html

