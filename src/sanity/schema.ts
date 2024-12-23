import { type SchemaTypeDefinition } from 'sanity';
import post from './schemaTypes/post';
import project from './schemaTypes/project';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, project],
};
