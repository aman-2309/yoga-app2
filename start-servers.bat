@echo off
echo ========================================
echo   Yoga Trainer - Full Stack Startup
echo ========================================
echo.

echo Starting Backend Server...
start "Yoga Backend" cmd /k "cd /d d:\yoga\yoga-trainer && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 >nul

echo Starting Frontend Server...
start "Yoga Frontend" cmd /k "cd /d d:\yoga\Frontend && npm start"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:1234 (or check frontend terminal)
echo.
echo Press any key to exit this window...
pause >nul
