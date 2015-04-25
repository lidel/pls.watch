#!/bin/bash
for filepath in $(find ./test/ -name '*.png'); do
    echo $filepath
    # Don't worry, this Client-ID is noth worth keeping secret ;-)
    curl https://api.imgur.com/3/upload -X POST -H "Authorization: Client-ID 365e0220e17d5c1" -F "image=@${filepath}"
    echo
done
