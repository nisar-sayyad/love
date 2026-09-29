# Nisar × Lahari — "A Little World Made For You"

A bespoke, luxury cinematic digital love story and personal appreciation experience created exclusively by **Nisar** for **Lahari**.

---

## ✨ Features & Experiences
- **Cinematic Opening Screen ("The Threshold")**: Atmospheric entrance with celestial shimmers, couple identity, and the "OPEN MY HEART" dissolve transition.
- **Hero Sanctuary**: High-resolution portrait of Lahari framed by warm champagne gold borders, romantic typography, and personalized signature.
- **First of All... You**: Sincere, mature, and deeply emotional tribute to Lahari's gentle presence.
- **8 Cinematic Photo Story Chapters**: Asymmetrical, editorial chapters with unique quotes, compliments, and portrait framing:
  - *Chapter I: That Smile*
  - *Chapter II: Those Eyes*
  - *Chapter III: Just You*
  - *Chapter IV: The Little Things*
  - *Chapter V: Your Presence*
  - *Chapter VI: Beautiful Without Trying*
  - *Chapter VII: My Favorite Person*
  - *Chapter VIII: The Moments I Keep*
- **If You Could See Yourself Through My Eyes**: Dedicated perspective showcase highlighting her authentic worth and grace.
- **Things I Love About You**: 12 interactive 3D cards (4 columns × 3 rows) that flip on click/tap to reveal tender romantic reflections.
- **It's The Little Things**: Observation stream highlighting subtle daily details.
- **Our Little World**: Intimate monogram insignia (*N × L / Nisar × Lahari*).
- **You Probably Don't Know This...**: Quiet, heartfelt confessions.
- **Moments Worth Keeping**: Vertical memory milestone timeline (*Chapters We Keep*).
- **Moments That Move**: Cinematic video theater with custom player cards, muted loop preview, and sound controls.
- **Editorial Photo Gallery & Lightbox**: Tap-to-expand photo wall with touch-swipe support for mobile, arrow keys, and zoom.
- **A Letter From Nisar**: Elegant digital parchment love letter with wax seal monogram.
- **"One More Thing..." Interaction**: Cinematic modal reveal (*"If I had to choose my favorite person all over again... I'd still choose you."*).
- **Secret Easter Egg**: Discreet micro-heart in the corner revealing an intimate surprise message (*"Psst... Just in case you forgot... Nisar loves you."*).
- **Discreet Music Player**: Floating audio pill with sound wave bars and Web Audio API romantic melodic arpeggio fallback, ready for any personal MP3 file.
- **Before You Leave & Final Screen**: Tender closing tribute and timeless dedication.

---

## 📂 Project Architecture & File Structure

```
c:\Users\nisar\Documents\Lahari\
├── index.html                  # Accessible, semantic HTML5 markup & OpenGraph tags
├── serve.ps1                   # Local PowerShell HTTP preview server
├── README.md                   # This documentation guide
├── css/
│   ├── variables.css           # Color tokens (wine, burgundy, blush, cream, gold), typography, shadows
│   ├── main.css                # Base reset, typography scale, scrollbars, responsive utilities
│   └── components.css          # Cards, hero, chapters, parchment, modals, lightbox
├── js/
│   ├── config.js               # Centralized configuration for all text, quotes, and media
│   ├── particles.js            # Ambient celestial shimmer canvas
│   ├── audio.js                # Music controller with Web Audio romantic arpeggio fallback
│   ├── lightbox.js             # Accessible, touch-swipe fullscreen media viewer
│   └── app.js                  # Main controller, interactive cards, video logic, scroll reveals
└── assets/
    ├── images/                 # 31 curated photographs of Lahari with clean relative paths
    ├── videos/                 # 6 video clips of Lahari with clean relative paths
    ├── audio/                  # Audio folder (place optional song.mp3 here)
    └── icons/                  # Crisp SVG icons
```

---

## 🚀 How to Preview Locally

### Option 1: Double Click
Simply double-click `index.html` in your file explorer to open it in any modern browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local HTTP Server
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Then visit: `http://localhost:8080/` in your browser.

---

## 🎨 How to Customize Content
All text, quotes, memories, compliments, and titles are located in:
👉 `js/config.js`

You can change any sentence, date, or quote directly in `js/config.js` without touching HTML or CSS!

---

## 🎵 Adding a Personal Song
1. Copy your MP3 song into `assets/audio/` and name it `song.mp3`.
2. The website will automatically use it as the background melody!
3. If no file is added, the website natively generates a gentle, romantic acoustic chime arpeggio via the Web Audio API.

---

## 🌐 Publishing Online (GitHub / Vercel / Netlify)
This project is **100% self-contained** and uses strictly relative paths (`assets/...`, `css/...`, `js/...`).
- To keep your photos private, initialize a **Private GitHub Repository**:
  ```bash
  git init
  git add .
  git commit -m "Nisar × Lahari — Digital Love Story"
  git remote add origin <your-private-repo-url>
  git push -u origin main
  ```
- Deploy to **Vercel** or **Netlify** by connecting your private GitHub repository. It requires zero build commands (output directory: root `/`).
