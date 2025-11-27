import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = __dirname
const dist = path.join(root, 'dist')

const assets = [
  '_metadata',
  'favicon',
  'fonts',
  'images',
  'locales',
  'scripts',
  'svgs',
  'style.css',
  'manifest.json',
  'index.html'
]

async function main() {
  await rm(dist, { recursive: true, force: true })
  await mkdir(dist, { recursive: true })

  for (const item of assets) {
    const source = path.join(root, item)
    const target = path.join(dist, item)
    await cp(source, target, { recursive: true })
  }
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
