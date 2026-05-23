# TalentStage

AI-powered creator & freelancer marketplace — hackathon-ready Flask frontend shell with full BR coverage (mock data, optional AI API).

## Features

- **Freelancer:** portfolio, proposals, contracts, earnings, skill verifier, portfolio reviewer
- **Client:** post projects, AI match, proposal evaluator, milestones (sandbox payments)
- **Community:** feed, skill challenges, mentorship
- **AI (offline mock + optional Gemini):** match, evaluate, portfolio-review, skill-test, scope

## Tech Stack

- Flask (Python) + Jinja2 templates
- HTML5, CSS3, Vanilla JavaScript only
- No React, Tailwind, or Bootstrap

## Quick Start

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # optional: set GEMINI_API_KEY
python app.py
```

Open http://127.0.0.1:5000

## Optional AI

Set `GEMINI_API_KEY` in `.env` to enable live AI via `/api/ai/<feature>`. Without a key, all AI endpoints return realistic mock JSON.

## Deploy (Render — recommended)

1. Push repo to GitHub
2. [Render](https://render.com) → New Web Service → connect repo
3. Build: `pip install -r requirements.txt`
4. Start: `gunicorn app:app`
5. Add env vars: `SECRET_KEY`, optional `GEMINI_API_KEY`

See [docs/deployment-guide.md](docs/deployment-guide.md) for Railway and Vercel notes.

## Project Structure

```
app.py              # Flask routes + AI proxy
templates/          # Jinja2 pages & partials
static/css/         # Modular stylesheets
static/js/          # mock-data.js, ai-mock.js, page scripts
docs/               # Architecture & deployment guides
```

## License

MIT
