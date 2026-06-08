import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/schema";
import { deskStructure } from "./deskStructure";

export default defineConfig({
  name: "ucc-project-ingo-back-end",
  title: "UCC INGO — Content Studio",
  projectId: "gjvp776o",
  dataset: "production",
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
});
