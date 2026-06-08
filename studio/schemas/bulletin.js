import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "bulletin",
  title: "Bulletin",
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "authors", title: "Authors" },
    { name: "metadata", title: "Metadata" },
    { name: "content", title: "Content" },
  ],
  orderings: [
    { title: "Newest First", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  fields: [
    {
      title: "Bulletin Header Image",
      name: "headerImage",
      type: "image",
      group: "basic",
      options: { hotspot: true },
    },
    {
      title: "Bulletin Title",
      name: "bulletinTitle",
      type: "string",
      group: "basic",
      validation: Rule => Rule.required(),
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      group: "basic",
      validation: Rule => Rule.required(),
      options: {
        source: "bulletinTitle",
        maxLength: 100,
      },
    },
    {
      title: "Bulletin Author",
      name: "bulletinAuthor",
      type: "array",
      group: "authors",
      of: [
        { type: "reference", to: [{ type: "author" }] },
      ],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      group: "metadata",
      description: "Enter searcheable keywords for the bulletin",
      of: [{ type: "string" }],
    },
    {
      title: "Bulletin Content",
      name: "bulletinContent",
      type: "array",
      group: "content",
      validation: Rule => Rule.required(),
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    },
  ],
  preview: {
    select: { title: "bulletinTitle", media: "headerImage" },
    prepare({ title, media }) {
      return { title: title || "Untitled Bulletin", media };
    },
  },
};
