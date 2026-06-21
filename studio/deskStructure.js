const defaultOrdering = { field: "_createdAt", direction: "desc" };

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
                .child(S.documentTypeList("blog").title("Blog Posts").defaultOrdering([defaultOrdering]))
                .id("blog"),
              S.listItem()
                .title("Bulletins")
                .child(S.documentTypeList("bulletin").title("Bulletins").defaultOrdering([defaultOrdering]))
                .id("bulletin"),
              S.listItem()
                .title("Theses")
                .child(S.documentTypeList("thesis").title("Theses").defaultOrdering([defaultOrdering]))
                .id("thesis"),
              S.listItem()
                .title("Awards")
                .child(S.documentTypeList("award").title("Awards").defaultOrdering([defaultOrdering]))
                .id("award"),
              S.listItem()
                .title("Gallery of Works")
                .child(S.documentTypeList("gallery").title("Gallery of Works").defaultOrdering([defaultOrdering]))
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
                .child(S.documentTypeList("author").title("Authors").defaultOrdering([defaultOrdering]))
                .id("author"),
              S.listItem()
                .title("Recipients")
                .child(S.documentTypeList("recipient").title("Recipients").defaultOrdering([defaultOrdering]))
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
                .child(S.documentTypeList("council").title("CS Council").defaultOrdering([defaultOrdering]))
                .id("council"),
              S.listItem()
                .title("Dev Team")
                .child(S.documentTypeList("devTeam").title("Dev Team").defaultOrdering([defaultOrdering]))
                .id("devTeam"),
              S.listItem()
                .title("Hero Carousel")
                .child(S.documentTypeList("heroCarousel").title("Hero Carousel").defaultOrdering([defaultOrdering]))
                .id("heroCarousel"),
            ]),
        )
        .id("structure-group"),
    ]);
