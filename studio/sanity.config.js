import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/schema";
import { deskStructure } from "./deskStructure";
import { revalidateOnPublish } from "./documentActions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uccingo.tech";

const resolveProductionUrl = (doc) => {
  if (!doc?.slug?.current) return undefined;
  const type = doc._type;
  const slug = doc.slug.current;

  const routes = {
    blog: `/blog/${slug}`,
    bulletin: `/bulletin/${slug}`,
    thesis: `/thesis/${slug}`,
    award: `/awards/${slug}`,
    gallery: `/gallery/${slug}`,
  };

  const path = routes[type];
  return path ? `${siteUrl}${path}` : undefined;
};

export default defineConfig({
  name: "ucc-project-ingo-back-end",
  title: "UCC INGO - Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    productionUrl: async (prev, context) => resolveProductionUrl(context.document),
    actions: [revalidateOnPublish],
  },
});
