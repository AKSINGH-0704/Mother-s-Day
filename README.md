<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&size=42&pause=1000&color=C08497&center=true&vCenter=true&width=700&lines=Mother's+Day+Surprise;A+cinematic+memory+experience." alt="Typing SVG" />

<br/>

![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-C08497?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/No%20Framework-Zero%20Dependencies-C08497?style=for-the-badge)

<br/>

> **A Mother's Day surprise you actually put thought into.**
> Hide memories inside blooms, add photos, write her a final note, and send one link.
> She taps each bloom, reads your words, and gets hit with something she didn't see coming.
> Built to feel handmade, not like an app.

<br/>

---

</div>

## What This Is

Most Mother's Day gifts feel like an afterthought. This is the opposite.

You build a private, shareable experience in minutes. She opens a link on her phone, taps through hand-placed memory blooms, reads your words one by one, and arrives at a final personal message with ambient piano playing underneath. No app install. No account. Just a link that feels like it took days to make.

It's an emotional web experience built entirely with vanilla JavaScript, a Vercel serverless backend, and a design philosophy that chose restraint over spectacle.

<br/>

---

## Live Experience Flow

```
Creator Side                          Recipient Side
─────────────────────────────         ──────────────────────────────────────
  Pick relationship (Mom, Mama...)      Opens link on any device
  Add name                              Cinematic loading screen
  Hide memories inside blooms           Welcome screen with her name
  Add optional memory photos            Taps each bloom to reveal memories
  Write a final heartfelt note          Typewriter effect reveals each message
  Generate a shareable link             Final bloom unlocks last
  Share via WhatsApp / iMessage         Ambient audio fades in
                                        Personal message appears
                                        Piano transitions to voice note
```

<br/>

---

## Technical Architecture

```
project/
├── index.html          # Single page app, all screens in one file
├── style.css           # Full design system, glassmorphism, motion tokens
├── app.js              # Complete client logic, audio engine, state machine
├── api/
│   ├── save.js         # Vercel serverless — validates + stores to KV
│   ├── load.js         # Vercel serverless — retrieves + serves surprise
│   └── upload.js       # Vercel serverless — uploads images to Vercel Blob
└── vercel.json         # Routing + API configuration
```

**No build step. No bundler. No framework. Just files.**

<br/>

---

## Engineering Highlights

### Three-Phase Cinematic Audio System
Built entirely with the **Web Audio API**, no external audio libraries.

| Phase | Trigger | Behaviour |
|-------|---------|-----------|
| Phase 1 | User begins experience | Soft ambient sine wave piano with LFO breathing and convolution reverb. Volume: 0.07. Instrumental only. |
| Phase 2 | Each bloom is opened | Ambient volume evolves proportionally. Soft chime sound effect plays (880Hz sine, exponential decay). |
| Phase 3 | Final reveal | Ambient fades out over 4 seconds. Personal audio MP3 fades in smoothly. |

Mobile-safe: `visibilitychange` listener suspends audio context on tab switch or phone call.

### Storage Architecture
Images are uploaded to **Vercel Blob** before the link is generated. Only the URL string is stored in **Vercel KV**, keeping the KV payload under 5KB regardless of how many photos are attached.

```
Old approach: base64 in KV = 2MB+ payload per surprise
New approach: blob URL in KV = ~3KB payload per surprise
```

### Performance Design
- Adaptive particle count based on `window.innerWidth` and `hardwareConcurrency`
- `Promise.all()` preloads all images and audio before the experience begins, guaranteeing zero buffering mid-reveal
- `prefers-reduced-motion` respected throughout
- No layout shift, no late-loading assets, no janky transitions

### State Machine
Single `state` object manages the entire app. Creator and recipient flows run from the same `index.html`, determined by the presence of a `?s=` query param.

<br/>

---

## Design System

| Token | Value | Purpose |
|-------|-------|---------|
| `--bgFrom` | `#FFF7F3` | Warm cream base |
| `--primary` | `#C08497` | Dusty rose — all primary actions |
| `--accent` | `#D4AF37` | Warm gold — final unlock, signature lines |
| `--font-display` | Cormorant Garamond | All emotional headings |
| `--font-accent` | Dancing Script | Greetings, signatures |
| `--font-body` | Nunito | All UI, labels, body copy |
| Glassmorphism | `blur(18px)` + `rgba(255,255,255,0.55)` | All card surfaces |

Background is a 3D particle system rendered on a `<canvas>` with perspective projection, wobble physics, and opacity breathing. No CSS animations touch the canvas.

<br/>

---

## Why It's Built This Way

Every design decision was made against one question: *does this make her feel something, or does it just look like it does?*

- **No autoplay music** — it starts only after a user gesture (Safari policy respected)
- **No vocals during reading** — ambient is instrumental only while she reads; the voice note comes at the end
- **Locked final bloom** — mechanically enforced, not just visual. She can't skip to the end
- **Typewriter text** — she reads each word as it appears, not all at once
- **Gentle particles** — slow drift, no bouncing confetti energy. Calm, not celebratory

The result is something that feels like it was designed for one person.

<br/>

---

## Getting Started

### Local Development

```bash
git clone https://github.com/AKSINGH-0704/Mother-s-Day.git
cd Mother-s-Day
npm install
npx serve .
# → http://localhost:3000
```

> Note: API endpoints (`/api/save`, `/api/load`, `/api/upload`) require Vercel to run. Use the "Preview Experience" button locally to test the full recipient flow without a backend.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the following environment variables in your Vercel dashboard:

```
KV_REST_API_URL       # From your Vercel KV store
KV_REST_API_TOKEN     # From your Vercel KV store
BLOB_READ_WRITE_TOKEN # From your Vercel Blob store
```

### Add Your Personal Audio

Drop your voice note here:
```
/audio/personal-message.mp3
```
Recommended: 20 to 45 seconds. Your voice, or piano underneath your voice. No full songs.

<br/>

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript (ES2020+) |
| Animations | Web Animations API + Canvas 2D |
| Audio | Web Audio API + HTML5 Audio |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Vercel KV (Redis) |
| Image Storage | Vercel Blob |
| Fonts | Google Fonts (Cormorant Garamond, Dancing Script, Nunito) |
| Deployment | Vercel |

<br/>

---

## API Reference

### `POST /api/save`
Validates and stores a surprise. Returns a 10-character ID and expiry timestamp.

**Body:**
```json
{
  "relationship": "Mom",
  "name": "Priya",
  "balloons": [
    { "message": "I remember when...", "imageUrl": "https://..." }
  ],
  "finalMessage": "Thank you for everything."
}
```
**Response:** `{ "id": "abc1234xyz", "expiresAt": 1778393600000 }`

### `GET /api/load?id=abc1234xyz`
Retrieves a stored surprise. Returns 404 with a friendly message if expired.

### `POST /api/upload`
Accepts a base64 image string. Stores it in Vercel Blob. Returns the public URL.

<br/>

---

## Author

**AK Singh**
Built this for the people who deserve more than a last-minute card.

[![GitHub](https://img.shields.io/badge/GitHub-AKSINGH--0704-181717?style=flat-square&logo=github)](https://github.com/AKSINGH-0704)

<br/>

---

<div align="center">

*If this helped you make someone feel loved, that's the only metric that matters.*

</div>
