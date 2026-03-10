const heroCarousel = {
  type: "document",
  name: "heroCarousel",
  title: "Hero Carousel",
  fields: [
    {
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Slide Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "caption",
              title: "Slide Caption",
              type: "string",
              description: "Optional caption or description for the slide",
            },
            {
              name: "link",
              title: "Slide Link",
              type: "url",
              description: "Optional URL to navigate to when the slide is clicked",
            },
          ],
          preview: {
            select: {
              title: "caption",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Untitled Slide",
                media,
              };
            },
          },
        },
      ],
    },
  ],
};

export default heroCarousel;
