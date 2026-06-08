import { StructureBuilder } from "sanity/structure";

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Configuration")
        // icon removed (was gear emoji in v2)
        .child(
          S.document()
            .schemaType("siteConfig")
            .documentId("siteConfig")
            .title("Site Configuration"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteConfig"].includes(listItem.getId()),
      ),
    ]);
