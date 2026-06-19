export const BULLETIN_LIST_QUERY = "*[_type == \"bulletin\"] | order(_createdAt desc, _updatedAt desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": bulletinTitle, \"slug\": slug.current, \"authors\": bulletinAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, tags }";

export const BULLETIN_PATHS_QUERY = "*[_type == \"bulletin\" && defined(slug.current)]{ \"slug\": slug.current }";

export const BULLETIN_DETAIL_QUERY = "*[_type == \"bulletin\" && slug.current == $slug]{ _id, _createdAt, _updatedAt, \"title\": bulletinTitle, \"slug\": slug.current, \"content\": bulletinContent, \"headerImage\": headerImage.asset -> url, \"authors\": bulletinAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, tags }[0]";
