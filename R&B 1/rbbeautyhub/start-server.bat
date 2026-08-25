@echo off
title R&T Beauty Hub Server
echo.
echo ========================================
echo   R&T Beauty Hub - Starting Server...
echo ========================================
echo.
cd /d "%~dp0"
echo Server will run at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.
node server.js
pause
