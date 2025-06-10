# RestaurantGO - Uygulama Simgesi Güncelleme Rehberi

## Mevcut Durum
Giriş ekranındaki animasyonlu logo kaldırıldı, şimdi telefondaki uygulama simgesi güncellenmesi gerekiyor.

## Restoran Temalı Uygulama Simgesi Önerileri

### 1. Tasarım Konsepti
- **Ana Simge**: 🍽️ (Tabak ve çatal-kaşık)
- **Renk Paleti**: 
  - Turuncu-kırmızı gradient (#ff6b6b to #ff8e53)
  - Beyaz accent
  - Koyu gölge efektleri

### 2. Android İkon Boyutları
- **mdpi**: 48x48px
- **hdpi**: 72x72px  
- **xhdpi**: 96x96px
- **xxhdpi**: 144x144px
- **xxxhdpi**: 192x192px

### 3. iOS İkon Boyutları
- **20x20@2x**: 40x40px
- **20x20@3x**: 60x60px
- **29x29@2x**: 58x58px
- **29x29@3x**: 87x87px
- **40x40@2x**: 80x80px
- **40x40@3x**: 120x120px
- **60x60@2x**: 120x120px
- **60x60@3x**: 180x180px

### 4. Önerilen Çözümler

#### Seçenek A: Emoji Tabanlı Basit Logo
```
🍽️ RestaurantGO simgesi
- Gradient arka plan
- Beyaz emoji
- Rounded corners
```

#### Seçenek B: Grafik Tasarım
```
R harfi + çatal-kaşık kombinasyonu
- Modern tipografi
- Restoran teması
- Gradient renkler
```

### 5. Uygulama Adımları

1. **Logo Tasarımı**: Photoshop/Figma ile tasarım
2. **Boyutlandırma**: Tüm platform boyutları için export
3. **Android Güncelleme**: 
   - `android/app/src/main/res/mipmap-*/` klasörlerindeki dosyaları değiştir
4. **iOS Güncelleme**:
   - `ios/BusinessGoApp/Images.xcassets/AppIcon.appiconset/` güncelle
5. **Rebuild**: Uygulamayı yeniden derle

### 6. Hızlı Çözüm - React Native Asset Generator

```bash
# Online araç kullanarak logo oluştur:
# https://icon.kitchen
# https://appicon.co

# Veya CLI araç:
npm install -g react-native-make
react-native-make set-icon --path ./logo.png
```

## Sonraki Adımlar

1. Logo tasarımı yapılması
2. Tüm boyutlarda export edilmesi  
3. Platform dosyalarının güncellenmesi
4. Uygulamanın yeniden derlenmesi

Bu işlem tamamlandığında telefonda RestaurantGO uygulaması restoran temasına uygun simge ile görünecek.
