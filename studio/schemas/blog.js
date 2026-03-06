export default {
  type: 'document',
  name: 'blog',
  title: 'Blog',
  fields: [
    {
      title: 'Blog Title',
      name: 'blogTitle',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      validation: Rule => Rule.required(),
      options: {
        source: 'blogTitle',
        maxLength: 100,
      },
    },
    {
      title: 'Blog Author',
      name: 'blogAuthor',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'author',
            },
          ],
        },
      ],
    },
    {
      title: 'Academic Year',
      name: 'academicYear',
      type: 'string',
      description: 'e.g. 2024-2025',
      options: {
        list: [
          { title: '2020-2021', value: '2020-2021' },
          { title: '2021-2022', value: '2021-2022' },
          { title: '2022-2023', value: '2022-2023' },
          { title: '2023-2024', value: '2023-2024' },
          { title: '2024-2025', value: '2024-2025' },
          { title: '2025-2026', value: '2025-2026' },
          { title: '2026-2027', value: '2026-2027' },
        ],
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Enter searcheable keywords for the blog',
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      name: 'blogContent',
      title: 'Blog Content',
      type: 'array',
      validation: Rule => Rule.required(),
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
};
