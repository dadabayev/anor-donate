import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'src', 'shared', 'lib', 'i18n')

const locales = ['en', 'ru', 'uz']

for (const locale of locales) {
  const basePath = path.join(root, locale, 'translation.json')
  const authPath = path.join(root, locale, 'auth.fragment.json')
  const stripBom = (s) => s.replace(/^\uFEFF/, '')
  const base = JSON.parse(stripBom(fs.readFileSync(basePath, 'utf8')))
  const auth = JSON.parse(stripBom(fs.readFileSync(authPath, 'utf8')))
  base.auth = auth
  fs.writeFileSync(basePath, `${JSON.stringify(base, null, 2)}\n`)
}
