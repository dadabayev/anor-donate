import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'src', 'shared', 'lib', 'i18n')
const stripBom = (s) => s.replace(/^\uFEFF/, '')

const locales = ['en', 'ru', 'uz']

for (const locale of locales) {
  const basePath = path.join(root, locale, 'translation.json')
  const restPath = path.join(root, locale, 'rest.fragment.json')
  if (!fs.existsSync(restPath)) {
    console.warn(`skip ${locale}: no rest.fragment.json`)
    continue
  }
  const base = JSON.parse(stripBom(fs.readFileSync(basePath, 'utf8')))
  const rest = JSON.parse(stripBom(fs.readFileSync(restPath, 'utf8')))
  Object.assign(base, rest)
  fs.writeFileSync(basePath, `${JSON.stringify(base, null, 2)}\n`)
}
