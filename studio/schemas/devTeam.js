const devTeam = {
  type: "document",
  name: "devTeam",
  title: "Development Team",
  fields: [
    {
      name: "academicYear",
      title: "Academic Year",
      type: "string",
      description: 'e.g. "2025-2026"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "isCurrent",
      title: "Current Year?",
      type: "boolean",
      description: "Mark this as the currently active team",
      initialValue: false,
    },

    // ─── Leadership ────────────────────────────────
    {
      name: "leadership",
      title: "Leadership",
      description: "Lead Developer, Project Managers, etc.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Full Name", type: "string", validation: (Rule) => Rule.required() },
            { name: "role", title: "Role / Title", type: "string", validation: (Rule) => Rule.required() },
            { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "photo" },
          },
        },
      ],
    },

    // ─── Departments / Groups (dynamic) ────────────
    {
      name: "departments",
      title: "Departments / Groups",
      description: "Add groups like Front-end, Back-end, QA, Documentation, etc.",
      type: "array",
      of: [
        {
          type: "object",
          name: "department",
          title: "Department",
          fields: [
            {
              name: "departmentName",
              title: "Department Name",
              type: "string",
              description: 'e.g. "Front-end Developers & Designers"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: "members",
              title: "Members",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "name", title: "Full Name", type: "string", validation: (Rule) => Rule.required() },
                    { name: "role", title: "Role", type: "string", description: "Optional specific role within the department" },
                    { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
                  ],
                  preview: {
                    select: { title: "name", subtitle: "role", media: "photo" },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: "departmentName" },
            prepare({ title }) {
              return { title: title || "Unnamed Department" };
            },
          },
        },
      ],
    },
  ],
  orderings: [
    {
      title: "Academic Year (Newest)",
      name: "yearDesc",
      by: [{ field: "academicYear", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "academicYear", isCurrent: "isCurrent" },
    prepare({ title, isCurrent }) {
      return {
        title: `Dev Team ${title || ""}`,
        subtitle: isCurrent ? "★ Current" : "",
      };
    },
  },
};

export default devTeam;
