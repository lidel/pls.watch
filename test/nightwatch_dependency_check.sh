#!/bin/bash
set -e

TESTS=$(dirname $(readlink -f -- $0))

# create directory for selenium etc
test -d $TESTS/lib/ || mkdir -p $TESTS/lib/
test -d $TESTS/logs/ || mkdir -p $TESTS/logs/

echo -n "download selenium server if not present.."
test -e $TESTS/lib/selenium-server-standalone.jar || (echo && \
    curl -L# "https://selenium-release.storage.googleapis.com/2.45/selenium-server-standalone-2.45.0.jar" \
         -o ${TESTS}/lib/selenium-server-standalone.jar) \
         && echo OK

echo -n "download chromedriver if not present.."
test -e $TESTS/lib/chromedriver || (echo && \
    curl -L# "https://chromedriver.storage.googleapis.com/2.15/chromedriver_linux64.zip" \
         -o ${TESTS}/lib/chromedriver_linux64.zip \
         && unzip -d ${TESTS}/lib/ ${TESTS}/lib/chromedriver_linux64.zip \
         && rm ${TESTS}/lib/chromedriver_linux64.zip) \
         && echo OK

