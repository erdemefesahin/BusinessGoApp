#!/usr/bin/env python3
"""
BusinessGo App Icon Generator
Creates custom app icons for Android in all required densities
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_business_icon(size):
    """Create a BusinessGo app icon of the specified size"""
    
    # Create a new image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define colors (BusinessGo theme)
    bg_color = '#2E7D32'  # Professional green
    accent_color = '#4CAF50'  # Lighter green
    text_color = '#FFFFFF'  # White text
    
    # Draw background circle with gradient effect
    padding = size // 20
    circle_size = size - (padding * 2)
    
    # Main background circle
    draw.ellipse([padding, padding, size - padding, size - padding], 
                fill=bg_color, outline=accent_color, width=max(1, size // 50))
    
    # Inner accent circle for depth
    inner_padding = size // 8
    draw.ellipse([inner_padding, inner_padding, size - inner_padding, size - inner_padding], 
                fill=accent_color, outline=None)
    
    # Final main circle
    main_padding = size // 6
    draw.ellipse([main_padding, main_padding, size - main_padding, size - main_padding], 
                fill=bg_color, outline=None)
    
    # Try to load a font, fall back to default if not available
    try:
        # Try to use a bold font
        font_size = size // 3
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.load_default()
        except:
            font = None
    
    # Draw "BG" text in the center
    text = "BG"
    if font:
        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the text
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - (size // 20)  # Slight upward adjustment
        
        # Draw text with slight shadow for depth
        shadow_offset = max(1, size // 100)
        draw.text((x + shadow_offset, y + shadow_offset), text, 
                 fill=(0, 0, 0, 100), font=font)  # Shadow
        draw.text((x, y), text, fill=text_color, font=font)  # Main text
    else:
        # Fallback: draw simple shapes if font fails
        center = size // 2
        rect_size = size // 4
        draw.rectangle([center - rect_size, center - rect_size//2, 
                       center + rect_size, center + rect_size//2], 
                      fill=text_color)
    
    # Add a subtle highlight for iOS-style depth
    highlight_size = size // 3
    highlight_y = size // 4
    draw.ellipse([size//2 - highlight_size//2, highlight_y, 
                 size//2 + highlight_size//2, highlight_y + highlight_size//3], 
                fill=(255, 255, 255, 30))
    
    return img

def create_round_icon(size):
    """Create a round version of the icon"""
    # Create the base icon
    icon = create_business_icon(size)
    
    # Create a circular mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size, size], fill=255)
    
    # Apply the mask to make it perfectly round
    icon.putalpha(mask)
    
    return icon

def main():
    """Generate all required Android app icons"""
    
    # Define Android icon sizes
    sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }
    
    # Base path for Android resources
    base_path = os.path.join(os.path.dirname(__file__), 'android', 'app', 'src', 'main', 'res')
    
    print("🎨 Creating BusinessGo App Icons...")
    
    for folder, size in sizes.items():
        folder_path = os.path.join(base_path, folder)
        
        # Create regular icon
        icon = create_business_icon(size)
        icon_path = os.path.join(folder_path, 'ic_launcher.png')
        icon.save(icon_path, 'PNG')
        print(f"✅ Created {folder}/ic_launcher.png ({size}x{size})")
        
        # Create round icon
        round_icon = create_round_icon(size)
        round_icon_path = os.path.join(folder_path, 'ic_launcher_round.png')
        round_icon.save(round_icon_path, 'PNG')
        print(f"✅ Created {folder}/ic_launcher_round.png ({size}x{size})")
    
    # Also create a large version for reference
    large_icon = create_business_icon(512)
    large_icon.save('businessgo_icon_512.png', 'PNG')
    print("✅ Created businessgo_icon_512.png (reference)")
    
    print("\n🚀 All BusinessGo app icons created successfully!")
    print("📱 Your app will now show with a custom icon in the Android launcher.")
    print("\n📝 Next steps:")
    print("1. Build and deploy the app to see the new icon")
    print("2. The icon features 'BG' monogram on a professional green background")
    print("3. Icons are optimized for all Android screen densities")

if __name__ == "__main__":
    main()
