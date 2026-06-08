import { StructureBuilder } from "sanity/structure";

const contentTypes = ["blog", "bulletin", "thesis", "award", "gallery"];
const peopleTypes = ["author", "recipient"];
const structureTypes = ["council", "devTeam", "heroCarousel"];

export const deskStructure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Configuration")
        .child(
          S.document()
            .schemaType("siteConfig")
            .documentId("siteConfig")
            .title("Site Configuration"),
        ),
      S.divider(),
      S.listItem()
        .title("Content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.listItem()
                .title("Blog Posts")
                .child(S.documentTypeList("blog").title("Blog Posts"))
                .id("blog"),
              S.listItem()
                .title("Bulletins")
                .child(S.documentTypeList("bulletin").title("Bulletins"))
                .id("bulletin"),
              S.listItem()
                .title("Theses")
                .child(S.documentTypeList("thesis").title("Theses"))
                .id("thesis"),
              S.listItem()
                .title("Awards")
                .child(S.documentTypeList("award").title("Awards"))
                .id("award"),
              S.listItem()
                .title("Gallery of Works")
                .child(S.documentTypeList("gallery").title("Gallery of Works"))
                .id("gallery"),
            ]),
        )
        .id("content-group"),
      S.listItem()
        .title("People")
        .child(
          S.list()
            .title("People")
            .items([
              S.listItem()
                .title("Authors")
                .child(S.documentTypeList("author").title("Authors"))
                .id("author"),
              S.listItem()
                .title("Recipients")
                .child(S.documentTypeList("recipient").title("Recipients"))
                .id("recipient"),
            ]),
        )
        .id("people-group"),
      S.listItem()
        .title("Structure")
        .child(
          S.list()
            .title("Structure")
            .items([
              S.listItem()
                .title("CS Council")
                .child(S.documentTypeList("council").title("CS Council"))
                .id("council"),
              S.listItem()
                .title("Dev Team")
                .child(S.documentTypeList("devTeam").title("Dev Team"))
                .id("devTeam"),
              S.listItem()
                .title("Hero Carousel")
                .child(S.documentTypeList("heroCarousel").title("Hero Carousel"))
                .id("heroCarousel"),
            ]),
        )
        .id("structure-group"),
    ]);
