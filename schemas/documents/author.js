export default {
  type: 'document',
  name: 'author',
  title: 'Author',
  fields: [
    {
      type: 'image',
      name: 'authorPhoto',
      title: 'Author Photo',
      options: {
        hotspot: true,
      },
    },
    {
      type: 'string',
      name: 'pronouns',
      title: 'Pronouns',
      description: 'Pronouns for the author',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.fullName.lastName}-${doc.fullName.firstName}`,
        maxLength: 100,
      },
    },
    {
      type: 'object',
      name: 'fullName',
      title: 'Authors Full name',
      options: {
        collapsible: true,
      },
      fields: [
        {
          type: 'string',
          name: 'firstName',
          title: 'First name',
        },
        {
          type: 'string',
          name: 'middleInitial',
          title: 'Middle initial',
          validation: (Rule) => [
            Rule.max(1).error('A middle initial of min. 1 character or none'),
          ],
        },
        {
          type: 'string',
          name: 'lastName',
          title: 'Last name',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'fullName.lastName',
      subtitle: 'author',
    },
  },
};
