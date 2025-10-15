@echo off
echo =========================================
echo  Starting Meetwise (Backend + Frontend)
echo =========================================

REM === Backend ===
echo.
echo 📦 Checking backend dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
) else (
    echo ✅ Backend dependencies already installed.
)

REM === Frontend ===
echo.
echo 📦 Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
) else (
    echo ✅ Frontend dependencies already installed.
)

REM === Run both ===
echo.
echo ▶️ Starting backend server...
start cmd /k "cd backend && npm run dev"

echo ▶️ Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Everything started! You can close this window if needed.
pause
