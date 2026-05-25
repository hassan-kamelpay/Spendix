/**
 * Spendix PWA Icon Generator
 * Run:  node scripts/generate-icons.mjs
 * Requires:  npm install sharp  (already in devDependencies)
 */

import sharp from 'sharp'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')
const ICONS_DIR = resolve(ROOT, 'public/icons')
const SVG_PATH  = resolve(ICONS_DIR, 'icon.svg')

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

if (!existsSync(ICONS_DIR)) mkdirSync(ICONS_DIR, { recursive: true })

const svgBuffer = readFileSync(SVG_PATH)
console.log('🎨  Generating PWA icons from icon.svg …\n')

for (const size of SIZES) {
  const out = resolve(ICONS_DIR, `icon-${size}x${size}.png`)
  await sharp(svgBuffer)
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(out)
  console.log(`  ✓  icon-${size}x${size}.png`)
}

// Also create a favicon
await sharp(svgBuffer).resize(32, 32).png().toFile(resolve(ROOT, 'public/favicon.ico'))
console.log('  ✓  favicon.ico')

console.log('\n✅  All icons generated successfully!')
console.log('   You can now commit the public/icons/ folder.\n')
