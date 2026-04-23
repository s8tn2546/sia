# SIA Backend API

Express.js server for supply chain management endpoints and integration with FastAPI ML/LLM services.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from template:

```bash
cp .env.example .env
```

3. Configure environment variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_supply_chain
FASTAPI_BASE_URL=http://localhost:8000
JWT_SECRET=your_secret_key_here
```

## Running

Development (with hot reload):

```bash
npm run dev
```

Production:

```bash
npm run start
```

## API Endpoints

### Core Operations

- `GET /api/inventory` – Fetch all inventory items
- `POST /api/supply` – Create supply transaction
- `GET /api/track/:id` – Get shipment tracking info

### ML/LLM Integration

- `GET /api/demand` – Get demand forecast (proxies FastAPI)
- `GET /api/insights` – Get AI recommendations (proxies FastAPI)
- `POST /api/chat` – Chat with AI assistant (proxies FastAPI)
- `POST /api/routes` – Optimize delivery routes (proxies FastAPI)

### Health

- `GET /health` – Server health check

## Architecture

```
src/
├── routes/        – API route definitions
├── controllers/   – Request handlers (business logic)
├── models/        – MongoDB schemas
├── services/      – FastAPI integration clients
├── middleware/    – Auth, error handling, logging
├── config/        – Environment and database config
└── utils/         – Helper functions
```

## Database

MongoDB is required. Set `MONGO_URI` in `.env`:

- Local: `mongodb://localhost:27017/smart_supply_chain`
- Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/smart_supply_chain`

## Error Handling

All endpoints return consistent JSON format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "details": {}
}
```

## Logging

Morgan middleware logs all HTTP requests. Format: `dev` (colorized for development)

## Security

- Helmet enforces HTTP headers
- CORS allows requests from frontend (configured in app.js)
- Request body limited to 1MB

## Dependencies

- `express` – Web framework
- `mongoose` – MongoDB ODM
- `dotenv` – Environment variables
- `cors` – Cross-origin requests
- `helmet` – HTTP security headers
- `morgan` – HTTP logging
- `nodemon` – Dev auto-restart (dev only)

---

For full API documentation, see the main [README](../README.md)
