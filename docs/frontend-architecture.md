# Frontend Architecture

## Template Inheritance

All pages extend `templates/base.html` and load modular CSS/JS per page via `{% block extra_css %}` / `{% block extra_js %}`.

## Route Map (BR ↔ Pages)

| Route | Template | BR Feature |
|-------|----------|------------|
| `/` | index.html | Landing, AI showcase |
| `/explore` | explore.html | Discover freelancers |
| `/talent/<id>` | talent-details.html | Portfolio profile |
| `/signup` | signup.html | Role picker (Freelancer/Client/Both) |
| `/verify` | identity-verify.html | ID / LinkedIn verification UI |
| `/dashboard` | dashboard.html | Freelancer dashboard |
| `/proposals` | proposals-browse.html | Browse & submit proposals |
| `/contracts` | active-contracts.html | Active contracts & deliverables |
| `/earnings` | earnings.html | Earnings + 10% commission |
| `/skill-verifier` | skill-verifier.html | AI skill test → badge |
| `/portfolio-reviewer` | portfolio-reviewer.html | AI portfolio tips |
| `/client/dashboard` | recruiter-dashboard.html | Client dashboard |
| `/client/post-project` | post-project.html | Post project + scoping AI |
| `/client/proposals/<id>` | view-proposals.html | Proposal evaluator |
| `/client/discover` | talent-discovery.html | Smart freelancer match |
| `/client/milestones/<id>` | milestones.html | Sandbox milestone payments |
| `/community` | community-feed.html | Public feed |
| `/competitions` | competitions.html | Skill challenges |
| `/mentorship` | mentorship.html | Mentorship sessions |
| `/subscription` | subscription.html | Pro plan sandbox checkout |

## Data Layer

- `static/js/mock-data.js` — single source of demo content
- `localStorage.talentstage_role` — demo role for sidebar nav

## AI Layer

- `static/js/ai-client.js` — `fetch('/api/ai/<feature>')`
- `static/js/ai-mock.js` — UI rendering + offline fallbacks
- `app.py` — mock JSON or Gemini when `GEMINI_API_KEY` is set
