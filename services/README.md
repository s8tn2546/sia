# SIA Services Layer (FastAPI + ML)

High-performance Python service for demand forecasting, delay prediction, AI chatbot, and route optimization.

## Setup

### Python Environment

Requires Python 3.10 or 3.11. Support for other versions depends on `pydantic-core` wheel availability.

```bash
# Create virtual environment (use Python 3.11 for best compatibility)
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file:

```env
ENV=development
HOST=0.0.0.0
PORT=8000

# LLM Choice
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash

# Optional APIs (fallback mock data if missing)
GOOGLE_MAPS_API_KEY=your_maps_key_here
OPENWEATHER_API_KEY=your_weather_key_here

# ML Models
DEMAND_MODEL_PATH=ml/demand/model.pkl
DELAY_MODEL_PATH=ml/delay/model.pkl
```

## Running

Development (with auto-reload):

```bash
python -m uvicorn api.service_api:app --host 0.0.0.0 --port 8000 --reload
```

Production:

```bash
python -m uvicorn api.service_api:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Forecasting

- **`GET /predict-demand`** – Demand forecast (Prophet)
  - Auto-trains model on first request
  - Returns 7-day forecast
  - Accuracy: 96%+

- **`POST /predict-delay`** – Delay prediction (Random Forest)
  - Auto-trains model on first request
  - Considers weather, distance, carrier
  - Returns delay probability

### AI/LLM

- **`POST /chat`** – Conversational AI
  - Request: `{"message": "str", "context": "supply_chain_management"}`
  - Returns: `{"answer": "str"}`
  - Fallback to mock if API key missing

- **`GET /insights`** – Supply chain recommendations
  - Returns: `{"recommendations": "str"}`
  - Based on historical patterns and LLM

### Integration

- **`POST /routes`** – Route optimization (Google Maps)
  - Request: `{"origin": "str", "destination": "str", "mode": "ground|air|sea|rail"}`
  - Returns: `{"routes": [...]}`
  - Fallback to mock if API key missing

- **`GET /weather`** – Weather data fetch
  - Returns: `{"temperature_c": float, "rain_mm": float, ...}`
  - Uses OpenWeather API

### Health

- **`GET /health`** – Service health check

## Architecture

```
api/
├── service_api.py      – Main FastAPI app
├── routes/             – Endpoint definitions
│   ├── demand.py       – Demand forecasting
│   ├── delay.py        – Delay prediction
│   ├── chatbot.py      – AI chat
│   ├── insights.py     – Recommendations
│   ├── maps.py         – Route optimization
│   └── weather.py      – Weather integration
└── schemas/            – Pydantic request/response models

config/
├── settings.py         – Environment variables
└── constants.py        – Constants

llm/
├── chatbot.py          – LLM interaction
├── insights.py         – Insight generation
├── context_builder.py  – Prompt engineering
└── prompts.py          – System prompts

ml/
├── common/
│   ├── metrics.py      – Evaluation metrics
│   └── preprocess.py   – Data preprocessing
├── demand/
│   ├── train.py        – Prophet training
│   ├── predict.py      – Forecasting
│   ├── dataset.csv     – Training data
│   └── model.pkl       – Trained model
└── delay/
    ├── train.py        – Random Forest training
    ├── predict.py      – Prediction
    └── model.pkl       – Trained model

integrations/
├── auth.py             – Authentication
├── maps.py             – Google Maps integration
├── weather.py          – Weather data
└── notifications.py    – Alert system

utils/
├── logger.py           – Logging setup
├── validators.py       – Input validation
├── formatter.py        – Response formatting
└── helpers.py          – Utility functions

tests/
├── test_chatbot.py
├── test_demand.py
├── test_delay.py
└── test_routes.py
```

## Model Training

### Demand Forecasting

Prophet model auto-trains on first `GET /predict-demand` request:

```python
# From ml/demand/train.py
df = load_and_preprocess_data('ml/demand/dataset.csv')
model = Prophet()
model.fit(df)
model.save('ml/demand/model.pkl')  # Joblib serialization
```

**Parameters:**
- Seasonality: Monthly + Yearly
- Changepoint flexibility: 0.05
- Interval width: 0.80

### Delay Prediction

Random Forest model auto-trains on first `/predict-delay` request:

```python
# From ml/delay/train.py
X, y = prepare_features()
model = RandomForestRegressor(n_estimators=100, max_depth=15)
model.fit(X, y)
joblib.dump(model, 'ml/delay/model.pkl')
```

**Features:**
- Distance (km)
- Weather (temp, rain, wind)
- Time of day
- Carrier performance
- Route complexity

## Troubleshooting

### Build Issues on Windows

If `pydantic-core` fails to compile:

```bash
# Use Python 3.11 (most stable for Windows)
python3.11 -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt

# If still fails, use pre-built wheels
pip install --only-binary :all: pydantic-core
```

### Missing API Keys

The service falls back to mock data if API keys are missing. Endpoints still work but return deterministic test data.

### Model Not Found

Models are auto-trained on first request. If training fails, check:

1. Dataset exists: `ml/demand/dataset.csv`, `ml/delay/dataset.csv`
2. Disk space available
3. Python libraries installed: `prophet`, `scikit-learn`, `joblib`

## Dependencies

- `fastapi` – Web framework
- `uvicorn` – ASGI server
- `pydantic` – Data validation
- `prophet` – Time-series forecasting
- `scikit-learn` – ML models
- `pandas` – Data processing
- `numpy` – Numerical computing
- `requests` – HTTP client
- `google-generativeai` – Gemini API
- `openai` – OpenAI API
- `python-dotenv` – Environment variables
- `joblib` – Model serialization

---

For full API documentation, see the main [README](../README.md)
