import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "award",
  title: "Award",
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    {
      title: "Award Title",
      name: "awardTitle",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      group: "basic",
      options: { source: "awardTitle", maxLength: 100 },
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Award Category",
      name: "awardCategory",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Date Awarded",
      name: "dateAwarded",
      type: "datetime",
      group: "basic",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Academic Year",
      name: "academicYear",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "2020", value: "2020" }, { title: "2021", value: "2021" },
          { title: "2022", value: "2022" }, { title: "2023", value: "2023" },
          { title: "2024", value: "2024" }, { title: "2025", value: "2025" },
          { title: "2026", value: "2026" }, { title: "2027", value: "2027" },
        ],
      },
    },
    {
      title: "Award Header Image",
      name: "headerImage",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Award Images",
      name: "awardImages",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      title: "Award Badges",
      name: "awardBadges",
      type: "array",
      group: "basic",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).unique(),
    },
    {
      title: "Award Description",
      name: "awardDescription",
      type: "text",
      group: "content",
      rows: 3,
    },
    {
      title: "Award Content",
      name: "awardContent",
      type: "array",
      group: "content",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    },
    {
      title: "Recipients",
      name: "recipients",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "recipient" }] }],
    },
    {
      title: "Tags",
      name: "tags",
      type: "array",
      group: "metadata",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).unique(),
    },
  ],
  preview: {
    select: { title: "awardTitle", subtitle: "awardCategory", media: "headerImage" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Untitled Award", subtitle: subtitle || "No category", media };
    },
  },
});
