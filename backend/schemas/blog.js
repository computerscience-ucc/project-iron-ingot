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
