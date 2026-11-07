@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =====================================
echo          CODELAB WEB - INICIAR
echo =====================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale a versao LTS em https://nodejs.org/
  pause
  exit /b 1
)
echo Iniciando servidor local...
start "CodeLab Web" http://localhost:4173
npm start
pause
