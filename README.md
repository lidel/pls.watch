# yt-looper: The Minimalistic Media Looper

[![Greenkeeper badge](https://badges.greenkeeper.io/lidel/yt-looper.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/lidel/ipfs-firefox-addon.svg?branch=master)](https://travis-ci.org/lidel/yt-looper)

> Create shareable loops and playlists using simple URL tokens.

A snowball of JavaScript antipatterns that turned into an avalanche of features.    
Supports YouTube for video (with playlist import), Imgur for images (with gifv support) and SoundCloud for audio.

Deployed at https://yt.aergia.eu

## Table of Contents

- [Background](#background)
- [URL Parameters](#url-parameters)
  - [YouTube](#youtube)
  - [Imgur](#imgur)
  - [SoundCloud](#soundcloud)
  - or [any External URL](#any-external-url)
- [Known Issues](#known-issues)
- [Companion UserScript](#companion-userscript)
- [Contribute](#contribute)
- [License](#license)

## Background

Scratching own itches.

At the time YouTube did not provide any way to specify end timestamp when sharing a link to a video.    
The amount of distractions and advertisements on third party sites that provided this functionality was abysmal.

Out of frustration, `yt-looper` was born as a clean way to:

- share specific fragment of YouTube video
- display content without any distractions such as related videos or ads
- create playlists with mixed content from YouTube, Imgur (image/gifv) and SoundCloud (audio)
- guarantee backward-compatible API to create clean permalinks (see [URL Parameters](#url-parameters))
 
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

To chain intervals from multiple videos just append another `&v=(...)` at the end of URL:
```
#v=<videoId1>&t=<start1>;<end1>+<start2>;<end2>&v=<videoId2>&t=<start3>;<end3>+<start4>;<end4>`
```


**Playlist Import**

To generate `v=(...)` items from `<playlistId>` and start autoplay from `<n>`-th element:
```
#list=<playlistId>&index=<n>
```

YouTube URLs are supported transparently: if `<videoId>` is inside of the playlist specified by `<playlistId>` on `<n>`-th position, it will be deduplicated:
```
#v=<videoId>&list=<playlistId>&index=<n>
```
If URL already had some videos `<n>` will be recalculated.

**Override Video Volume**

To cap YouTube sound volume at a preferred level (global setting):
```
&volume=<level>
```
Level is a number between 0 (muted) and 100 (max volume).


**Override Video Quality**

To cap YouTube quality at a preferred level (global setting):
```
&quality=<level>
```
Current list of available levels can be found in [YouTube Player API Reference](https://developers.google.com/youtube/iframe_api_reference#Playback_quality).


**Override Playback Rate**

The default playback rate is `1`, which indicates that the video is playing at normal speed. Playback rates may include values like `0.25`, `0.5`, `1`, `1.5`, and `2`. It is a global flag (sets speed of all YouTube videos in playlist).
```
&speed=<rate>
```
Current list of available playback rates can be found in [YouTube Player API Reference](https://developers.google.com/youtube/iframe_api_reference#Playback_rate).



### Imgur

By default image is displayed forever (useful for GIFs). A slideshow can be created with simplified `t` parameter:

```
#i=<imageId>.jpg[&t=<displayTime>]
```

Example: https://yt.aergia.eu/#i=lkD38.gifv&t=3&i=cJjBEQP.jpg&t=1s&i=vo9DPpp.gif&t=3s

Note: [GIF intervals](https://yt.aergia.eu/#i=zvATqgs) are automatically rendered as [GIFV](https://imgur.com/blog/2014/10/09/introducing-gifv/).

### SoundCloud

Single track interval:

```
#s=<user>/<sound>[&t=<start>[;<end>]]
```

Example: https://yt.aergia.eu/#s=sacredbones/pharmakon-body-betrays-itself&t=0s;17s

Playlists (sets) are lazy-inlined on first play:

```
#s=<user>/sets/<set>
```

Example: https://yt.aergia.eu/#s=erasedtapes/sets/erased-tapes-collection-iv

### Any External URL

#### Generic HTML5 Player

Similar to YouTube Player - main difference is format for `videoId`.

Currently, to be detected, `videoId` has to begin with `http` and end with: `.mp3`, `.mp4`, `.ogg`, `.ogv` or `.webm`. 

Example: https://yt.aergia.eu/#v=https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4&t=4s;5s

#### Generic Image Player

Similar to Imgur Player but if `videoId` starts with `http` it loads the URL and naïvely believes it is an image.

Example: https://yt.aergia.eu/#i=https://ipfs.io/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm

### Global

**Random Mode**

```
&random
```

This parameter will force playback of all intervals in semi-random order (normalized random: current interval will not be played twice in a row).

**Playlist Editor**

```
&editor
```

This parameter will force playlist editor to be visible from the start.

## Keyboard Commands

Press <kbd>?</kbd> to toggle help screen listing available shortcuts.

## Known Issues

### Playback pauses when tab is not active (Google Chrome/Chromium)

See [issue #151](https://github.com/lidel/yt-looper/issues/151#issuecomment-190417962).


## Companion UserScript

There is a simple [UserScript](https://openuserjs.org/about/Userscript-Beginners-HOWTO) that adds a button on supported pages to open current resource in the app.

### Installation

Click to install: https://yt.aergia.eu/yt-looper.user.js

It may require preinstalled browser extension:

- Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
- Chrome/Opera: [Tampermonkey](http://tampermonkey.net)

### Examples

#### YouTube

> ![](https://cloud.githubusercontent.com/assets/157609/4671390/5d989338-5580-11e4-9f67-01ed61a085ca.png)

#### Imgur

> ![](https://cloud.githubusercontent.com/assets/157609/17445828/cfc2705a-5b46-11e6-8e2a-c12940b998b7.png)

#### SoundCloud

> ![](https://cloud.githubusercontent.com/assets/157609/7513707/80d419c8-f4b6-11e4-9413-3d6ede9bd5d0.png)

## Contribute

Ideas and bug reports are most welcome.

## License

- [Underscore.js](http://underscorejs.org/), [jQuery](https://jquery.com/), [mCustomScrollbar](https://github.com/malihu/malihu-custom-scrollbar-plugin) and [toastr](https://github.com/CodeSeven/toastr) are under [MIT license](http://opensource.org/licenses/MIT)
- [Black Felt](http://subtlepatterns.com/black-felt/) is under [CC-BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)

The yt-looper itself is released under [CC0 Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).


