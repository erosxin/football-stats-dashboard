@echo off
title Football Dashboard - Server

echo Football Dashboard - Starting Server
echo ====================================

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Starting server...
echo.
echo Server will start at: http://localhost:12000
echo Press Ctrl+C to stop the server
echo.

npm start