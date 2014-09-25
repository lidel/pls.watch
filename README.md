yt-looper
=========

Minimalistic Youtube Looper at http://yt.aergia.eu

Control via URL parameters: `?v=VIDEO_ID[&t=start[;end]]`
where `start` is something like `1h2m3s`

or

if you'd like to concatenate several time intervals try: `?v=VIDEO_ID[&t=start[;end]|start[;end]|...]`

### TODO

- support parameters after `#` instead of `?` (reload player after URL hash change instead of entire page)
- hide Youtube player and display remaining time, loop duration and link to original video in more unobtrusive  way
