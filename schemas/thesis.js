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
  ],
};
