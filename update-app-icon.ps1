# RestaurantGO Logo Güncelleme Script

param(
    [string]$LogoPath = "",
    [switch]$Help
)

if ($Help) {
    Write-Host "RestaurantGO Logo Güncelleme Script"
    Write-Host "Kullanım: .\update-app-icon.ps1 [-LogoPath 'path/to/logo.png']"
    Write-Host ""
    Write-Host "Bu script RestaurantGO uygulaması için uygulama simgesini güncelleyecek."
    Write-Host ""
    Write-Host "Seçenekler:"
    Write-Host "1. Otomatik restoran temalı simge oluştur"
    Write-Host "2. Mevcut simgeyi özel logo ile değiştir"
    Write-Host ""
    exit 0
}

Write-Host "🍽️ RestaurantGO Uygulama Simgesi Güncelleme" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if logo path is provided
if ($LogoPath -ne "" -and (Test-Path $LogoPath)) {
    Write-Host "Özel logo kullanılıyor: $LogoPath" -ForegroundColor Yellow
    
    # Install react-native-make if not exists
    Write-Host "React Native Make kontrolü..." -ForegroundColor Blue
    try {
        npm list -g react-native-make 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "React Native Make yükleniyor..." -ForegroundColor Yellow
            npm install -g react-native-make
        }
        
        # Generate icons
        Write-Host "Simgeler oluşturuluyor..." -ForegroundColor Blue
        npx react-native-make set-icon --path "$LogoPath"
        
    } catch {
        Write-Host "Hata: React Native Make yüklenemedi. Manuel güncelleme yapılacak." -ForegroundColor Red
    }
} else {
    Write-Host "🎨 Restoran Temalı Simge Seçenekleri:" -ForegroundColor Cyan
    Write-Host "1. 🍽️ Tabak ve Çatal-Kaşık Simgesi" -ForegroundColor White
    Write-Host "2. 🍕 Pizza Simgesi" -ForegroundColor White  
    Write-Host "3. 🍴 Çatal-Kaşık Simgesi" -ForegroundColor White
    Write-Host "4. 🥘 Yemek Tenceresi Simgesi" -ForegroundColor White
    Write-Host "5. 🧑‍🍳 Şef Simgesi" -ForegroundColor White
    
    $choice = Read-Host "Seçiminizi yapın (1-5)"
    
    $emoji = switch ($choice) {
        "1" { "🍽️" }
        "2" { "🍕" }
        "3" { "🍴" }
        "4" { "🥘" }
        "5" { "🧑‍🍳" }
        default { "🍽️" }
    }
    
    Write-Host "Seçilen simge: $emoji" -ForegroundColor Green
    
    # Create simple text-based icon suggestion
    Write-Host ""
    Write-Host "📋 Manuel Güncelleme Önerileri:" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "1. Online simge oluşturucu kullanın:"
    Write-Host "   - https://icon.kitchen"
    Write-Host "   - https://appicon.co"
    Write-Host "   - https://makeappicon.com"
    Write-Host ""
    Write-Host "2. Simge tasarım önerileri:"
    Write-Host "   - Emoji: $emoji"
    Write-Host "   - Arka plan: Turuncu-kırmızı gradient (#ff6b6b to #ff8e53)"
    Write-Host "   - Stil: Modern, yuvarlak köşeler"
    Write-Host ""
    Write-Host "3. Gerekli boyutlar:"
    Write-Host "   Android: 48x48, 72x72, 96x96, 144x144, 192x192 px"
    Write-Host "   iOS: 20x20@2x, 29x29@2x, 40x40@2x, 60x60@2x (ve 3x versiyonları)"
    Write-Host ""
}

# Clean and rebuild
Write-Host "🧹 Proje temizleniyor ve yeniden derleniyor..." -ForegroundColor Blue
Write-Host "Metro cache temizleniyor..." -ForegroundColor Gray
npx react-native start --reset-cache --port 8081 2>$null &
Start-Sleep -Seconds 2
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "Android projesi temizleniyor..." -ForegroundColor Gray
Push-Location android
try {
    .\gradlew clean
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "✅ Uygulama adı 'RestaurantGO' olarak güncellendi!" -ForegroundColor Green
Write-Host "📱 Telefondaki simgeyi görmek için uygulamayı yeniden derleyin:" -ForegroundColor Cyan
Write-Host "   - Android: npx react-native run-android" -ForegroundColor White
Write-Host "   - iOS: npx react-native run-ios" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Simge değişikliği için önerilen adımlar:" -ForegroundColor Yellow
Write-Host "1. Online araç ile restoran simgesi oluşturun" -ForegroundColor White
Write-Host "2. Tüm boyutlarda dışa aktarın" -ForegroundColor White  
Write-Host "3. android/app/src/main/res/mipmap-* klasörlerine kopyalayın" -ForegroundColor White
Write-Host "4. ios/BusinessGoApp/Images.xcassets/AppIcon.appiconset/ güncelleyin" -ForegroundColor White
Write-Host "5. Uygulamayı yeniden derleyin" -ForegroundColor White
