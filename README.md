# Testol Hub – Landing Page

A simple GitHub Pages site for **Testol Hub**: the MM2 helper that collects coins, keeps you safe from the murderer, and puts everything in one place.

## What’s in this repo

- **index.html** – Single-page site (hero, why us, features, get script, footer)
- **styles.css** – Layout, colors, and motion
- **script.js** – Scroll reveals and copy-button behavior

## How to launch on GitHub Pages

1. Create a new repository on GitHub (e.g. `testol-hub` or `testol-hub-site`).
2. Push this folder to the repo:
   ```bash
   cd testol-hub-site
   git init
   git add .
   git commit -m "Initial commit: landing page"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Branch: **main**, folder: **/ (root)**. Save.
6. After a minute or two, the site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Optional: host your script file

To make the “Copy script link” button work, host your `.lua` script in this repo (or another) and set the raw URL in `script.js`:

- In `script.js`, replace `scriptUrl` with your real raw script URL, e.g.  
  `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/mm2summerupdauto.lua`

---

Made by Testol Hub.
