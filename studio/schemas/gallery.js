export default {
  type: 'document',
  name: 'gallery',
  title: 'Gallery of Works',
  fields: [
    {
      title: 'Project Title',
      name: 'projectTitle',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      validation: Rule => Rule.required(),
      options: {
        source: 'projectTitle',
        maxLength: 100,
      },
    },
    {
      title: 'Who is this person?',
      name: 'personName',
      type: 'string',
      description: 'Student or alumni behind this work.',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Profile Picture',
      name: 'profilePicture',
      type: 'image',
      description: 'Upload a profile image for this person.',
      options: {
        hotspot: true,
      },
    },
    {
      title: 'Date',
      name: 'projectDate',
      type: 'date',
      validation: Rule => Rule.required(),
      options: {
        dateFormat: 'MMMM D, YYYY',
      },
    },
    {
      title: 'YouTube Embed Link',
      name: 'youtubeEmbedLink',
      type: 'url',
      description: 'Paste the YouTube video link for the project demo/output.',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    {
      title: 'GitHub URL',
      name: 'githubUrl',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    {
      title: 'LinkedIn Profile',
      name: 'linkedinProfile',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'tags',
      title: 'Search Tags',
      type: 'array',
      description: 'Search keywords like Automation, C programming, etc.',
      of: [{ type: 'string' }],
    },
  ],
  preview: {
    select: {
      title: 'projectTitle',
      subtitle: 'personName',
      media: 'profilePicture',
    },
  },
};