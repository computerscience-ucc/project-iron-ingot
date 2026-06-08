import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/schema";
import { deskStructure } from "./deskStructure";

export default defineConfig({
  name: "ucc-project-ingo-back-end",
  title: "UCC INGO — Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
});
