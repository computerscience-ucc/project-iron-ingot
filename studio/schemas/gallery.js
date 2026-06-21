import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "gallery",
  title: "Gallery of Works",
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "details", title: "Details" },
    { name: "links", title: "Links" },
  ],
  orderings: [
    { title: "Project Date (Newest)", name: "dateDesc", by: [{ field: "projectDate", direction: "desc" }] },
  ],
  fields: [
    {
      title: "Project Title",
      name: "projectTitle",
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
        source: "projectTitle",
        maxLength: 100,
      },
    },
    {
      title: "Who is this person?",
      name: "personName",
      type: "string",
      group: "basic",
      description: "Student or alumni behind this work.",
      validation: Rule => Rule.required(),
    },
    {
      title: "Profile Picture",
      name: "profilePicture",
      type: "image",
      group: "basic",
      description: "Upload a profile image for this person.",
      options: { hotspot: true },
    },
    {
      title: "Date",
      name: "projectDate",
      type: "date",
      group: "details",
      validation: Rule => Rule.required(),
      options: { dateFormat: "MMMM D, YYYY" },
    },
    {
      name: "tags",
      title: "Search Tags",
      type: "array",
      group: "details",
      description: "Search keywords like Automation, C programming, etc.",
      of: [{ type: "string" }],
    },
    {
      title: "YouTube Embed Link",
      name: "youtubeEmbedLink",
      type: "url",
      group: "links",
      description: "Paste the YouTube video link for the project demo/output.",
      validation: Rule => Rule.required().uri({ scheme: ["http", "https"] }),
    },
    {
      title: "GitHub URL",
      name: "githubUrl",
      type: "url",
      group: "links",
      validation: Rule => Rule.required().uri({ scheme: ["http", "https"] }),
    },
    {
      title: "LinkedIn Profile",
      name: "linkedinProfile",
      type: "url",
      group: "links",
      validation: Rule => Rule.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: {
      title: "projectTitle",
      subtitle: "personName",
      media: "profilePicture",
    },
  },
});