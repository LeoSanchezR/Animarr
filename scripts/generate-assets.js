const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SVG_SOURCE = path.join(ROOT, 'frontend', 'src', 'Content', 'Images', 'logo.svg');
const LOGO_DIR = path.join(ROOT, 'Logo');
const ICONS_DIR = path.join(ROOT, 'frontend', 'src', 'Content', 'Images', 'Icons');
const BACKEND_DIR = path.join(ROOT, 'src', 'NzbDrone.Host');

const svgBuffer = fs.readFileSync(SVG_SOURCE);

// Animarr monochrome SVG for safari pinned tab (silhouette)
const safariSvg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="700.000000pt" height="700.000000pt" viewBox="0 0 700.000000 700.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,700.000000) scale(0.100000,-0.100000)"
 fill="#000000" stroke="none">
<path d="M1225 6163 c-49 -42 -116 -103 -149 -134 l-61 -58 455 -455 454 -456
31 30 31 30 274 -275 275 -275 -78 -77 -77 -78 -275 275 -275 274 27 28 27 29
-454 455 -455 455 -48 -53 c-27 -29 -83 -93 -124 -141 l-76 -89 375 -376 c206
-208 393 -399 415 -427 270 -335 393 -768 393 -1386 0 -608 -102 -1000 -351
-1342 -29 -40 -217 -237 -418 -439 -353 -356 -364 -368 -352 -392 15 -26 229
-256 239 -256 4 0 202 198 441 441 l434 440 -26 26 -26 27 152 158 c84 87 204
212 267 278 l115 120 80 -75 79 -75 -105 -107 c-57 -60 -178 -184 -267 -277
l-163 -169 -30 29 -30 28 -442 -442 -442 -442 50 -51 c28 -28 96 -89 153 -136
l104 -85 366 364 c240 238 398 387 457 430 233 170 435 251 750 300 127 20
178 22 560 23 438 0 531 -6 724 -47 238 -50 453 -157 671 -332 41 -33 227
-211 412 -395 l338 -334 52 43 c97 81 218 194 216 202 -2 4 -203 214 -448 467
l-444 461 -28 -27 -27 -26 -108 101 c-59 55 -189 182 -287 280 l-179 180 74
81 74 81 287 -287 288 -288 -28 -27 -27 -28 74 -77 c41 -43 244 -253 450 -467
l376 -388 64 68 c35 38 97 107 138 153 l74 84 -363 366 c-387 390 -449 463
-547 651 -177 341 -243 757 -220 1385 15 409 51 583 167 810 85 164 172 265
599 696 222 223 403 408 403 412 0 9 -191 235 -228 271 l-31 29 -378 -368
c-208 -203 -412 -401 -453 -441 l-74 -73 28 -30 29 -30 -271 -273 -271 -273
-78 78 -78 77 272 272 272 272 29 -27 28 -27 456 442 455 443 -81 76 c-45 42
-108 99 -141 127 l-60 51 -335 -332 c-376 -374 -425 -418 -563 -510 -337 -226
-739 -327 -1297 -327 -628 0 -1068 131 -1422 422 -35 28 -223 211 -419 405
l-356 354 -88 -78z m2391 -1707 c162 -13 359 -96 495 -210 149 -124 273 -315
320 -491 32 -120 37 -330 11 -455 -38 -183 -123 -340 -261 -479 -191 -194
-405 -282 -681 -282 -234 0 -413 59 -589 196 -316 243 -444 624 -35 1024 65
264 297 525 564 634 47 19 108 40 137 47 57 13 214 28 253 24 14 -2 57 -5 96
-8z"/>
</g>
</svg>`;

// White outline SVG variant
const whiteOutlineSvg = `<svg height="216.9" viewBox="0 0 216.7 216.9" width="216.7" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="animarrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D946EF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A855F7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path clip-rule="evenodd" d="M216.7 108.45c0 29.833-10.533 55.4-31.6 76.7-.7.833-1.483 1.6-2.35 2.3-3.466 3.4-7.133 6.484-11 9.25-18.267 13.467-39.367 20.2-63.3 20.2-23.967 0-45.033-6.733-63.2-20.2-4.8-3.4-9.3-7.25-13.5-11.55-16.367-16.266-26.417-35.167-30.15-56.7-.733-4.2-1.217-8.467-1.45-12.8-.1-2.4-.15-4.8-.15-7.2 0-2.533.05-4.95.15-7.25 0-.233.066-.467.2-.7 1.567-26.6 12.033-49.583 31.4-68.95C53.05 10.517 78.617 0 108.45 0c29.933 0 55.484 10.517 76.65 31.55 21.067 21.433 31.6 47.067 31.6 76.9z" fill="none" stroke="#FFFFFF" stroke-width="8" fill-rule="evenodd"/>
  <path clip-rule="evenodd" d="M194.65 42.5l-22.4 22.4C159.152 77.998 158 89.4 158 109.5c0 17.934 2.852 34.352 16.2 47.7 9.746 9.746 19 18.95 19 18.95-2.5 3.067-5.2 6.067-8.1 9-.7.833-1.483 1.6-2.35 2.3-2.533 2.5-5.167 4.817-7.9 6.95l-17.55-17.55c-15.598-15.6-27.996-17.1-48.6-17.1-19.77 0-33.223 1.822-47.7 16.3-8.647 8.647-18.55 18.6-18.55 18.6-3.767-2.867-7.333-6.034-10.7-9.5-2.8-2.8-5.417-5.667-7.85-8.6 0 0 9.798-9.848 19.15-19.2 13.852-13.853 16.1-29.916 16.1-47.85 0-17.5-2.874-33.823-15.6-46.55-8.835-8.836-21.05-21-21.05-21 2.833-3.6 5.917-7.067 9.25-10.4 2.934-2.867 5.934-5.55 9-8.05L61.1 43.85C74.102 56.852 90.767 60.2 108.7 60.2c18.467 0 35.077-3.577 48.6-17.1 8.32-8.32 19.3-19.25 19.3-19.25 2.9 2.367 5.733 4.933 8.5 7.7 3.467 3.533 6.65 7.183 9.55 10.95z" fill="none" stroke="#FFFFFF" stroke-width="5" fill-rule="evenodd"/>
  <g clip-rule="evenodd">
    <path d="M78.7 114c-.2-1.167-.332-2.35-.4-3.55-.032-.667-.05-1.333-.05-2 0-.7.018-1.367.05-2 0-.067.018-.133.05-.2.435-7.367 3.334-13.733 8.7-19.1 5.9-5.833 12.984-8.75 21.25-8.75 8.3 0 15.384 2.917 21.25 8.75 5.834 5.934 8.75 13.033 8.75 21.3 0 8.267-2.916 15.35-8.75 21.25-.2.233-.416.45-.65.65-.966.933-1.982 1.783-3.05 2.55-5.065 3.733-10.916 5.6-17.55 5.6s-12.466-1.866-17.5-5.6c-1.332-.934-2.582-2-3.75-3.2-4.532-4.5-7.316-9.734-8.35-15.7z" fill="#FFFFFF" fill-rule="evenodd"/>
    <path d="M157.8 59.75l-15 14.65M30.785 32.526L71.65 73.25m84.6 84.25l27.808 28.78m1.855-153.894L157.8 59.75m-125.45 126l27.35-27.4" fill="none" stroke="#FFFFFF" stroke-miterlimit="1" stroke-width="2"/>
    <path d="M157.8 59.75l-16.95 17.2M58.97 60.604l17.2 17.15M59.623 158.43l16.75-17.4m61.928-1.396l18.028 17.945" fill="none" stroke="#FFFFFF" stroke-miterlimit="1" stroke-width="7"/>
  </g>
</svg>`;

// Simplified single-color SVG for small sizes
const simpleSvg = `<svg height="216.9" viewBox="0 0 216.7 216.9" width="216.7" xmlns="http://www.w3.org/2000/svg">
  <path clip-rule="evenodd" d="M216.7 108.45c0 29.833-10.533 55.4-31.6 76.7-.7.833-1.483 1.6-2.35 2.3-3.466 3.4-7.133 6.484-11 9.25-18.267 13.467-39.367 20.2-63.3 20.2-23.967 0-45.033-6.733-63.2-20.2-4.8-3.4-9.3-7.25-13.5-11.55-16.367-16.266-26.417-35.167-30.15-56.7-.733-4.2-1.217-8.467-1.45-12.8-.1-2.4-.15-4.8-.15-7.2 0-2.533.05-4.95.15-7.25 0-.233.066-.467.2-.7 1.567-26.6 12.033-49.583 31.4-68.95C53.05 10.517 78.617 0 108.45 0c29.933 0 55.484 10.517 76.65 31.55 21.067 21.433 31.6 47.067 31.6 76.9z" fill="#D946EF" fill-rule="evenodd"/>
  <path clip-rule="evenodd" d="M194.65 42.5l-22.4 22.4C159.152 77.998 158 89.4 158 109.5c0 17.934 2.852 34.352 16.2 47.7 9.746 9.746 19 18.95 19 18.95-2.5 3.067-5.2 6.067-8.1 9-.7.833-1.483 1.6-2.35 2.3-2.533 2.5-5.167 4.817-7.9 6.95l-17.55-17.55c-15.598-15.6-27.996-17.1-48.6-17.1-19.77 0-33.223 1.822-47.7 16.3-8.647 8.647-18.55 18.6-18.55 18.6-3.767-2.867-7.333-6.034-10.7-9.5-2.8-2.8-5.417-5.667-7.85-8.6 0 0 9.798-9.848 19.15-19.2 13.852-13.853 16.1-29.916 16.1-47.85 0-17.5-2.874-33.823-15.6-46.55-8.835-8.836-21.05-21-21.05-21 2.833-3.6 5.917-7.067 9.25-10.4 2.934-2.867 5.934-5.55 9-8.05L61.1 43.85C74.102 56.852 90.767 60.2 108.7 60.2c18.467 0 35.077-3.577 48.6-17.1 8.32-8.32 19.3-19.25 19.3-19.25 2.9 2.367 5.733 4.933 8.5 7.7 3.467 3.533 6.65 7.183 9.55 10.95z" fill="#18181B" fill-rule="evenodd"/>
  <g clip-rule="evenodd">
    <path d="M78.7 114c-.2-1.167-.332-2.35-.4-3.55-.032-.667-.05-1.333-.05-2 0-.7.018-1.367.05-2 0-.067.018-.133.05-.2.435-7.367 3.334-13.733 8.7-19.1 5.9-5.833 12.984-8.75 21.25-8.75 8.3 0 15.384 2.917 21.25 8.75 5.834 5.934 8.75 13.033 8.75 21.3 0 8.267-2.916 15.35-8.75 21.25-.2.233-.416.45-.65.65-.966.933-1.982 1.783-3.05 2.55-5.065 3.733-10.916 5.6-17.55 5.6s-12.466-1.866-17.5-5.6c-1.332-.934-2.582-2-3.75-3.2-4.532-4.5-7.316-9.734-8.35-15.7z" fill="#EC4899" fill-rule="evenodd"/>
    <path d="M157.8 59.75l-15 14.65M30.785 32.526L71.65 73.25m84.6 84.25l27.808 28.78m1.855-153.894L157.8 59.75m-125.45 126l27.35-27.4" fill="none" stroke="#EC4899" stroke-miterlimit="1" stroke-width="2"/>
    <path d="M157.8 59.75l-16.95 17.2M58.97 60.604l17.2 17.15M59.623 158.43l16.75-17.4m61.928-1.396l18.028 17.945" fill="none" stroke="#EC4899" stroke-miterlimit="1" stroke-width="7"/>
  </g>
</svg>`;

async function generatePng(buffer, size, outputPath) {
  await sharp(buffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outputPath);
  console.log(`  Created: ${path.relative(ROOT, outputPath)} (${size}x${size})`);
}

async function generateIco(pngBuffers, outputPath) {
  // Sharp can create ICO from multiple PNG buffers
  const composed = sharp(pngBuffers[0]);
  // For ICO, we use the largest size and let the ICO container hold multiple sizes
  // Sharp's ICO support is limited, so we create a simple single-size ICO
  await composed
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
    .then(async (buf) => {
      // Create ICO manually using Pillow via child_process
      const { execSync } = require('child_process');
      const tmpPng = path.join(ROOT, '_tmp_ico.png');
      await sharp(buf).png().toFile(tmpPng);
      const icoScript = `from PIL import Image
img = Image.open("${tmpPng.replace(/\\/g, '\\\\')}")
img.save("${outputPath.replace(/\\/g, '\\\\')}", format='ICO', sizes=[(16,16),(32,32),(48,48),(256,256)])`;
      const tmpPy = path.join(ROOT, '_tmp_ico.py');
      fs.writeFileSync(tmpPy, icoScript);
      try {
        execSync(`python "${tmpPy}"`, { stdio: 'pipe' });
      } finally {
        try { fs.unlinkSync(tmpPy); } catch {}
        try { fs.unlinkSync(tmpPng); } catch {}
      }
    });
  console.log(`  Created: ${path.relative(ROOT, outputPath)} (ICO)`);
}

async function main() {
  console.log('=== Animarr Asset Generator ===\n');

  // Group 1: Logo PNGs
  console.log('--- Logo PNGs ---');
  const logoPngSizes = [1024, 800, 512, 400, 256, 128, 72, 64, 48, 32, 16];
  for (const size of logoPngSizes) {
    const name = size === 96 ? '96-Outline-White' : String(size);
    const outputPath = path.join(LOGO_DIR, `${name}.png`);
    if (size === 96) {
      // White outline variant
      const outlineBuffer = Buffer.from(whiteOutlineSvg);
      await generatePng(outlineBuffer, 96, outputPath);
    } else {
      await generatePng(svgBuffer, size, outputPath);
    }
  }

  // Group 2: Logo SVGs
  console.log('\n--- Logo SVGs ---');
  fs.writeFileSync(path.join(LOGO_DIR, 'Animarr.svg'), svgBuffer);
  console.log('  Created: Logo/Animarr.svg (full gradient)');
  fs.writeFileSync(path.join(LOGO_DIR, 'animarr-simple.svg'), simpleSvg);
  console.log('  Created: Logo/animarr-simple.svg (simplified)');

  // Group 3: Favicon PNGs
  console.log('\n--- Favicon PNGs ---');
  const faviconPngs = [
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-debug-32x32.png', size: 32 },
    { name: 'favicon-debug-16x16.png', size: 16 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'mstile-70x70.png', size: 70 },
    { name: 'mstile-144x144.png', size: 144 },
    { name: 'mstile-150x150.png', size: 150 },
    { name: 'mstile-310x310.png', size: 310 },
  ];
  for (const { name, size } of faviconPngs) {
    await generatePng(svgBuffer, size, path.join(ICONS_DIR, name));
  }

  // Wide mstile (310x150)
  const wideBuffer = await sharp(svgBuffer)
    .resize(310, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp(wideBuffer).toFile(path.join(ICONS_DIR, 'mstile-310x150.png'));
  console.log('  Created: Icons/mstile-310x150.png (310x150)');

  // Safari pinned tab SVG
  fs.writeFileSync(path.join(ICONS_DIR, 'safari-pinned-tab.svg'), safariSvg);
  console.log('  Created: Icons/safari-pinned-tab.svg (monochrome)');

  // Group 4: ICO files
  console.log('\n--- ICO Files ---');
  await generateIco([svgBuffer], path.join(ICONS_DIR, 'favicon.ico'));
  await generateIco([svgBuffer], path.join(ICONS_DIR, 'favicon-debug.ico'));

  // Group 5: Backend ICO
  console.log('\n--- Backend ICO ---');
  await generateIco([svgBuffer], path.join(BACKEND_DIR, 'Animarr.ico'));

  console.log('\n=== Generation Complete ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
