# U More Receipt Webapp

Internal receipt replacement web app built with Vite + React.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Free Deploy Recommendation

Recommended platform: `Cloudflare Pages`

Why this fits this project:
- This app is a static Vite build.
- Cloudflare Pages supports static deployments well.
- Static asset delivery on Pages is available on the free tier.

## Cloudflare Pages Deploy

### Option 1: Dashboard

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a new project from Git.
3. Use these settings:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Node version: 20
```

4. Deploy.

### Option 2: CLI direct upload

```bash
npm run deploy:cloudflare
```

That command will:
- Build the app
- Ask you to log in to Cloudflare through Wrangler if needed
- Upload `dist/` to a Pages project

For the first deploy, Wrangler will prompt for:
- Project name
- Production branch

Your site will be published on:

```text
https://<project-name>.pages.dev
```

## Notes

- If you choose Cloudflare Direct Upload first, Cloudflare documents that you cannot later switch that same Pages project to Git integration. If you want automatic deploys on every push, start with the Git-connected method.
- This project does not require server functions, so the free static hosting path is the simplest option.
