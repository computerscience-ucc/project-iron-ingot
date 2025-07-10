export default {
  type: "document",
  name: "author",
  title: "Author",
  fields: [
    {
      type: "object",
      name: "fullName",
      title: "Authors Full name",
      options: {
         collapsed: true,
      },
      fields: [
        {
          type: "string",
          name: "firstName",
          title: "First name",
         validation: Rule => Rule.required(),
        },
        {
          type: "string",
          name: "middleInitial",
          title: "Middle initial",
          validation: (Rule) => [
            Rule.max(1).error("A middle initial of min. 1 character or none"),
          ],
        },
        {
          type: "string",
          name: "lastName",
          title: "Last name",
          validation: Rule => Rule.required(),
        },
      ],
    },
    {
      type: "image",
      name: "authorPhoto",
      title: "Author Photo",
      options: {
        hotspot: true,
      },
    },
    {
      type: "string",
      name: "pronouns",
      title: "Pronouns",
      description: "Pronouns for the author",
    },
    {
      type: "string",
      name: "batchYear",
      title: "Batch Year",
      description: "Batch Year of the Author",
    },
    {
      type: "string",
      name: "yearLevel",
      title: "Year Level",
      description: "Year Level of the Author",
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      validation: Rule => Rule.required(),
      options: {
        source: (doc) => `${doc.fullName.lastName}-${doc.fullName.firstName}`,
        maxLength: 100,
      },
    },
  ],
  preview: {
    select: {
      title: "fullName.lastName",
      subtitle: "author",
    },
  },
};
