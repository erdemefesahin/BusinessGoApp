# Android Emülatör Sorun Giderme Rehberi

Bu dosya, Android emülatörde uygulamanın görünmeme sorunlarını çözmek için adım adım rehber sağlar.

## Ana Sorun Nedenleri ve Çözümleri

### 1. JAVA_HOME Sorunu ✅ ÇÖZÜLDİ
**Belirti:** "Please set the JAVA_HOME variable" hatası
**Çözüm:** 
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
```

### 2. İlk Build Süresi (Normal Durum)
**Belirti:** Gradle build uzun süre alıyor
**Açıklama:** İlk build 5-10 dakika sürebilir (dependencies indirme)
**Çözüm:** Sabırla bekleyin

### 3. Build Tamamlandığında Yapılacaklar

#### APK Kontrolü:
```powershell
Test-Path "c:\Users\er-ef\Desktop\BusinessGoApp\android\app\build\outputs\apk\debug\app-debug.apk"
```

#### Manuel Install (gerekirse):
```powershell
adb install -r "c:\Users\er-ef\Desktop\BusinessGoApp\android\app\build\outputs\apk\debug\app-debug.apk"
```

#### Uygulamayı Başlatma:
```powershell
adb shell am start -n "com.businessgoapp/.MainActivity"
```

### 4. Build Başarısız Olursa

#### Cache Temizleme:
```powershell
cd "c:\Users\er-ef\Desktop\BusinessGoApp\android"
.\gradlew clean
```

#### Metro Cache Reset:
```powershell
npx react-native start --reset-cache
```

### 5. Emülatör Sorunları

#### Emülatör Durumu:
```powershell
adb devices
# Beklenen çıktı: emulator-5554   device
```

#### Emülatör Restart (gerekirse):
```powershell
adb -s emulator-5554 reboot
```

### 6. Uygulama Görünmüyorsa

#### Yüklü Paketleri Kontrol:
```powershell
adb shell pm list packages | findstr businessgoapp
```

#### Uygulama Logları:
```powershell
adb logcat | findstr "ReactNative\|BusinessGoApp"
```

### 7. Gelecekteki Deployment İçin

#### Hızlı Deployment Script:
```powershell
.\deploy-android-simple.ps1
```

#### VS Code Task:
`Ctrl+Shift+P` → "Tasks: Run Task" → "Android: Complete Deployment"

## Şu Anki Durum (2025-06-08)

✅ Emülatör aktif: emulator-5554
✅ JAVA_HOME ayarlandı: C:\Program Files\Android\Android Studio\jbr
⏳ Gradle build devam ediyor (normal süreç)
⏳ APK henüz oluşmadı (build devam ediyor)

## Sonraki Adımlar

1. Gradle build'in tamamlanmasını bekleyin
2. APK dosyasının oluştuğunu kontrol edin
3. Uygulama otomatik install edilecek
4. Metro bundler başlayacak
5. Uygulama emülatörde görünecek

Build süreci normal şartlarda 3-10 dakika arasında tamamlanır.
