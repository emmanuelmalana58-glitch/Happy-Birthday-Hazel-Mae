# 🌺 Hazel's Birthday Site (Stitch / Ohana theme)

A static website. Every push to `main` is deployed automatically to GitHub Pages.

## Put it online (one time)
1. Create a new repository on GitHub (e.g. `hazel-birthday`).
2. Upload everything in this folder (keep the `.github` folder!), or from a terminal:
   ```bash
   git init -b main
   git add .
   git commit -m "Birthday site"
   git remote add origin https://github.com/<your-username>/hazel-birthday.git
   git push -u origin main
   ```
3. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to turn green.
   Your site is at `https://<your-username>.github.io/hazel-birthday/`.

From then on, just commit changes to `main` and the site updates itself.

## Customise
Edit `js/config.js`: name, birthday date (for the countdown), tagline, photo captions, wishes.
To add photos, drop them into `images/` (about 1400px wide is plenty) and add a line in `config.js`.

## Note on privacy
GitHub Pages sites are public to anyone with the link. Pages from private repos need a paid GitHub plan.
