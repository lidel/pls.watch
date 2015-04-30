yt-looper
=========

[![Build Status](https://travis-ci.org/lidel/yt-looper.svg)](https://travis-ci.org/lidel/yt-looper)

Minimalistic Youtube Looper at https://yt.aergia.eu


## URL Parameters

The most basic loop is one video with optional range:
```
#v=<videoId>[&t=<start>[;<end>]]
```
Time format is `1h2m3s` or just a number of seconds.

### YouTube

YouTube-compatible syntax is also supported, enabling use by a simple domain swap in URLs: `?v=<videoId>[[#|&|:]t=<start>[;<end>]]`


**Advanced Loops**

A YouTube video can have more than one interval. Intervals are chained with the `+` sign:
```
#v=<videoId>&t=<start1>;<end1>+<start2>;<end2>+...
```

To chain intervals from multiple videos just append another `#v=(...)` at the end of URL:
```
#v=<videoId1>&t=<start1>;<end1>+<start2>;<end2>&v=<videoId2>&t=<start3>;<end3>+<start4>;<end4>`
```


**YouTube Playlist Import**

To generate `v=(...)` items from `<playlistId>` and start autoplay from `<n>`-th element:
```
#list=<playlistId>&index=<n>
```

YouTube URLs are supported transparently: if `<videoId>` is inside of the playlist specified by `<playlistId>` on `<n>`-th position, it will be deduplicated:
```
#v=<videoId>&list=<playlistId>&index=<n>
```
If URL already had some videos `<n>` will be recalculated.


**Video Quality**

To cap video quality at preferred level (global setting):
```
&quality=<level>
```
Current list of available levels can be found in [YouTube Player API Reference](https://developers.google.com/youtube/iframe_api_reference#Playback_quality).


**Random Mode**

```
&random
```
This will play multiple intervals in semi-random order (current interval will not be played twice in a row).

### Imgur

By default image is displayed forever (useful for GIFs). A slideshow can be created with simplified `t` parameter:

```
#i=<imageId>.jpg[&t=<displayTime>]
```

Example: https://yt.aergia.eu/#i=cJjBEQP.jpg&t=3s&i=vo9DPpp.gif&t=3s

### SoundCloud

For now, only single track intervals are supported:

```
#s=<user>/<sound>[&t=<start>[;<end>]]
```

Example: https://yt.aergia.eu/#s=sacredbones/pharmakon-body-betrays-itself&t=0s;17s


## Keyboard Commands

Press <kbd>?</kbd> to toggle help screen with available shortcuts.

## Companion userscript

There is a simple userscript that adds a button on YouTube pages to open current video in yt-looper:

> ![](https://cloud.githubusercontent.com/assets/157609/4671390/5d989338-5580-11e4-9f67-01ed61a085ca.png)

Click to install: https://yt.aergia.eu/yt-looper.user.js

It may require preinstalled browser extension:

- Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
- Chrome/Opera: [Tampermonkey](http://tampermonkey.net)
