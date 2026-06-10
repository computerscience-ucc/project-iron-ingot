import { defineType } from "sanity";

const thesis = defineType({
  type: "document",
  name: "thesis",
  title: "Thesis",
  groups: [
    { name: "basic", title: "Basic Info" },
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
    { name: "members", title: "Members & Materials" },
    { name: "metadata", title: "Metadata" },
  ],
  orderings: [
    { title: "Academic Year (Newest)", name: "yearDesc", by: [{ field: "academicYear", direction: "desc" }, { field: "_createdAt", direction: "desc" }] },
  ],
  fields: [
    {
      type: "image",
      name: "headerImage",
      title: "Thesis Image Header",
      group: "basic",
      options: { hotspot: true },
    },
    {
      title: "Thesis Title",
      name: "thesisTitle",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      group: "basic",
      validation: (Rule) => Rule.required(),
      options: { source: "thesisTitle", maxLength: 100 },
    },
    {
      title: "Post Author",
      name: "postAuthor",
      type: "array",
      group: "basic",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    },
    {
      type: "object",
      name: "ownersInformation",
      title: "Owner's Information",
      group: "basic",
      options: { collapsible: true },
      fields: [
        {
          name: "ownerFullname",
          title: "Owner's Fullname",
          type: "array",
          of: [{ type: "string", validation: (Rule) => Rule.required() }],
        },
        {
          title: "Owner's Section",
          name: "ownerSection",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      title: "Academic Year",
      name: "academicYear",
      type: "string",
      group: "metadata",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Department",
      name: "department",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "Computer Science (CS)", value: "CS" },
          { title: "Information Technology (IT)", value: "IT" },
          { title: "Information Systems (IS)", value: "IS" },
          { title: "Entertainment & Multimedia Computing (EMC)", value: "EMC" },
          { title: "Other / General", value: "Other" },
        ],
        layout: "radio",
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      group: "metadata",
      of: [{ type: "string" }],
    },
    {
      title: "Thesis Content",
      name: "thesisContent",
      type: "array",
      group: "content",
      validation: (Rule) => Rule.required(),
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    },
    {
      title: "IMRAD Content (AI Knowledge Base)",
      name: "imradContent",
      type: "array",
      group: "content",
      options: { collapsible: true, collapsed: true },
      of: [{ type: "block" }],
    },
    {
      title: "Thesis Gallery Images",
      name: "thesisImages",
      type: "array",
      group: "media",
      options: { collapsible: true },
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      title: "YouTube Link",
      name: "youtubeLink",
      type: "url",
      group: "media",
    },
    {
      title: "3D Model File",
      name: "threeDModel",
      type: "file",
      group: "media",
      options: { accept: ".glb,.gltf" },
    },
    {
      title: "Project Showcase Images",
      name: "showcaseImages",
      type: "array",
      group: "media",
      options: { collapsible: true, collapsed: true },
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      title: "Thesis Members",
      name: "thesisMembers",
      type: "array",
      group: "members",
      options: { collapsible: true },
      of: [
        {
          type: "object",
          name: "member",
          title: "Member",
          fields: [
            { name: "fullName", title: "Full Name", type: "string", validation: (Rule) => Rule.required() },
            { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
            { name: "section", title: "Section", type: "string" },
            { name: "linkedIn", title: "LinkedIn URL", type: "url" },
            { name: "website", title: "Personal Website", type: "url" },
          ],
          preview: { select: { title: "fullName", subtitle: "section", media: "photo" } },
        },
      ],
    },
    {
      title: "Materials & Resources",
      name: "materials",
      type: "array",
      group: "members",
      options: { collapsible: true, collapsed: true },
      of: [
        {
          type: "object",
          name: "material",
          title: "Material",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
            {
              name: "icon",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Document / Paper", value: "document" },
                  { title: "Code / GitHub", value: "github" },
                  { title: "Dataset", value: "dataset" },
                  { title: "Video / Demo", value: "video" },
                  { title: "Other", value: "other" },
                ],
                layout: "radio",
              },
            },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    },
  ],
  preview: {
    select: { title: "thesisTitle", subtitle: "department", media: "headerImage" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Untitled Thesis", subtitle: subtitle || "No department", media };
    },
  },
});

export default thesis;