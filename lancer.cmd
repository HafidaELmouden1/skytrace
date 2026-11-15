@echo off
title SkyTrace - SPHEREx
cd /d "%~dp0"

echo.
echo  ============================================
echo   SkyTrace - visualiseur SPHEREx (DR1)
echo  ============================================
echo.
echo   Adresse a ouvrir dans le navigateur :
echo.
echo       http://localhost:8000
echo.
echo   Le navigateur ne servira qu'une fois la ligne
echo   "Application startup complete" affichee.
echo   Ctrl+C dans cette fenetre pour arreter.
echo.

"%USERPROFILE%\.local\bin\uv.exe" run --python 3.13 --with fastapi --with uvicorn --with astropy --with numpy --with pillow uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000

echo.
echo  Le serveur s'est arrete.
echo  Si une erreur est affichee ci-dessus, garde cette fenetre ouverte.
pause
