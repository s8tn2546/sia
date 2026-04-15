# Smart Supply Chain Services (FastAPI)

## Setup

1. Create or update `.env` with API keys and options.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the service:

```bash
uvicorn api.service_api:app --host 0.0.0.0 --port 8000 --reload
```

## Required Endpoints

- `GET /predict-demand`
- `POST /predict-delay`
- `POST /chat`
- `GET /insights`
- `POST /routes`
- `GET /weather`

## Notes

- Demand model auto-trains with Prophet on first request if model file is missing.
- Delay model auto-trains with Random Forest on first request if model file is missing.
- If Maps or Weather keys are missing, deterministic fallback data is returned for local development.
