// Android / iOS アプリ用アイコン・スプラッシュの元画像を作る。
// public/icons/icon-source.svg から assets/*.png を生成し、
// 続けて `npx capacitor-assets generate` で各サイズに展開する。
//   使い方: npm run generate:native-assets
import { readFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const SPLASH_BG = '#0f0d2e'
const svg = await readFile('public/icons/icon-source.svg', 'utf8')
// icon-source.svg は <g id="bg">（背景）と <g id="fg">（文字）に分かれている。
// Android のアダプティブアイコンは前景と背景を別々の画像で用意する。
const foregroundSvg = svg.replace(/<g id="bg">[\s\S]*?<\/g>/, '')
const backgroundSvg = svg.replace(/<g id="fg">[\s\S]*<\/g>\s*(?=<\/svg>)/, '')

await mkdir('assets', { recursive: true })

const png = (input, size) => sharp(Buffer.from(input)).resize(size, size).png().toBuffer()

await sharp(await png(svg, 1024)).toFile('assets/icon-only.png')
// アダプティブアイコンは中央 66% が安全領域なので、前景を縮めて余白をとる
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: await png(foregroundSvg, 820), gravity: 'center' }])
  .png()
  .toFile('assets/icon-foreground.png')
await sharp(await png(backgroundSvg, 1024)).toFile('assets/icon-background.png')

for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: SPLASH_BG } })
    .composite([{ input: await png(foregroundSvg, 640), gravity: 'center' }])
    .png()
    .toFile(`assets/${name}`)
}
console.log('assets/ に元画像を生成しました')
