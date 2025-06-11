# Google Maps Integration Fix Script
# Run this in PowerShell to fix the HomeScreen.tsx corruption

Write-Host "Fixing HomeScreen.tsx corruption..." -ForegroundColor Yellow

# Backup the current corrupted file
Copy-Item "src\screens\HomeScreen.tsx" "src\screens\HomeScreen.backup.tsx" -Force

# Replace with working content from HomeScreenNew.tsx
Copy-Item "src\screens\HomeScreenNew.tsx" "src\screens\HomeScreen.tsx" -Force

Write-Host "HomeScreen.tsx has been restored from HomeScreenNew.tsx" -ForegroundColor Green

# Install dependencies
Write-Host "Installing Google Maps dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Google Maps integration setup complete!" -ForegroundColor Green
Write-Host "You can now run the app with 'npm start' and test the Google Maps functionality." -ForegroundColor Cyan
