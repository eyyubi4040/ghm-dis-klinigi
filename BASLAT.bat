@echo off
chcp 65001 > nul
title Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Web Sunucusu
echo ============================================================
echo   Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Kırşehir
echo   Bun Web Sunucusu Başlatılıyor...
echo ============================================================
echo.

cd /d "%~dp0"
start "" http://localhost:3000
bun server/index.ts
pause

