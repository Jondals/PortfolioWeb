@echo off
REM Ejecuta el test del portfolio: build + comprobaciones + Google Lighthouse (100 en todo).
cd /d "%~dp0"

if not exist node_modules (
  echo Instalando dependencias...
  call pnpm install || goto :error
)

call pnpm test || goto :error

echo.
echo  OK: el portfolio compila, funciona y saca 100 en Lighthouse.
pause
exit /b 0

:error
echo.
echo  ERROR: el test ha fallado. Revisa la salida de arriba.
pause
exit /b 1
