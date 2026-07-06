# Mingli Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local browser UI for `mingli-master` that accepts birth data, computes a Zi Wei Dou Shu chart, shows a readable result, and generates an HTML report.

**Architecture:** A small standard-library Python HTTP server serves static files and JSON endpoints. A focused service module wraps `mingli-master/scripts/calculate_chart.py` and `generate_html.py`, keeping astrology calculation separate from web concerns.

**Tech Stack:** Python 3.14 local venv, stdlib `http.server`, vanilla HTML/CSS/JS, existing `iztro-py` dependency.

---

### Task 1: Service Layer

**Files:**
- Create: `webapp/mingli_service.py`
- Test: `tests/test_mingli_service.py`

- [x] Write failing tests for validation, chart calculation, and HTML report generation.
- [ ] Implement `BirthInput`, `validate_birth_input`, `calculate_chart`, `build_reading`, and `generate_report`.
- [ ] Run `.\.venv\Scripts\python.exe -m unittest discover -s tests -v`.

### Task 2: HTTP API

**Files:**
- Create: `webapp/server.py`

- [ ] Add `GET /`, `GET /static/*`, `POST /api/chart`, and `GET /reports/*`.
- [ ] Return JSON errors with HTTP 400 for invalid input.
- [ ] Re-run unit tests and manually call `POST /api/chart`.

### Task 3: Frontend

**Files:**
- Create: `webapp/static/index.html`
- Create: `webapp/static/app.css`
- Create: `webapp/static/app.js`

- [ ] Build the first-screen tool UI: calendar toggle, date, hour, gender, optional name, submit.
- [ ] Render chart summary, twelve-palace grid, reading cards, calibration questions, and report link.
- [ ] Check responsive layout at narrow and desktop widths.

### Task 4: Verification

**Files:**
- Modify: `README_LOCAL.md`

- [ ] Document `.\.venv\Scripts\python.exe .\webapp\server.py`.
- [ ] Run unit tests.
- [ ] Start local server and verify page/API behavior.

