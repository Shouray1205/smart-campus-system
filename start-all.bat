@echo off
title Smart Campus Launcher
echo ========================================================
echo   Launching Smart Campus Management System Full-Stack
echo ========================================================

echo Starting Spring Boot Backend in a separate window...
start "Smart Campus Backend (Port 8088)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo Starting React Vite Frontend in a separate window...
start "Smart Campus Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are launching!
echo Frontend will be live at: http://localhost:5173
echo Backend API will be live at: http://localhost:8088
echo.
pause
