# kennycep.github.io

Personal portfolio site for Kenny Cepeda Ramos, served via GitHub Pages.

## Structure

```
index.html          Single-page site: hero, about, experience, leadership, projects, coursework, contact
styles.css           All styles (no build step, no framework)
assets/img/          Headshot and favicon
```

## Local development

No build tooling required. Either open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Pushing to `main` deploys automatically via GitHub Pages (Settings &rarr; Pages &rarr; Deploy from branch: `main` / root).

```bash
git add -A
git commit -m "Update site"
git push origin main
```
