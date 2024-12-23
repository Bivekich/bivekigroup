import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schema} from './schema'

export default defineConfig({
  name: 'default',
  title: 'Biveki CMS',

  projectId: '5eulp3wj',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schema.types,
  },
})
