export default {
  type: 'document',
  name: 'bulletin',
  title: 'Bulletin',
  fields: [
    {
      title: 'Bulletin Title',
      name: 'bulletinTitle',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'bulletinTitle',
        maxLength: 100,
      },
    },
    {
      title: 'Bulletin Author',
      name: 'bulletinAuthor',
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
      description: 'Enter searcheable keywords for the bulletin',
      of: [
        {
          type: 'string',
        },
      ],
    },
    {
      title: 'Bulletin Content',
      name: 'bulletinContent',
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
