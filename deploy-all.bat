@echo off
REM ==============================================================================
REM Screenlady Full Deployment Script (Windows CMD / Batch)
REM Deploys:
REM   1. Cloudflare Worker Backend + D1 Database
REM   2. Main Website (Cloudflare Pages: screenlady-website)
REM   3. Admin Portal (Cloudflare Pages: screenlady-admin)
REM ==============================================================================

echo ==========================================
echo   ACCOLADE SCREENLADY - FULL DEPLOYMENT   
echo ==========================================

echo.
echo [1/3] Deploying Backend Worker...
call npx.cmd wrangler deploy --config backend/wrangler.jsonc
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend deployment failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Building and Deploying Main Frontend...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Main frontend build failed!
    exit /b %ERRORLEVEL%
)
call npx.cmd wrangler pages deploy dist --project-name screenlady-website --branch main
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Main frontend deploy failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Building and Deploying Admin Portal...
call npm.cmd run build --prefix admin-portal
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Admin portal build failed!
    exit /b %ERRORLEVEL%
)
call npx.cmd wrangler pages deploy admin-portal/dist --project-name screenlady-admin --branch main
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Admin portal deploy failed!
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================
echo   ALL SYSTEMS DEPLOYED AND LIVE!
echo ==========================================
echo   * Main Website: https://screenlady-website.pages.dev
echo   * Admin Portal: https://screenlady-admin.pages.dev
echo   * Backend API:  https://screenlady-backend.patilrohan2407.workers.dev
echo ==========================================
