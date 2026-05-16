# 🎵 SoundWave — Free Music Streaming App

A fully-featured, privacy-first music player built with React + Vite. Plays local files, streams full tracks from Audius, supports optional CC-licensed Jamendo search, and works offline as a PWA. No ads, no tracking, no subscription.

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- **Node.js** 18+ → [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Setup

```bash
# 1. Clone or copy the project
cd soundwave-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** — your app is running! 🎉

---

## 🎧 Features

| Feature | Description |
|---------|-------------|
| **Local Music** | Import MP3, FLAC, WAV, M4A, OGG, AAC files |
| **Free Streaming** | Full tracks from Audius, plus optional CC-licensed tracks via Jamendo API |
| **Auto Metadata** | Extracts title, artist, album, cover art automatically |
| **Playlists** | Create, edit, delete custom playlists |
| **Liked Songs** | Heart any track to save it |
| **Search** | Find tracks by title, artist, genre |
| **Queue** | View and manage upcoming tracks |
| **Shuffle & Repeat** | All playback modes (off, all, one) |
| **Lock Screen** | MediaSession API for system controls |
| **PWA** | Install on phone/desktop, works offline |
| **Privacy** | Zero tracking, all data stays on your device |
| **Responsive** | Desktop sidebar + mobile drawer |

---

## 🎵 Adding Free Music (Jamendo)

SoundWave searches Audius without an API key. It can also integrate with **Jamendo**, a platform with millions of free, Creative Commons licensed tracks.

### Get your free API key:

1. Go to **https://devportal.jamendo.com/**
2. Create a free account
3. Create a new app → get your **Client ID**
4. Create a `.env` file in the project root:

```env
VITE_JAMENDO_CLIENT_ID=your_client_id_here
```

5. Restart the dev server → search now returns online results!

---

## 📱 Deploy as a Mobile App (PWA)

SoundWave is a Progressive Web App — it can be installed on any phone or tablet:

### Step 1: Build for production
```bash
npm run build
```

### Step 2: Deploy to any static host

**Option A — Vercel (easiest, free)**
```bash
npm i -g vercel
vercel --prod
```

**Option B — Netlify (free)**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option C — GitHub Pages (free)**
```bash
# In vite.config.js, add: base: '/your-repo-name/'
npm run build
# Push dist/ folder to gh-pages branch
```

**Option D — Self-hosted (any server)**
```bash
npm run build
# Upload the dist/ folder to your server
# Serve with nginx, Apache, or any static file server
```

### Step 3: Install on your phone
1. Open the deployed URL in Chrome/Safari
2. Tap **"Add to Home Screen"** (or the install prompt)
3. The app now works like a native app — with offline support!

---

## 🖥️ Deploy as a Desktop App (Electron)

### Development
```bash
npm run electron
```

### Build distributable
```bash
npm run electron:build
```

This creates:
- **macOS**: `.dmg` in `dist-electron/`
- **Windows**: `.exe` installer in `dist-electron/`
- **Linux**: `.AppImage` in `dist-electron/`

---

## 📁 Project Structure

```
soundwave-app/
├── public/
│   └── favicon.svg          # App icon
├── src/
│   ├── main.jsx             # Entry point
│   ├── App.jsx              # Root layout + routing
│   ├── store.js             # Zustand state (player + library)
│   ├── styles.css            # Global styles + CSS variables
│   ├── hooks/
│   │   └── useAudioEngine.js # HTML5 Audio + MediaSession
│   ├── utils/
│   │   ├── localFiles.js     # File import + IndexedDB
│   │   └── freeMusic.js      # Jamendo API + demo synthesis
│   ├── components/
│   │   ├── Icon.jsx          # SVG icon library
│   │   ├── AlbumArt.jsx      # Cover art / generative art
│   │   ├── PlayerBar.jsx     # Bottom player controls
│   │   ├── QueuePanel.jsx     # Current playback queue
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   └── TrackList.jsx     # Reusable track list
│   └── pages/
│       ├── Home.jsx          # Home / dashboard
│       ├── Search.jsx        # Search + genre browse
│       ├── Library.jsx       # Library + playlists
│       ├── Liked.jsx         # Liked songs
│       ├── Import.jsx        # File import (drag & drop)
│       ├── Playlist.jsx      # Playlist detail view
│       └── Settings.jsx      # Settings + API config
├── electron/
│   └── main.js              # Electron main process
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool + dev server |
| **Zustand** | Lightweight state management |
| **React Router v6** | Client-side routing |
| **Web Audio API** | Audio playback + analysis |
| **MediaSession API** | Lock screen / system controls |
| **IndexedDB** | Persistent local storage |
| **music-metadata** | Audio metadata extraction |
| **vite-plugin-pwa** | PWA + service worker |
| **Electron** | Desktop app wrapper |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Next track |
| `←` | Previous track |
| `↑` / `↓` | Volume up / down |
| `M` | Mute / Unmute |
| `S` | Toggle shuffle |
| `R` | Cycle repeat (off → all → one) |

---

## 🚀 Performance Tips

- **Large libraries**: IndexedDB handles thousands of tracks efficiently
- **Cover art**: Extracted once and cached in memory
- **PWA caching**: Static assets cached by service worker
- **Lazy loading**: Pages load on demand via React Router

---

## 📄 License

MIT — free for personal and commercial use.

Music streamed via Jamendo is licensed under Creative Commons.
Always check individual track licenses for usage rights.
