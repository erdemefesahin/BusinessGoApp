# 🍽️ RestaurantGO - Hızlı Uygulama Simgesi Güncelleme Rehberi

## ✅ Tamamlanan İşlemler
- Uygulama adı "RestaurantGO" olarak güncellendi
- Android: strings.xml dosyası güncellendi
- iOS: Info.plist dosyası güncellendi

## 📱 Uygulama Simgesi Değiştirme (Hızlı Çözüm)

### 1. Online Simge Oluşturucu (Önerilen)

**En Hızlı Yöntem:**
1. **Icon.Kitchen'e gidin**: https://icon.kitchen
2. **"Text to Icon"** seçeneğini kullanın
3. **Ayarlar**:
   - Text: "R" veya "🍽️"
   - Background: Gradient (#ff6b6b to #ff8e53)
   - Style: Material Design
   - Shape: Circle/RoundedRect

### 2. Alternatif Online Araçlar
- **AppIcon.co**: https://appicon.co
- **MakeAppIcon**: https://makeappicon.com
- **IconKitchen**: https://icon.kitchen

### 3. Restoran Temalı Tasarım Önerileri

#### Seçenek A: Emoji Tabanlı
```
🍽️ - Tabak ve çatal-kaşık (En uygun)
🍕 - Pizza dilimi
🍴 - Çatal-kaşık
🥘 - Yemek tenceresi
🧑‍🍳 - Şef
```

#### Seçenek B: Text Tabanlı
```
"R" harfi + Gradient arka plan
"RGO" kısaltması
"🍽️R" kombinasyonu
```

### 4. Renk Paleti (Mevcut tema ile uyumlu)
```
Primary: #ff6b6b (Coral Red)
Secondary: #ff8e53 (Orange)
Accent: #ffffff (White)
Shadow: rgba(0,0,0,0.3)
```

### 5. Gerekli Boyutlar

#### Android (ic_launcher.png dosyaları)
```
mdpi: 48x48px
hdpi: 72x72px
xhdpi: 96x96px
xxhdpi: 144x144px
xxxhdpi: 192x192px
```

#### iOS (AppIcon.appiconset)
```
20x20@2x: 40x40px
20x20@3x: 60x60px
29x29@2x: 58x58px
29x29@3x: 87x87px
40x40@2x: 80x80px
40x40@3x: 120x120px
60x60@2x: 120x120px
60x60@3x: 180x180px
```

## 🚀 Uygulama Adımları

### Manuel Güncelleme:
1. **Simge Tasarla**: Yukarıdaki araçları kullan
2. **Tüm boyutları indir**: ZIP dosyası olarak
3. **Android dosyalarını kopyala**:
   ```
   android/app/src/main/res/mipmap-mdpi/ic_launcher.png
   android/app/src/main/res/mipmap-hdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
   android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
   ```
4. **iOS dosyalarını kopyala**:
   ```
   ios/BusinessGoApp/Images.xcassets/AppIcon.appiconset/
   ```
5. **Uygulamayı yeniden derle**:
   ```bash
   npx react-native run-android
   ```

### Otomatik CLI Yöntemi:
```bash
# React Native Make yükle
npm install -g react-native-make

# Logo dosyanız varsa
npx react-native-make set-icon --path ./restaurant-logo.png
```

## 📱 Şu Anki Durum

✅ **Uygulama Adı**: "RestaurantGO" (Güncellendi)
❌ **Uygulama Simgesi**: Hala varsayılan (Manuel güncelleme gerekli)

## 🎯 Hızlı Test

Uygulama adı değişikliğini görmek için:
```bash
# Android emulatöründe test
npx react-native run-android
```

Uygulama artık telefonda "RestaurantGO" adıyla görünecek!

## 💡 Pro İpucu

En hızlı çözüm için:
1. Icon.Kitchen'de 🍽️ emoji ile simge oluşturun
2. Gradient arka plan (#ff6b6b to #ff8e53) ekleyin
3. Tüm boyutları indirin
4. Dosyaları Android klasörlerine kopyalayın
5. Uygulamayı yeniden derleyin

Bu yaklaşık 5-10 dakika sürer ve profesyonel görünümlü restoran temalı simge elde edersiniz!
