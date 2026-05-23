# Deployment Guide

## Render (Primary — Free Tier)

1. Create account at https://render.com
2. New → Web Service → connect GitHub repo
3. **Environment:** Python 3
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `gunicorn app:app`
6. **Environment variables:**
   - `SECRET_KEY` — random string
   - `GEMINI_API_KEY` — optional
7. Deploy — free tier spins down after inactivity; first load may take ~30s

## Railway

1. https://railway.app → New Project → Deploy from GitHub
2. Uses `Procfile` automatically: `web: gunicorn app:app`
3. Set same env vars as Render

## Vercel (Not Recommended for Flask)

`vercel.json` is included for completeness. Flask on Vercel serverless can be fragile (cold starts, routing). Prefer Render for this project.

If using Vercel:
- Connect repo
- Set Python runtime from `runtime.txt`
- Expect to debug WSGI adapter issues

## Local Production Test

```bash
gunicorn app:app --bind 0.0.0.0:5000
```

## Free-Tier Tips

- AI works offline via mocks — no API key required for demos
- Avoid large asset uploads; use placeholder gradients
- Pin dependencies in `requirements.txt` for reproducible deploys
