import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "recipient",
  title: "Recipient",
  fields: [
    {
      title: "Full Name",
      name: "fullName",
      type: "object",
      options: { collapsed: true },
      fields: [
        { type: "string", name: "firstName", title: "First Name", validation: (Rule) => Rule.required() },
        { type: "string", name: "middleInitial", title: "Middle Initial" },
        { type: "string", name: "lastName", title: "Last Name", validation: (Rule) => Rule.required() },
      ],
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
        source: (doc) => {
          if (doc?.fullName?.firstName && doc?.fullName?.lastName) {
            return `${doc.fullName.lastName}-${doc.fullName.firstName}`;
          }
          return "";
        },
        maxLength: 100,
      },
    },
  ],
  preview: {
    select: {
      firstName: "fullName.firstName",
      lastName: "fullName.lastName",
      yearLevel: "yearLevel",
      media: "recipientPhoto",
    },
    prepare({ firstName, lastName, yearLevel, media }) {
      return {
        title: [firstName, lastName].filter(Boolean).join(" ") || "Unnamed Recipient",
        subtitle: yearLevel || "",
        media,
      };
    },
  },
});
