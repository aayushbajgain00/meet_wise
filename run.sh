#!/bin/bash
echo "========================================="
echo "🚀 Starting Meetwise (Backend + Frontend)"
echo "========================================="

# === Backend ===
echo
echo "📦 Checking backend dependencies..."
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  (cd backend && npm install)
else
  echo "✅ Backend dependencies already installed."
fi

# === Frontend ===
echo
echo "📦 Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd frontend && npm install)
else
  echo "✅ Frontend dependencies already installed."
fi

# === Run both ===
echo
echo "▶️ Starting backend server..."
(cd backend && npm run dev &)

echo "▶️ Starting frontend server..."
(cd frontend && npm run dev &)

wait
echo
echo "✅ Everything started successfully!"
