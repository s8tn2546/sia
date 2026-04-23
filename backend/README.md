# Smart Supply Chain Backend (Express)

## Setup

1. Copy `.env.example` to `.env` if needed.
2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

## Required Endpoints

- `GET /api/demand`
- `POST /api/delay`
- `POST /api/routes`
- `POST /api/chat`
- `GET /api/insights`
- `GET /api/inventory`
- `POST /api/supply`
- `GET /api/track/:id`

## Notes

- Backend proxies ML/LLM/integration calls to FastAPI using `FASTAPI_BASE_URL`.
- `MONGO_URI` must point to a running MongoDB instance.
