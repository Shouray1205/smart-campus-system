@echo off
title Smart Campus - Backend (Spring Boot)
cd /d "%~dp0backend"
echo ========================================================
echo   Starting Smart Campus Spring Boot Backend on Port 8088
echo ========================================================
mvn spring-boot:run
pause
