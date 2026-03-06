import S from '@sanity/desk-tool/structure-builder';

// Custom desk structure:
// - "Site Configuration" as a singleton at the top
// - All other document types listed normally below it
export default () =>
  S.list()
    .title('Content')
    .items([
      // Singleton: Site Configuration
      S.listItem()
        .title('Site Configuration')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteConfig')
            .documentId('siteConfig')
            .title('Site Configuration')
        ),
      S.divider(),
      // All other document types (excluding siteConfig from the auto-generated list)
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteConfig'].includes(listItem.getId())
      ),
    ]);
