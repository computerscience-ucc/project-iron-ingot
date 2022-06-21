export default {
  type: 'document',
  name: 'blog',
  title: 'Blog',
  fields: [
    {
      title: 'Blog Title',
      name: 'blogTitle',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
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
