# Component Guide

Reusable patterns live in `static/css/components.css` and `templates/partials/`.

## Layout

- **Navbar** — `partials/navbar.html`, fixed top, mobile toggle
- **Footer** — `partials/footer.html`, 4-column grid
- **Sidebar** — `partials/sidebar.html`, role-based `data-show-role` items

## Components

| Class | Purpose |
|-------|---------|
| `.glass-card` | Primary content container |
| `.btn-primary` / `.btn-secondary` / `.btn-ghost` | Actions |
| `.badge-verified` / `.badge-ai` / `.badge-recommended` | Status chips |
| `.tag` | Skill labels |
| `.stat-card` | Dashboard metrics |
| `.ai-panel` | AI feature container |
| `.progress-bar` | Completion / scores |
| `.dropzone` | File upload UI (demo) |
| `.modal-overlay` | Dialogs |

## JavaScript

- `showToast(message)` — global notifications
- `runAI(feature, payload)` — triggers AI panel in page
- `MOCK_DATA` — shared mock dataset
