import { Rule } from '@sanity/types';

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
      name: 'mainImage',
      title: 'Главное изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
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
    },
    {
      name: 'body',
      title: 'Содержание',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
  },
};

export default post;
