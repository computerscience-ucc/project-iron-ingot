export default {
  type: 'document',
  name: 'council',
  title: 'CS Council',
  fields: [
    {
      name: 'academicYear',
      title: 'Academic Year',
      type: 'string',
      description: 'e.g. "2025-2026"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isCurrent',
      title: 'Current Year?',
      type: 'boolean',
      description: 'Mark this as the currently active council',
      initialValue: false,
    },

    // ─── Leadership ────────────────────────────────
    {
      name: 'adviser',
      title: 'Adviser',
      type: 'object',
      fields: [
        { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'president',
      title: 'President',
      type: 'object',
      fields: [
        { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'vicePresident',
      title: 'Vice President',
      type: 'object',
      fields: [
        { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
      ],
    },

    // ─── Officers ──────────────────────────────────
    {
      name: 'officers',
      title: 'Officers',
      description: 'Secretary, Treasurer, Auditor, PRO, etc.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'position', title: 'Position', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'name', subtitle: 'position', media: 'photo' },
          },
        },
      ],
    },

    // ─── Year Representatives ──────────────────────
    {
      name: 'yearRepresentatives',
      title: 'Year Representatives',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'yearLevel', title: 'Year Level', type: 'string', description: 'e.g. "4th Year Representative"', validation: (Rule) => Rule.required() },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'name', subtitle: 'yearLevel', media: 'photo' },
          },
        },
      ],
    },

    // ─── Committees (dynamic — add as many as needed) ─
    {
      name: 'committees',
      title: 'Committees',
      description: 'Add committees like Creative, Program, Technical, etc.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'committee',
          title: 'Committee',
          fields: [
            {
              name: 'committeeName',
              title: 'Committee Name',
              type: 'string',
              description: 'e.g. "Creative Committee"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'members',
              title: 'Members',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
                    { name: 'role', title: 'Role', type: 'string', description: 'e.g. "Head" or leave blank for member' },
                    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'role', media: 'photo' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'committeeName' },
            prepare({ title }) {
              return { title: title || 'Unnamed Committee' };
            },
          },
        },
      ],
    },

    // ─── Class Presidents ──────────────────────────
    {
      name: 'classPresidents',
      title: 'Class Presidents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'section', title: 'Section', type: 'string', description: 'e.g. "BSCS 4A"', validation: (Rule) => Rule.required() },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'name', subtitle: 'section', media: 'photo' },
          },
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Academic Year (Newest)',
      name: 'yearDesc',
      by: [{ field: 'academicYear', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'academicYear', isCurrent: 'isCurrent' },
    prepare({ title, isCurrent }) {
      return {
        title: `CS Council ${title || ''}`,
        subtitle: isCurrent ? '★ Current' : '',
      };
    },
  },
};
