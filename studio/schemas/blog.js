import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "blog",
  title: "Blog",
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "authors", title: "Authors" },
    { name: "metadata", title: "Metadata" },
    { name: "content", title: "Content" },
  ],
  initialValue: {
    academicYear: "2025-2026",
  },
  orderings: [
    { title: "Newest First", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  fields: [
    {
      title: "Blog Header Image",
      name: "headerImage",
      type: "image",
      group: "basic",
      options: { hotspot: true },
    },
    {
      title: "Blog Title",
      name: "blogTitle",
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
        source: "blogTitle",
        maxLength: 100,
      },
    },
    {
      title: "Blog Author",
      name: "blogAuthor",
      type: "array",
      group: "authors",
      of: [
        {
          type: "reference",
          to: [{ type: "author" }],
        },
      ],
    },
    {
      title: "Academic Year",
      name: "academicYear",
      type: "string",
      group: "metadata",
      description: "e.g. 2024-2025",
      options: {
        list: [
          { title: "2020-2021", value: "2020-2021" },
          { title: "2021-2022", value: "2021-2022" },
          { title: "2022-2023", value: "2022-2023" },
          { title: "2023-2024", value: "2023-2024" },
          { title: "2024-2025", value: "2024-2025" },
          { title: "2025-2026", value: "2025-2026" },
          { title: "2026-2027", value: "2026-2027" },
        ],
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      group: "metadata",
      description: "Enter searchable keywords for the blog",
      of: [{ type: "string" }],
    },
    {
      name: "blogContent",
      title: "Blog Content",
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
    select: { title: "blogTitle", subtitle: "academicYear", media: "headerImage" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Untitled Blog", subtitle: subtitle || "", media };
    },
  },
});
