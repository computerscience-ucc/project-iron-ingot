export default {
  type: "document",
  name: "thesis",
  title: "Thesis",
  fields: [
    {
      type: "image",
      name: "headerImage",
      title: "Thesis Image Header",
      options: {
        hotspot: true,
      },
    },
    {
      title: "Thesis Title",
      name: "thesisTitle",
      type: "string",
      validation: Rule => Rule.required(),
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      validation: Rule => Rule.required(),
      options: {
        source: "thesisTitle",
        maxLength: 100,
      },
    },
    {
      title: "Post Author",
      name: "postAuthor",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "author",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "ownersInformation",
      title: "Owner's Information",
      options: {
        collapsible: true,
      },
      fields: [
        {
          name: "ownerFullname",
          title: "Owner's Fullname",
          type: "array",
          description: "Enter Owners Fullname for this Thesis project",
          of: [
            {
              type: "string",
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          title: "Owner's Section",
          name: "ownerSection",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    },
    {
      title: 'Academic Year',
      name: 'academicYear',
      type: 'string',
      description: 'e.g. 2024-2025',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Department',
      name: 'department',
      type: 'string',
      description: 'Which CSD specialization track does this thesis belongs to?',
      options: {
        list: [
          { title: 'Computer Science (CS)', value: 'CS' },
          { title: 'Information Technology (IT)', value: 'IT' },
          { title: 'Information Systems (IS)', value: 'IS' },
          { title: 'Entertainment & Multimedia Computing (EMC)', value: 'EMC' },
          { title: 'Other / General', value: 'Other' },
        ],
        layout: 'radio',
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Enter searcheable keywords for the thesis",
      of: [
        {
          type: "string",
        },
      ],
    },
    {
      title: 'Thesis Members',
      name: 'thesisMembers',
      type: 'array',
      description: 'Individual profiles of each thesis member/student. They will be shown as small clickable avatars on the thesis page.',
      options: { collapsible: true },
      of: [
        {
          type: 'object',
          name: 'member',
          title: 'Member',
          fields: [
            {
              name: 'fullName',
              title: 'Full Name',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'photo',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'section',
              title: 'Section / Year Level',
              type: 'string',
            },
            {
              name: 'linkedIn',
              title: 'LinkedIn URL',
              type: 'url',
              description: 'e.g. https://linkedin.com/in/username',
            },
            {
              name: 'website',
              title: 'Personal Website',
              type: 'url',
              description: 'Portfolio or personal site URL',
            },
          ],
          preview: {
            select: { title: 'fullName', subtitle: 'section', media: 'photo' },
          },
        },
      ],
    },
    {
      title: 'Thesis Gallery Images',
      name: 'thesisImages',
      type: 'array',
      description: 'Photos shown in the hero carousel at the top of the thesis page.',
      options: { collapsible: true },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
    {
      title: 'YouTube Link',
      name: 'youtubeLink',
      type: 'url',
      description: 'YouTube video URL for this thesis. It will be embedded alongside the image carousel.',
    },
    {
      title: '3D Model File',
      name: 'threeDModel',
      type: 'file',
      description: 'Upload a GLB or GLTF file. Users can orbit, zoom, and interact with the model directly on the thesis page.',
      options: {
        accept: '.glb,.gltf',
      },
    },
    {
      title: 'Project Showcase Images (No 3D Model?)',
      name: 'showcaseImages',
      type: 'array',
      description:
        'If your thesis does not have a 3D model or IoT device, upload project screenshots or photos here instead. These will be displayed in the right panel of the thesis page alongside the written content.',
      options: { collapsible: true, collapsed: true },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
    {
      title: 'Materials & Resources',
      name: 'materials',
      type: 'array',
      description: 'Links to thesis documents, code repositories, datasets, etc. Shown in the Materials tab on the thesis page.',
      options: { collapsible: true, collapsed: true },
      of: [
        {
          type: 'object',
          name: 'material',
          title: 'Material',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. Full Paper, GitHub Repository, Dataset',
              validation: Rule => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon Type',
              type: 'string',
              description: 'Choose an icon to represent this material.',
              options: {
                list: [
                  { title: '\uD83D\uDCC4 Document / Paper', value: 'document' },
                  { title: '\uD83D\uDCBB Code / GitHub', value: 'github' },
                  { title: '\uD83D\uDDC3\uFE0F Dataset', value: 'dataset' },
                  { title: '\uD83C\uDFAC Video / Demo', value: 'video' },
                  { title: '\uD83D\uDD17 Other', value: 'other' },
                ],
                layout: 'radio',
              },
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    },
    {
      title: "Thesis Content",
      name: "thesisContent",
      type: "array",
      validation: Rule => Rule.required(),
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      title: 'IMRAD Content (AI Knowledge Base)',
      name: 'imradContent',
      type: 'array',
      description:
        'Paste the full IMRAD text of this thesis here (Introduction, Methods, Results, and Discussion). This content feeds the Ingo AI chatbot so it can answer thesis-related questions.',
      options: { collapsible: true, collapsed: true },
      of: [{ type: 'block' }],
    },
  ],
};
