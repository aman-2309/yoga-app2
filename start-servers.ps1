# Yoga Trainer - Full Stack Startup Script
# For PowerShell

Write-Host "========================================"
Write-Host "  Yoga Trainer - Full Stack Startup"
Write-Host "========================================"
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\yoga\yoga-trainer'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\yoga\Frontend'; npm start"

Write-Host ""
Write-Host "========================================"
Write-Host "  Servers Starting..."
Write-Host "========================================"
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:1234" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the new terminal windows for startup logs"
Write-Host ""
