import {Rule} from '@sanity/types'

const post = {
  name: 'post',
  title: 'Статьи',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
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
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'author',
      title: 'Автор',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'categories',
      title: 'Категории',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'mainImage',
      title: 'Главное изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'datetime',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Краткое описание',
      type: 'text',
      rows: 4,
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'body',
      title: 'Содержание',
      type: 'blockContent',
    },
    {
      name: 'readingTime',
      title: 'Время чтения (мин)',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
}

export default post
