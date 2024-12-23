import {Rule} from '@sanity/types'

const category = {
  name: 'category',
  title: 'Категории',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    },
    {
      name: 'icon',
      title: 'Иконка',
      type: 'string',
      description: 'Название иконки из Lucide Icons',
    },
  ],
}

export default category
