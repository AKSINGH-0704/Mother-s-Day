# Surprise Creator Project Documentation

## 1. Project Description
"Surprise Creator" is a magical, personalized celebration web application. It allows users to create customized digital surprises (for occasions like Women's Day, Birthdays, Anniversaries, etc.) featuring interactive balloon-popping reveals. Users input a recipient name, select an occasion, and add customized messages and optional images to multiple balloons. Once configured, the application generates a unique shareable link. The recipient opens the link, enjoys a 3D animated particle background, listens to dynamically generated piano music, and pops balloons to reveal the personalized messages.

## 2. Directory Structure and Files
- `index.html`: The main entry point containing the entire UI structure (setup screens, balloon editor, final reveal screens, and modals).
- `style.css`: Contains all styles, animations, variables, and responsive designs for the application.
- `app.js`: Contains all the client-side logic including state management, theme application, 3D background rendering, Web Audio API for sound generation (piano notes, pop sound effects), and flow control between screens.
- `package.json`: Contains basic project metadata and the `start` script (`npx serve .`).
- `vercel.json`: Configuration for Vercel deployment, setting up routing to map `/api/*` to the serverless functions and everything else to `index.html`.
- `api/save.js`: Vercel Serverless Function that receives the surprise data and saves it to `@vercel/kv` (Vercel KV Redis database), returning a short 10-character ID.
- `api/load.js`: Vercel Serverless Function that retrieves the surprise data from the KV store using the short ID.

## 3. Styles, Animations, and Fonts
### Fonts
The project uses several Google Fonts dynamically based on the selected occasion theme:
- *Dancing Script*, *Pacifico*, *Playfair Display*, *Merriweather*, *Montserrat* for Display Titles.
- *Poppins*, *Montserrat* for Body Text.

### Styles
The styling relies heavily on CSS variables which are dynamically updated via JavaScript in `applyTheme()`:
- `app.js` has a `THEMES` dictionary that defines primary/secondary/accent colors, gradients (`bgFrom`, `bgMid`, `bgTo`), and typography for different occasions.
- The CSS utilizes glassmorphism (translucent cards with blurring and soft borders) and glowing shadows to create a premium, magical feel.

### Animations
- **3D Particle Background**: A continuous `<canvas>` animation rendered in `animateBackground()`. It simulates depth (`z` axis) and scales/rotates emojis to create a falling or floating particle effect.
- **Balloon Interactions**: CSS keyframes like `@keyframes float` make balloons bob gently. Popping balloons triggers a particle explosion effect on a secondary `fireworkCanvas` (simulating confetti).
- **Audio**: Custom synthesized piano melodies using the Web Audio API (`AudioContext`, `OscillatorNode`, Reverb convolution) add to the emotional experience.

## 4. Wirings and Flow
The app operates as a Single Page Application (SPA) with two primary flows:

**Creator Flow:**
1. Setup (`screen-setup`): Select occasion, enter name.
2. Balloons (`screen-balloons`): Add messages and optionally upload images (which are automatically compressed to base64 via a hidden `<canvas>`).
3. Final Message (`screen-message`): Add a concluding thought.
4. Deploy (`screen-deploy`): Calls the backend to save the config and generate the share link.

**Recipient Flow:**
1. Loads URL with `?s=<id>`.
2. Fetches config from `/api/load?id=<id>`.
3. Welcome (`screen-welcome`): Starts music and begins the experience.
4. Pop Balloons (`screen-pop`): Interactive stage to reveal messages.
5. Final Reveal (`screen-reveal`): Displays the final message.

## 5. How the Shareable Link is Generated
The shareable link generation involves both the frontend and serverless backend:
1. In `app.js`, `initDeployScreen()` collects the entire state (`occasion`, `name`, `balloons` array with base64 images, `finalMessage`).
2. The frontend makes a `POST` request to `/api/save` with this JSON payload.
3. `api/save.js` receives the data, validates it, and generates a random 10-character alphanumeric string `id`.
4. The serverless function stores the payload in a Vercel KV store (`@vercel/kv`) using the key `s:<id>` with an expiration of 180 days.
5. The API returns the `id` to the frontend.
6. The frontend constructs the link using `window.location.origin + window.location.pathname + '?s=' + id` (e.g., `https://yoursite.com/?s=a1b2c3d4e5`) and displays it to the user.
