export default {
  type: "document",
  name: "award",
  title: "Award",
  fields: [
    {
      title: "Award Header Image",
      name: "headerImage",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => [Rule.required().error("Header image is required")],
    },
    {
      title: "Award Title",
      name: "awardTitle",
      type: "string",
      validation: (Rule) => [
        Rule.required().error("Award title is required"),
        Rule.min(3).error("Award title must be at least 3 characters long"),
        Rule.max(200).error("Award title cannot exceed 200 characters"),
        Rule.custom((value) => {
          if (!value) return true;

          // if title is only whitespace
          if (value && value.trim().length === 0) {
            return "Award title cannot be only whitespace";
          }

          // if title has invalid characters
          const invalidChars = /[<>|~@#$%^*[]{}\]/;
          if (invalidChars.test(value)) {
            return "Award title contains invalid characters";
          }

          return true;
        }),
      ],
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "awardTitle",
        maxLength: 100,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required"),
        Rule.custom((value) => {
          if (!value) return true;

          if (value.current.trim().length === 0) {
            return "Slug cannot be only whitespace";
          }

          // ensure slug follows proper format
          const slugPattern = /^[a-z0-9]+(?:-[a-z0-9_]+)*$/;
          if (!slugPattern.test(value.current)) {
            return "Slug must contain only lowercase letters, numbers, dash, and underscores";
          }

          // check minimum length (slug)
          if (value.current.length < 3) {
            return "Slug must be at least 3 characters long";
          }

          return true;
        }),
      ],
    },
    {
      title: "Award Category",
      name: "awardCategory",
      type: "string",
      validation: (Rule) => [
        Rule.required().error("Award category is required"),
        Rule.min(2).error("Award category must be at least 2 characters long"),
        Rule.max(200).error("Award category cannot exceed 200 characters"),
        Rule.custom((value) => {
          if (!value) return true;

          if (value.trim().length === 0) {
            return "Award category cannot be only whitespace";
          }

          const invalidChars = /[<>|~@#$%^*[]{}\]/;
          if (invalidChars.test(value)) {
            return "Award category contains invalid characters";
          }

          return true;
        }),
      ],
    },
    {
      title: "Award Badges",
      name: "awardBadges",
      type: "array",
      of: [
        {
          type: "string",
          validation: (Rule) => [
            Rule.min(2).error("Badge name must be at least 2 characters"),
            Rule.max(100).error("Badge name cannot exceed 100 characters"),
            Rule.custom((value) => {
              if (!value) return true;

              if (value.trim().length === 0) {
                return "Tag cannot be only whitespace";
              }

              return true;
            }),
          ],
        },
      ],
      validation: (Rule) => [
        Rule.min(1).error("At least one badge must be specified"),
        Rule.max(20).error("Maximum 20 badges allowed"),
        Rule.unique().error("No duplicate badges allowed"),
        Rule.custom((badges) => {
          if (!badges) return true;

          const hasEmptyBadges = badges.some(
            (badge) => !badge || badge.trim().length === 0,
          );
          if (hasEmptyBadges) {
            return "Badges cannot be empty";
          }

          return true;
        }),
      ],
    },
    {
      title: "Award Recipients",
      name: "awardRecipients",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "recipient",
            },
          ],
          validation: (Rule) => Rule.required().error("Recipients is required"),
        },
      ],
      validation: (Rule) => [
        Rule.min(1).error("At least one recipient must be specified"),
        Rule.max(50).error("Maximum 50 recipients allowed"),
        Rule.unique().error("Recipients must be unique"),
      ],
    },
    {
      title: "Award Images",
      name: "awardImages",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required().error("Image is required"),
        },
      ],
      validation: (Rule) => [
        Rule.required().error("Award images are required"),
        Rule.min(1).error("At least one image is required"),
        Rule.max(50).error("Maximum 50 images allowed"),
      ],
    },
    {
      title: "Date Awarded",
      name: "dateAwarded",
      type: "datetime",
      validation: (Rule) => [
        Rule.required().error("Award date is required"),
        Rule.custom((value) => {
          const awardDate = new Date(value);
          const currentDate = new Date();

          // check if date is in the future
          if (awardDate > currentDate) {
            return "Award date cannot be in the future";
          }

          // check if date is too far in the past
          const tooOldDate = new Date();
          tooOldDate.setFullYear(tooOldDate.getFullYear() - 100);
          if (awardDate < tooOldDate) {
            return "Award date cannot be more than 100 years ago";
          }

          return true;
        }),
      ],
    },
    {
      title: "Award Description",
      name: "awardDescription",
      type: "text",
      description: "Brief description of the award",
      validation: (Rule) => [
        Rule.max(5000).error("Description cannot exceed 5000 characters"),
        Rule.custom((value) => {
          if (!value) return true;

          if (value && value.trim().length === 0) {
            return "Description cannot be only whitespace";
          }

          return true;
        }),
      ],
    },
    {
      title: "Tags",
      name: "tags",
      type: "array",
      of: [
        {
          type: "string",
          validation: (Rule) => [
            Rule.min(2).error("Tag must be at least 2 characters long"),
            Rule.max(200).error("Tag cannot exceed 200 characters"),
            Rule.custom((value) => {
              if (!value) return true;

              if (value.trim().length === 0) {
                return "Tag cannot be only whitespace";
              }

              return true;
            }),
          ],
        },
      ],
      validation: (Rule) => [
        Rule.min(1).error("At least one tag must be specified"),
        Rule.max(20).error("Maximum 20 tags allowed"),
        Rule.unique().error("No duplicate tags allowed"),
        Rule.custom((tags) => {
          if (!tags) return true;

          const hasEmptyTags = tags.some(
            (tag) => !tag || tag.trim().length === 0,
          );
          if (hasEmptyTags) {
            return "Tags cannot be empty";
          }

          return true;
        }),
      ],
    },
  ],
  // cross-field document level validations
  validation: (rule) =>
    rule.custom((document) => {
      // check for duplicates between badges and tags
      if (document.awardBadges && document.tags) {
        const badges = document.awardBadges.map((badge) =>
          badge.toLowerCase().trim(),
        );
        const tags = document.tags.map((tag) => tag.toLowerCase().trim());

        const duplicates = badges.filter((badge) => tags.includes(badge));

        if (duplicates.length > 0) {
          const duplicateList = [...new Set(duplicates)].join(", ");
          return `The following values appear in both badges and tags: ${duplicateList}. Please use unique values.`;
        }
      }

      return true;
    }),
  // documents preview documentation
  preview: {
    select: {
      title: "awardTitle",
      subtitle: "awardCategory",
      media: "headerImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Award",
        subtitle: subtitle || "No category",
        media,
      };
    },
  },
};
