import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "recipient",
  title: "Recipient",
  orderings: [
    { title: "Name (A-Z)", name: "nameAsc", by: [{ field: "fullName", direction: "asc" }] },
  ],
  fields: [
    {
      title: "Full Name",
      name: "fullName",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Pronouns",
      name: "pronouns",
      type: "string",
    },
    {
      title: "Batch Year",
      name: "batchYear",
      type: "string",
    },
    {
      type: "string",
      name: "yearLevel",
      title: "Year Level",
      options: {
        list: [
          { title: "1st Year", value: "1st-year" },
          { title: "2nd Year", value: "2nd-year" },
          { title: "3rd Year", value: "3rd-year" },
          { title: "4th Year", value: "4th-year" },
          { title: "Graduate", value: "graduate" },
          { title: "Alumni", value: "alumni" },
        ],
      },
    },
    {
      title: "Program",
      name: "program",
      type: "string",
    },
    {
      type: "image",
      name: "recipientPhoto",
      title: "Photo",
      options: { hotspot: true },
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "fullName",
        maxLength: 100,
      },
    },
  ],
  preview: {
    select: {
      title: "fullName",
      yearLevel: "yearLevel",
      media: "recipientPhoto",
    },
    prepare({ title, yearLevel, media }) {
      return {
        title: title || "Unnamed Recipient",
        subtitle: yearLevel || "",
        media,
      };
    },
  },
});
