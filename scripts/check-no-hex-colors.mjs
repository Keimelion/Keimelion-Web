import { globSync, readFileSync } from 'node:fs'

const TOKENS_FILE = 'src/styles/tokens.css'
const HEX_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b/

const offendingFiles = globSync('src/**/*.css').filter(
  (file) => file !== TOKENS_FILE && HEX_COLOR_PATTERN.test(readFileSync(file, 'utf8')),
)

if (offendingFiles.length > 0) {
  console.error(`Hex colours found outside ${TOKENS_FILE}, use a design token instead:`)
  offendingFiles.forEach((file) => console.error(`  ${file}`))
  process.exit(1)
}
