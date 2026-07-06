# kennycep.github.io

My personal portfolio site, built by hand with plain HTML and CSS and served through GitHub Pages. It covers my
background across computation, cognitive science research, industry software engineering, and public-interest
technology and policy.

## Structure

```
index.html            Single-page site: hero, about, featured work, research, policy, software, foundation, contact
styles.css             All styles (no build step, no framework)
assets/img/            Headshot, hero poster frame, and favicon
assets/video/          Full-screen hero background loop (muted H.264)
assets/audio/          Optional hero audio track (royalty-free; commercial recordings stay out of this repo)
assets/js/             hero.js: background video, audio fades, header state
```

I kept this framework-free on purpose. It's a single page, so a build pipeline would be more overhead than the
site is worth.

## Running it locally

No build tooling needed. I usually just open `index.html` directly in a browser, or serve it if I want relative
paths to behave exactly like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

GitHub Pages deploys automatically from `main` (Settings &rarr; Pages &rarr; Deploy from branch: `main` / root),
so shipping an update is just:

```bash
git add -A
git commit -m "Update site"
git push origin main
```
