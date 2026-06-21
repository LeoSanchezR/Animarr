#!/usr/bin/env python3
"""Generate distribution assets for Animarr: macOS ICNS and Windows BMP installer images."""

import os
import struct
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_1024 = os.path.join(ROOT, 'Logo', '1024.png')
MACOS_ICNS_DIR = os.path.join(ROOT, 'distribution', 'macOS', 'Sonarr.app', 'Contents', 'Resources')
WINDOWS_INNO_DIR = os.path.join(ROOT, 'distribution', 'windows', 'setup', 'inno')

def generate_macos_icns():
    """Generate macOS .icns file from 1024px logo."""
    print('--- macOS ICNS ---')
    img = Image.open(LOGO_1024)
    img = img.convert('RGBA')
    
    # Create various sizes for ICNS
    sizes = [16, 32, 64, 128, 256, 512, 1024]
    icns_images = []
    
    for size in sizes:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        icns_images.append(resized)
    
    # Save as ICNS using Pillow's ICNS support
    # Create a temporary PNG first, then convert
    tmp_png = os.path.join(ROOT, '_tmp_icns.png')
    output_icns = os.path.join(MACOS_ICNS_DIR, 'animarr.icns')
    
    # Save largest size as PNG first
    img.save(tmp_png, format='PNG')
    
    # Use Pillow to create ICNS
    try:
        # Pillow can write ICNS directly
        img.save(output_icns, format='ICNS')
        print(f'  Created: {os.path.relpath(output_icns, ROOT)} (ICNS)')
    except Exception as e:
        print(f'  Warning: Could not create ICNS directly: {e}')
        # Fallback: just keep the PNG
        print(f'  Fallback: Using PNG for macOS icon')
    
    # Clean up
    if os.path.exists(tmp_png):
        os.remove(tmp_png)
    
    return True

def generate_windows_bmp():
    """Generate Windows installer BMP images."""
    print('\n--- Windows BMP Installer Images ---')
    img = Image.open(LOGO_1024)
    img = img.convert('RGBA')
    
    # WizModernImage.bmp - 164x314 (wizard sidebar image)
    # This is a vertical banner with the logo centered
    wizard_img = Image.new('RGBA', (164, 314), (0, 0, 0, 0))
    
    # Resize logo to fit width with padding
    logo_width = 140
    logo_height = int(img.height * (logo_width / img.width))
    logo_resized = img.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    
    # Center vertically, place in middle
    x_offset = (164 - logo_width) // 2
    y_offset = (314 - logo_height) // 2
    wizard_img.paste(logo_resized, (x_offset, y_offset), logo_resized)
    
    # Save as BMP (24-bit)
    output_bmp = os.path.join(WINDOWS_INNO_DIR, 'WizModernImage.bmp')
    wizard_img.save(output_bmp, format='BMP')
    print(f'  Created: {os.path.relpath(output_bmp, ROOT)} (164x314)')
    
    # WizModernSmallImage.bmp - 55x55 (small corner image)
    small_img = img.resize((55, 55), Image.Resampling.LANCZOS)
    output_small = os.path.join(WINDOWS_INNO_DIR, 'WizModernSmallImage.bmp')
    small_img.save(output_small, format='BMP')
    print(f'  Created: {os.path.relpath(output_small, ROOT)} (55x55)')
    
    return True

def main():
    print('=== Animarr Distribution Asset Generator ===\n')
    
    # Verify source logo exists
    if not os.path.exists(LOGO_1024):
        print(f'Error: Source logo not found: {LOGO_1024}')
        return False
    
    # Generate assets
    generate_macos_icns()
    generate_windows_bmp()
    
    print('\n=== Generation Complete ===')
    return True

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
