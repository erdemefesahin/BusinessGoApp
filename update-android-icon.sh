#!/bin/bash

# RestaurantGO Icon Update Script
echo "🍽️ RestaurantGO Android Icon Update"
echo "=================================="

# Step 1: Online Icon Generator
echo ""
echo "📱 STEP 1: Create Icon Online"
echo "1. Open: https://icon.kitchen"
echo "2. Select 'Text to Icon'"
echo "3. Enter text: 🍽️"
echo "4. Set background: Gradient #ff6b6b to #ff8e53"
echo "5. Select shape: Circle or Rounded Rectangle"
echo "6. Click 'Generate Icon Pack'"
echo "7. Download 'Android' package"
echo ""

# Wait for user confirmation
read -p "Press Enter after downloading the icon pack..."

# Step 2: Extract and copy files
echo ""
echo "📁 STEP 2: Copy Icon Files"
echo "Extract the downloaded ZIP file and copy these files:"
echo ""
echo "FROM → TO:"
echo "mipmap-mdpi/ic_launcher.png → android/app/src/main/res/mipmap-mdpi/"
echo "mipmap-hdpi/ic_launcher.png → android/app/src/main/res/mipmap-hdpi/"
echo "mipmap-xhdpi/ic_launcher.png → android/app/src/main/res/mipmap-xhdpi/"
echo "mipmap-xxhdpi/ic_launcher.png → android/app/src/main/res/mipmap-xxhdpi/"
echo "mipmap-xxxhdpi/ic_launcher.png → android/app/src/main/res/mipmap-xxxhdpi/"
echo ""
echo "Also copy ic_launcher_round.png files to the same folders"
echo ""

read -p "Press Enter after copying all files..."

# Step 3: Clean and rebuild
echo ""
echo "🧹 STEP 3: Clean and Rebuild"
echo "Cleaning Android project..."

# Navigate to project directory
cd android

# Clean project
./gradlew clean

echo "✅ Project cleaned!"
echo ""
echo "🚀 STEP 4: Run Application"
echo "Execute: npx react-native run-android"
echo ""
echo "📱 Your RestaurantGO app will now have a restaurant-themed icon!"
