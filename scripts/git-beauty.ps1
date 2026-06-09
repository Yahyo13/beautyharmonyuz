param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$action = "load"
$messageParts = @()

if ($Args.Count -gt 0) {
  $action = $Args[0]
  if ($Args.Count -gt 1) {
    $messageParts = $Args[1..($Args.Count - 1)]
  }
}

if ($action -ne "load") {
  Write-Host "Usage: git beauty load [commit message]"
  exit 2
}

function Invoke-Step {
  param(
    [string]$Title,
    [scriptblock]$Action
  )

  Write-Host ""
  Write-Host "==> $Title"
  & $Action
  if ($LASTEXITCODE -ne 0) {
    throw "$Title failed with exit code $LASTEXITCODE"
  }
}

$branch = (git branch --show-current).Trim()
if (-not $branch) {
  $branch = "main"
}

$remote = (git remote).Trim() -split "\s+" | Select-Object -First 1
if (-not $remote) {
  throw "No git remote found. Add origin before using git beauty load."
}

Invoke-Step "Build site" { npm run build }
Invoke-Step "Stage changes" { git add -A }

git diff --cached --quiet
$diffExitCode = $LASTEXITCODE
if ($diffExitCode -eq 0) {
  Write-Host ""
  Write-Host "No local changes to commit. Pushing current $branch branch anyway."
} elseif ($diffExitCode -eq 1) {
  if ($messageParts.Count -gt 0) {
    $commitMessage = $messageParts -join " "
  } else {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $commitMessage = "Update Beauty Harmony site $stamp"
  }

  Invoke-Step "Commit changes" { git commit -m $commitMessage }
} else {
  throw "git diff failed with exit code $diffExitCode"
}

Invoke-Step "Sync with GitHub" { git pull --rebase $remote $branch }
Invoke-Step "Push to GitHub" { git push $remote $branch }

Write-Host ""
Write-Host "Done. Vercel will deploy after GitHub receives the push."
