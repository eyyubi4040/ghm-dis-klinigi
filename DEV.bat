@echo off
chcp 65001 > nul
title Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Geliştirici Modu (Hot-Reload)
cd /d "%~dp0"
echo Geliştirici sunucusu başlatılıyor (Canlı yenileme aktif)...
bun --watch server/index.ts
pause

