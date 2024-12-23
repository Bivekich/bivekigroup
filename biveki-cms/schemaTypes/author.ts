import {Rule} from '@sanity/types'

const author = {
  name: 'author',
  title: 'Авторы',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Имя',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Фото',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'О себе',
      type: 'text',
      rows: 4,
    },
    {
      name: 'position',
      title: 'Должность',
      type: 'string',
    },
  ],
}

export default author
