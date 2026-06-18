export const GALLERY_LIST_QUERY = "*[_type == \"gallery\"] | order(projectDate desc, _createdAt desc) { _id, _createdAt, _updatedAt, _type, \"title\": projectTitle, \"slug\": slug.current, personName, \"profilePicture\": profilePicture.asset -> url, projectDate, youtubeEmbedLink, githubUrl, linkedinProfile, tags }";

export const GALLERY_PATHS_QUERY = "*[_type == \"gallery\" && defined(slug.current)]{ \"slug\": slug.current }";

export const GALLERY_DETAIL_QUERY = "*[_type == \"gallery\" && slug.current == $slug]{ _id, _createdAt, _updatedAt, \"title\": projectTitle, \"slug\": slug.current, personName, \"profilePicture\": profilePicture.asset -> url, projectDate, youtubeEmbedLink, githubUrl, linkedinProfile, tags }[0]";
