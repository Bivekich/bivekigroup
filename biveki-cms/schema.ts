import {type SchemaTypeDefinition} from 'sanity'
import post from './schemaTypes/post'
import author from './schemaTypes/author'
import category from './schemaTypes/category'
import blockContent from './schemaTypes/blockContent'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [post, author, category, blockContent],
}
