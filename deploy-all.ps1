# ==============================================================================
# Screenlady Full Deployment Script (PowerShell)
# Deploys:
#   1. Cloudflare Worker Backend + D1 Database
#   2. Main Website (Cloudflare Pages: screenlady-website)
#   3. Admin Portal (Cloudflare Pages: screenlady-admin)
# ==============================================================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ACCOLADE SCREENLADY - FULL DEPLOYMENT   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. DEPLOY BACKEND WORKER
Write-Host "`n[1/3] Deploying Backend Worker..." -ForegroundColor Yellow
npx.cmd wrangler deploy --config backend/wrangler.jsonc
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend deployment failed! Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Backend Worker deployed successfully: https://screenlady-backend.patilrohan2407.workers.dev" -ForegroundColor Green

# 2. BUILD & DEPLOY MAIN WEBSITE
Write-Host "`n[2/3] Building & Deploying Main Frontend..." -ForegroundColor Yellow
npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Main frontend build failed! Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}
npx.cmd wrangler pages deploy dist --project-name screenlady-website --branch main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Main frontend Pages deployment failed! Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Main Website deployed successfully: https://screenlady-website.pages.dev" -ForegroundColor Green

# 3. BUILD & DEPLOY ADMIN PORTAL
Write-Host "`n[3/3] Building & Deploying Admin Portal..." -ForegroundColor Yellow
npm.cmd run build --prefix admin-portal
if ($LASTEXITCODE -ne 0) {
    Write-Host "Admin Portal build failed! Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}
npx.cmd wrangler pages deploy admin-portal/dist --project-name screenlady-admin --branch main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Admin Portal Pages deployment failed! Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "Admin Portal deployed successfully: https://screenlady-admin.pages.dev" -ForegroundColor Green

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  ALL SYSTEMS DEPLOYED & LIVE ON CLOUDFLARE " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  • Main Website: https://screenlady-website.pages.dev" -ForegroundColor White
Write-Host "  • Admin Portal: https://screenlady-admin.pages.dev" -ForegroundColor White
Write-Host "  • Backend API:  https://screenlady-backend.patilrohan2407.workers.dev" -ForegroundColor White

