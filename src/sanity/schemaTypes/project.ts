import { Rule } from '@sanity/types';

const project = {
  name: 'project',
  title: 'Проекты',
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
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 4,
    },
    {
      name: 'link',
      title: 'Ссылка на сайт',
      type: 'url',
    },
    {
      name: 'technologies',
      title: 'Технологии',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};

export default project;
