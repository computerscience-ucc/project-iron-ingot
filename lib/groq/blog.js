export const BLOG_LIST_QUERY = "*[_type == \"blog\"] | order(_createdAt desc, _updatedAt desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": blogTitle, \"slug\": slug.current, \"authors\": blogAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, academicYear, tags }";

export const BLOG_PATHS_QUERY = "*[_type == \"blog\" && defined(slug.current)]{ \"slug\": slug.current }";

export const BLOG_DETAIL_QUERY = "*[_type == \"blog\" && slug.current == $slug]{ _id, _createdAt, _updatedAt, \"title\": blogTitle, \"slug\": slug.current, \"content\": blogContent, \"headerImage\": headerImage.asset -> url, \"authors\": blogAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, academicYear, tags }[0]";
