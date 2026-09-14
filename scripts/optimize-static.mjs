import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const PUBLIC_DIR = './public'

const TARGET_IMAGES = [
  { file: 'log-phila-mdt.png', output: 'log-phila-mdt.webp', maxWidth: 256, quality: 85 },
  { file: 'athoms&nadege.png', output: 'athoms&nadege.webp', maxWidth: 1200, quality: 80 },
  { file: 'rolland&viviane.png', output: 'rolland&viviane.webp', maxWidth: 1200, quality: 80 },
  { file: 'about-mdt -church.JPG', output: 'about-mdt-church.webp', maxWidth: 1200, quality: 80 },
  { file: 'club.JPG', output: 'club.webp', maxWidth: 1200, quality: 80 },
  { file: 'hospitalite-mdt.jpeg', output: 'hospitalite-mdt.webp', maxWidth: 1200, quality: 80 },
  { file: 'mdt-banner.jpg', output: 'mdt-banner.webp', maxWidth: 1920, quality: 82 },
  { file: 'about-mdt.jpg', output: 'about-mdt.webp', maxWidth: 800, quality: 80 },
  { file: 'aksanti-mungu-mdt.jpeg', output: 'aksanti-mungu-mdt.webp', maxWidth: 800, quality: 80 },
  { file: 'merci-mdt.jpeg', output: 'merci-mdt.webp', maxWidth: 800, quality: 80 },
]

async function run() {
  console.log('⚡ Optimisation des assets statiques locaux avec Sharp...')
  let totalSaved = 0

  for (const item of TARGET_IMAGES) {
    const inputPath = path.join(PUBLIC_DIR, item.file)
    if (!fs.existsSync(inputPath)) {
      console.warn(`[WARN] Fichier non trouvé : ${item.file}`)
      continue
    }

    const outputPath = path.join(PUBLIC_DIR, item.output)
    const beforeSize = fs.statSync(inputPath).size

    await sharp(inputPath)
      .resize({ width: item.maxWidth, withoutEnlargement: true })
      .webp({ quality: item.quality, effort: 6 })
      .toFile(outputPath)

    const afterSize = fs.statSync(outputPath).size
    const saved = beforeSize - afterSize
    totalSaved += saved

    console.log(
      `✓ ${item.file} (${(beforeSize / 1024).toFixed(1)} Ko) -> ${item.output} (${(afterSize / 1024).toFixed(1)} Ko) [-${((saved / beforeSize) * 100).toFixed(1)}%]`
    )
  }

  console.log(
    `\n🎉 Gain total d'espace économisé : ${(totalSaved / (1024 * 1024)).toFixed(2)} Mo !`
  )
}

run().catch((err) => {
  console.error('[Sharp Error]', err)
  process.exit(1)
})
