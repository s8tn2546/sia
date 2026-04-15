# Smart Supply Chain Integrated Stack

This repository now runs as one combined stack:

- Frontend (Vite + React): `frontend`
- Backend API (Express + MongoDB): `backend`
- Services layer (FastAPI + ML + LLM): `services`

## One-command local run

1. Install JS dependencies:

```bash
npm install
npm run install:all
```

2. Install Python dependencies:

```bash
pip install -r services/requirements.txt
```

3. Start everything:

```bash
npm run dev
```

Default ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Services: `http://localhost:8000`

Frontend requests to `/api/*` are proxied to the backend.
