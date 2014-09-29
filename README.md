yt-looper
=========

[![Build Status](https://travis-ci.org/lidel/yt-looper.svg)](https://travis-ci.org/lidel/yt-looper)

Minimalistic Youtube Looper at http://yt.aergia.eu

Control via URL parameters: `#v=VIDEO_ID[&t=start[;end]]` where `start` is something like `1h2m3s` or just a number of seconds.

or

if you'd like to concatenate several time intervals try: `#v=VIDEO_ID&t=start1;end1+start2;end2+...`

To chain intervals from multiple videos just append them at the end: `#v=VIDEO_ID&t=start1;end1+start2;end2&#v=VIDEO2_ID&t=start1;end1+start2;end2`

