# 🍽️ RestaurantGO - Android Simge Manuel Güncelleme

## 🎯 Hızlı Çözüm (5 dakika)

### 1. Online Simge Oluşturucu Kullan

**İKON KİTCHEN (Önerilen):**
1. https://icon.kitchen adresine git
2. "Text to Icon" seçeneğini seç
3. **Ayarlar**:
   - **Text**: "🍽️" veya "R" 
   - **Background**: "Gradient" seç
   - **Colors**: #ff6b6b (sol) → #ff8e53 (sağ)
   - **Shape**: "Circle" veya "RoundedRect"
   - **Style**: "Material Design"

4. **"Generate Icon Pack"** butonuna tıkla
5. **"Download Android"** seçeneğini seç
6. ZIP dosyasını indir

### 2. Dosyaları Kopyala

İndirdiğin ZIP dosyasını aç ve şu klasörlere kopyala:

```
ZIP içindeki dosyalar → Hedef klasörler:

mipmap-mdpi/ic_launcher.png → 
c:\Users\er-ef\Desktop\BusinessGoApp\android\app\src\main\res\mipmap-mdpi\ic_launcher.png

mipmap-hdpi/ic_launcher.png →
c:\Users\er-ef\Desktop\BusinessGoApp\android\app\src\main\res\mipmap-hdpi\ic_launcher.png

mipmap-xhdpi/ic_launcher.png →
c:\Users\er-ef\Desktop\BusinessGoApp\android\app\src\main\res\mipmap-xhdpi\ic_launcher.png

mipmap-xxhdpi/ic_launcher.png →
c:\Users\er-ef\Desktop\BusinessGoApp\android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png

mipmap-xxxhdpi/ic_launcher.png →
c:\Users\er-ef\Desktop\BusinessGoApp\android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png
```

**Aynı şekilde ic_launcher_round.png dosyaları için de tekrarla**

### 3. Uygulamayı Yeniden Derle

Bu adımları PowerShell'de çalıştır:

```powershell
# Android projesini temizle
cd c:\Users\er-ef\Desktop\BusinessGoApp
.\android-dev.ps1 clean

# Uygulamayı yeniden derle ve çalıştır
.\android-dev.ps1 run
```

### 4. Alternatif Online Araçlar

**Diğer seçenekler:**
- **AppIcon.co**: https://appicon.co
- **MakeAppIcon**: https://makeappicon.com
- **IconKitchen**: https://icon.kitchen

## 🎨 Tasarım Önerileri

### Emoji Seçenekleri:
- 🍽️ (Tabak + Çatal-Kaşık) ← **En uygun**
- 🍕 (Pizza)
- 🍴 (Çatal-Kaşık)
- 🥘 (Yemek Tenceresi)

### Renk Paleti:
- **Primary**: #ff6b6b (Coral Red)
- **Secondary**: #ff8e53 (Orange)
- **Style**: Gradient, yuvarlak köşeler

## ⚡ Süper Hızlı Test

Simge değişikliğini hemen görmek için:

1. **Simgeyi oluştur** (2 dakika)
2. **Dosyaları kopyala** (1 dakika)
3. **Uygulamayı derle** (2 dakika)
4. **Android emulatöründe kontrol et**

Toplam süre: **5 dakika**

## 📱 Sonuç

Bu adımları tamamladıktan sonra Android ana ekranında RestaurantGO uygulaması artık:
- ✅ Restoran temalı simge ile görünecek
- ✅ "RestaurantGO" adıyla görünecek
- ✅ Gradient renkli, modern tasarım
