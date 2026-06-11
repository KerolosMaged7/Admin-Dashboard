# Deploy to Free Public Link

## Option 1: Vercel (Fastest 🚀)

1. **Push your code to GitHub** (if not already there)
   ```bash
   git add .
   git commit -m "Add demo mode and deploy config"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Click "New Project" → Select this repository**
   - Vercel auto-detects the Vite config
   - Demo mode is pre-configured via `vercel.json`
   - Click "Deploy"

4. **Get your public link** in ~1 minute:
   ```
   https://your-project-name.vercel.app/?demo=1
   ```

---

## Option 2: Netlify (Also Free)

1. **Push to GitHub** (same as above)

2. **Go to [netlify.com](https://netlify.com)** and sign in with GitHub

3. **Click "Add new site" → Import an existing project**
   - Connect your GitHub repo
   - Build settings auto-detect from `netlify.toml`
   - Click "Deploy site"

4. **Your link is ready** in ~2 minutes:
   ```
   https://your-site-name.netlify.app/?demo=1
   ```

---

## Option 3: GitHub Pages (Free + Simple)

1. **Push to GitHub**

2. **Go to repo Settings → Pages → Build and deployment**
   - Source: GitHub Actions
   - Wait for the workflow to complete

3. **Your link** (replace username/repo):
   ```
   https://username.github.io/repo/?demo=1
   ```

---

## Sharing on LinkedIn

Once deployed, share your demo link:

> **Check out my Admin Dashboard Demo!** 🎯
> 
> Real-time CRUD operations, revenue tracking, product analytics.
> 
> Live demo → [your-link.vercel.app/?demo=1](https://your-demo-link)
> 
> Built with React + Vite. Click "Reset demo data" to start fresh. #React #Dashboard

---

**All visitors get their own isolated demo state** — changes don't affect other users' sessions.
