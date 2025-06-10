param(
    [switch]$Help,
    [switch]$AutoOpen
)

if ($Help) {
    Write-Host "🍽️ RestaurantGO Android Simge Güncelleme Script"
    Write-Host "Usage: .\update-android-icon-manual.ps1 [-AutoOpen]"
    Write-Host ""
    Write-Host "-AutoOpen: Otomatik olarak Icon Kitchen web sitesini açar"
    exit 0
}

Clear-Host
Write-Host "🍽️ RestaurantGO Android Simge Güncelleme" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Step 1: Online Icon Generator
Write-Host "📱 ADIM 1: Online Simge Oluşturucu" -ForegroundColor Cyan
Write-Host "1. Icon Kitchen web sitesini açın: https://icon.kitchen" -ForegroundColor White
Write-Host "2. 'Text to Icon' seçeneğini seçin" -ForegroundColor White
Write-Host "3. Text alanına: 🍽️ girin" -ForegroundColor White
Write-Host "4. Background: 'Gradient' seçin" -ForegroundColor White
Write-Host "5. Colors: #ff6b6b (sol) → #ff8e53 (sağ)" -ForegroundColor White
Write-Host "6. Shape: 'Circle' veya 'Rounded Rectangle'" -ForegroundColor White
Write-Host "7. 'Generate Icon Pack' butonuna tıklayın" -ForegroundColor White
Write-Host "8. 'Download Android' seçeneğini seçin" -ForegroundColor White
Write-Host ""

if ($AutoOpen) {
    Write-Host "🌐 Icon Kitchen açılıyor..." -ForegroundColor Yellow
    Start-Process "https://icon.kitchen"
    Start-Sleep -Seconds 2
}

Read-Host "Simge paketi indirdikten sonra Enter'a basın"

# Step 2: File locations
Write-Host ""
Write-Host "📁 ADIM 2: Dosyaları Kopyalayın" -ForegroundColor Cyan
Write-Host ""
Write-Host "İndirdiğiniz ZIP dosyasını açın ve şu dosyaları kopyalayın:" -ForegroundColor Yellow
Write-Host ""

$mipmapFolders = @("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi")
$projectPath = $PSScriptRoot

foreach ($folder in $mipmapFolders) {
    Write-Host "FROM: mipmap-$folder/ic_launcher.png" -ForegroundColor Green
    Write-Host "TO:   $projectPath\android\app\src\main\res\mipmap-$folder\ic_launcher.png" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "FROM: mipmap-$folder/ic_launcher_round.png" -ForegroundColor Green  
    Write-Host "TO:   $projectPath\android\app\src\main\res\mipmap-$folder\ic_launcher_round.png" -ForegroundColor Magenta
    Write-Host "---" -ForegroundColor Gray
}

Write-Host ""
Read-Host "Tüm dosyaları kopyaladıktan sonra Enter'a basın"

# Step 3: Clean project
Write-Host ""
Write-Host "🧹 ADIM 3: Proje Temizleme" -ForegroundColor Cyan
Write-Host "Android projesi temizleniyor..." -ForegroundColor Yellow

Push-Location "$projectPath\android"
try {
    .\gradlew.bat clean
    Write-Host "✅ Proje temizlendi!" -ForegroundColor Green
} catch {
    Write-Host "❌ Proje temizleme hatası: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Pop-Location
}

# Step 4: Instructions for rebuild
Write-Host ""
Write-Host "🚀 ADIM 4: Uygulamayı Çalıştırın" -ForegroundColor Cyan
Write-Host "Aşağıdaki komutu çalıştırın:" -ForegroundColor Yellow
Write-Host "npx react-native run-android" -ForegroundColor White
Write-Host ""
Write-Host "veya VS Code task'ını kullanın:" -ForegroundColor Yellow
Write-Host "Ctrl+Shift+P → Tasks: Run Task → Android: Robust Deployment" -ForegroundColor White
Write-Host ""

# Offer to run automatically
$runNow = Read-Host "Şimdi uygulamayı otomatik olarak çalıştırmak istiyor musunuz? (y/n)"
if ($runNow -eq "y" -or $runNow -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Uygulama başlatılıyor..." -ForegroundColor Green
    npx react-native run-android
}

Write-Host ""
Write-Host "📱 RestaurantGO uygulamanız artık restoran temalı simge ile görünecek!" -ForegroundColor Green
Write-Host "✨ Simge değişikliğini görmek için Android ana ekranını kontrol edin." -ForegroundColor Yellow
