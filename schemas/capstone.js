export default {
  type: 'document',
  name: 'capstone',
  title: 'Capstone',
  fields: [
    {
      type: 'image',
      name: 'headerImage',
      title: 'Capstone Image Header',
      options: {
        hotspot: true,
      },
    },
    {
      title: 'Capstone Title',
      name: 'capstoneTitle',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'capstoneTitle',
        maxLength: 100,
      },
    },
    {
      title: 'Capstone Author',
      name: 'capstoneAuthor',
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
      description: 'Enter searcheable keywords for the capstone',
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      title: 'Capstone Content',
      name: 'capstoneContent',
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
