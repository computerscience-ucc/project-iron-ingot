export default {
  type: "document",
  name: "recipient",
  title: "Recipient",
  fields: [
    {
      title: "Recipient Full Name",
      name: "fullName",
      type: "object",
      options: {
        collapsed: true,
      },
      fields: [
        {
          type: "string",
          name: "firstName",
          title: "First name",
          validation: (Rule) => [
            Rule.required().error("First name is required"),
            Rule.min(2).error("First name must be at least 2 characters long"),
            Rule.max(50).error("First name cannot exceed 50 characters"),
            Rule.custom((value) => {
              if (!value) return true;

              if (value.trim().length === 0) {
                return "First name cannot be only whitespace";
              }

              // check for valid name characters (letters, spaces, hyphens, apostrophes)
              const namePattern = /^[a-zA-Z\s'-]+$/;
              if (!namePattern.test(value)) {
                return "First name can only contain letters, spaces, hyphens, and apostrophes";
              }

              return true;
            }),
          ],
        },
        {
          type: "string",
          name: "middleInitial",
          title: "Middle initial",
          validation: (Rule) => [
            Rule.required().error("Middle initial is required"),
            Rule.custom((value) => {
              // check if it's a single letter
              const letterPattern = /^[a-zA-Z]$/;
              if (!letterPattern.test(value)) {
                return "Middle initial must be a single letter";
              }

              return true;
            }),
          ],
        },
        {
          type: "string",
          name: "lastName",
          title: "Last name",
          validation: (Rule) => [
            Rule.required().error("Last name is required"),
            Rule.min(2).error("Last name must be at least 2 characters long"),
            Rule.max(50).error("Last name cannot exceed 50 characters"),
            Rule.custom((value) => {
              if (!value) return true;

              if (value.trim().length === 0) {
                return "Last name cannot be only whitespace";
              }

              const namePattern = /^[a-zA-Z\s'-]+$/;
              if (!namePattern.test(value)) {
                return "Last name can only contain letters, spaces, hyphens, and apostrophes";
              }

              return true;
            }),
          ],
        },
      ],
      validation: (Rule) => [
        Rule.required().error("Full name is required"),
        Rule.custom((fullName) => {
          const { firstName, lastName } = fullName;

          // ensure both first and last names are provided
          if (!firstName || !lastName) {
            return "Both first name and last name are required";
          }

          // check for identical first and last names
          if (
            firstName.toLowerCase().trim() === lastName.toLowerCase().trim()
          ) {
            return "First name and last name cannot be identical";
          }

          return true;
        }),
      ],
    },
    {
      title: "Pronouns",
      name: "pronouns",
      type: "string",
      description: "Pronouns for the recipient",
      validation: (Rule) => [
        Rule.custom((value) => {
          const pronounPattern = /^[a-zA-Z]+\/[a-zA-Z]+$/;
          if (!pronounPattern.test(value)) {
            return "Pronouns must be in format 'pronoun/pronoun' (e.g., 'she/her')";
          }

          return true;
        }),
      ],
    },
    {
      title: "Batch Year",
      name: "batchYear",
      type: "string",
      description: "Graduation year or batch year of the recipient",
      validation: (Rule) => [
        Rule.custom((value) => {
          // check if it's a valid 4-digit year
          const yearPattern = /^\d{4}$/;
          if (!yearPattern.test(value)) {
            return "Batch year must be a 4-digit year (e.g., 2025)";
          }

          const year = parseInt(value);
          const currentYear = new Date().getFullYear();

          if (year < 2015 || year > currentYear + 10) {
            return `Batch year must be between 2015 and ${currentYear + 10}`;
          }

          return true;
        }),
      ],
    },
    {
      type: "string",
      name: "yearLevel",
      title: "Year Level",
      description: "Current year level of the recipient",
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
      validation: (Rule) => Rule.required().error("Year level is required"),
    },
    {
      title: "Program",
      name: "program",
      type: "string",
      description: "Academic program or course of study",
      validation: (Rule) => [
        Rule.required().error("Program is required"),
        Rule.min(2).error("Program name must be at least 2 characters long"),
        Rule.max(100).error("Program name cannot exceed 100 characters"),
        Rule.custom((value) => {
          if (!value) return true;

          if (value.trim().length === 0) {
            return "Program name cannot be only whitespace";
          }

          const programPattern = /^[a-zA-Z0-9\s.,&()-]+$/;
          if (!programPattern.test(value)) {
            return "Program name contains invalid characters";
          }

          return true;
        }),
      ],
    },
    {
      type: "image",
      name: "recipientPhoto",
      title: "Recipient Photo",
      description: "Profile photo of the award recipient",
      options: {
        hotspot: true,
      },
      validation: (Rule) => [
        Rule.custom((value) => {
          return true;
        }),
      ],
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
      validation: (Rule) => [
        // validate that source fields exist for slug generation
        Rule.required().error("Slug is required"),
        Rule.custom((value) => {
          if (!value) return true;

          // ensure slug follows proper format
          const slugPattern = /^[a-z0-9_]+(?:[-_][a-z0-9_]+)*$/;
          if (!slugPattern.test(value.current)) {
            return "Slug must contain only lowercase letters, numbers, dash, and underscores";
          }

          // check minimum length (slug)
          if (value.current.trim().length < 3) {
            return "Slug must be at least 3 characters long";
          }

          return true;
        }),
      ],
    },
  ],
  // cross-field document level validations
  validation: (Rule) => [
    Rule.custom((document) => {
      if (document.batchYear && document.yearLevel) {
        const currentYear = new Date().getFullYear();
        const batchYear = parseInt(document.batchYear);

        // if recipient is alumni, batch year should be in the past
        if (document.yearLevel === "alumni" && batchYear > currentYear) {
          return "Alumni cannot have a future batch year";
        }
      }

      return true;
    }),
  ],
  // documents preview
  preview: {
    select: {
      firstName: "fullName.firstName",
      lastName: "fullName.lastName",
      yearLevel: "yearLevel",
      program: "program",
      media: "recipientPhoto",
    },
    prepare({ firstName, lastName, yearLevel, program, media }) {
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      const subtitle = [yearLevel, program].filter(Boolean).join(" • ");

      return {
        title: fullName || "Unnamed Recipient",
        subtitle: subtitle || "No details provided",
        media,
      };
    },
  },
};
