# Audio & Playlist Configuration for Nisar × Lahari

This website features a multi-track romantic music player with Next/Previous track controls and animated sound bars.

## How to add multiple personal songs:
1. Copy your MP3 song files into this folder:
   - `assets/audio/song1.mp3`
   - `assets/audio/song2.mp3`
   - `assets/audio/song3.mp3`
   (or any custom names!)

2. In `js/config.js`, you can customize track titles, artist names, and file paths:
   ```javascript
   audio: {
     tracks: [
       {
         id: 1,
         title: "A Melody For Lahari",
         artist: "Nisar",
         src: "assets/audio/song1.mp3",
         preset: "starlight"
       },
       {
         id: 2,
         title: "Our Quiet Moments",
         artist: "Nisar",
         src: "assets/audio/song2.mp3",
         preset: "warmth"
       },
       {
         id: 3,
         title: "Forever Favorite",
         artist: "Nisar",
         src: "assets/audio/song3.mp3",
         preset: "heartstrings"
       }
     ]
   }
   ```

3. **Built-in Romantic Synth Moods**:
   Even before you add any MP3 files, the website features 3 distinct romantic acoustic harmonic presets powered by the browser's Web Audio API:
   - **Track 1 (Starlight)**: Dreamy Db Major 9th celestial chimes
   - **Track 2 (Warmth)**: Gentle F Major acoustic tones
   - **Track 3 (Heartstrings)**: Intimate Ab Major resonance

4. Lahari can switch between tracks seamlessly using the **Next (⏭)** and **Previous (⏮)** buttons on the floating player!
