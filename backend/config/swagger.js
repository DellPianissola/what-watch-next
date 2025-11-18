import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega o arquivo OpenAPI YAML
const openApiPath = path.join(__dirname, '../docs/openapi.yaml')
const openApiFile = fs.readFileSync(openApiPath, 'utf8')
const swaggerSpec = yaml.load(openApiFile)

export default swaggerSpec

