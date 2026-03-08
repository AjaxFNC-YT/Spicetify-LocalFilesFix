# LocalFilesFix
- ⭐ Star this project if it helped you!

A Spicetify extension that automatically fixes the Spotify bug where local files get stuck at 0:00 and refuse to play.

## The Problem

Spotify's desktop app has a [known bug](https://community.spotify.com/t5/Ongoing-Issues/Desktop-Playback-issues-with-local-files/idi-p/7023115) with local files where playback freezes at 0:00 on every song change. You hear nothing, Discord RPC resets, and the only fix is manually seeking back and forth. This extension does that for you — automatically and silently.

## Features

- 🔧 **Automatic Fix** — Detects local files and applies a seek fix on every song change
- 🔇 **Silent Fix** — Mutes during the fix so you never hear a skip or pop
- 🔁 **Stall Detection** — Monitors playback and re-applies the fix if the track gets stuck again
- ⚡ **Lightweight** — Single file, no dependencies, no UI, just works

## Installation

### Via Spicetify Marketplace (Recommended)
1. Open Spicetify Marketplace
2. Search for "LocalFilesFix"
3. Click Install

### Manual Installation
1. Download `LocalFilesFix.js`
2. Copy to your Spicetify extensions folder:
   - **Windows:** `%appdata%\spicetify\Extensions\`
   - **Linux/macOS:** `~/.config/spicetify/Extensions/`
3. Run `spicetify config extensions LocalFilesFix.js`
4. Run `spicetify apply`

## How It Works

When a `spotify:local:` track starts playing, the extension:
1. Mutes the volume
2. Seeks forward ~10 seconds to kick-start the audio pipeline
3. Seeks back to ~1 second
4. Restores your original volume

If playback still stalls, a background monitor will retry the fix automatically (up to 3 times).

## Uninstall

```
spicetify config extensions LocalFilesFix.js-
spicetify apply
```

## Debugging

Open Spotify DevTools (`Ctrl+Shift+I`) and filter the console by `[LocalFilesFix]` to see logs.

---

### Made with 💜 for everyone tired of broken local file playback.
