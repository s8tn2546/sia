#!/bin/bash
# Universal setup script for SIA platform

echo "🚀 Starting setup for SIA platform..."

# 1. Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# 2. Install Frontend dependencies
echo "🎨 Setting up Frontend..."
cd frontend && npm install && cd ..

# 3. Install Backend dependencies
echo "⚙️ Setting up Backend..."
cd backend && npm install && cd ..

# 4. Install Services dependencies
echo "🤖 Setting up Services..."
cd services
python3 -m venv venv
./venv/bin/python3 -m pip install --upgrade pip
./venv/bin/pip install fastapi uvicorn python-dotenv pydantic pandas numpy scikit-learn prophet joblib requests httpx openai google-generativeai
cd ..

echo "✅ Setup complete!"
echo "To run all services, use: npm run dev"
