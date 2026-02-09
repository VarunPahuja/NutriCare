# NutriCare: Run backend (FastAPI) and frontend (Vite) together
# Usage: Open PowerShell in this folder and run: .\run_all.ps1

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Move to the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Info "Working directory: $scriptDir"

# --- Python backend setup ---
$venvPath = Join-Path $scriptDir ".venv"
$venvActivate = Join-Path $venvPath "Scripts/Activate.ps1"

# Detect Python launcher
$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue

if (!(Test-Path $venvActivate)) {
    Write-Info "Creating Python virtual environment (.venv)"
    if ($pyLauncher) {
        & $pyLauncher.Source -3 -m venv $venvPath
    } elseif ($pythonCmd) {
        & $pythonCmd.Source -m venv $venvPath
    } else {
        Write-Err "Python is not installed or not in PATH. Please install Python 3.10+ and rerun."
        exit 1
    }
}

# Activate venv and install backend dependencies
Write-Info "Activating venv and installing Python requirements"
& $venvActivate


# --- Node frontend setup ---
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $nodeCmd -or -not $npmCmd) {
    Write-Warn "Node.js or npm not found in PATH. Frontend may not start. Install Node.js LTS from https://nodejs.org/."
} else {
    if (!(Test-Path (Join-Path $scriptDir "node_modules"))) {
        Write-Info "Installing frontend dependencies (npm install)"
        npm install
    }
}

# --- Start backend (uvicorn predict_api:app) ---
Write-Info "Starting FastAPI backend on http://localhost:8000"
$backendCommand = "`"$venvActivate`"; uvicorn predict_api:app --host 127.0.0.1 --port 8000 --reload"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command", $backendCommand -WorkingDirectory $scriptDir

# --- Start frontend (Vite dev server) ---
Write-Info "Starting Vite frontend on http://localhost:8080"
$frontendCommand = "npm run dev"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command", $frontendCommand -WorkingDirectory $scriptDir

Write-Host "" # spacer
Write-Info "All set!"
Write-Host "- Backend: http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:8080" -ForegroundColor Green

Write-Host "`nNote: Two PowerShell windows were opened for backend and frontend. Close them to stop servers."