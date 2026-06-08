export const AWARDS_LIST_QUERY = `
  *[_type == 'award'] | order(academicYear desc, dateAwarded desc) {
    _id,
    "title": awardTitle,
    "slug": slug.current,
    "headerImage": headerImage.asset->{url, "metadata": metadata.dimensions},
    "images": awardImages[].asset->{url, "metadata": metadata.dimensions},
    "category": awardCategory,
    "badges": awardBadges,
    "description": awardDescription,
    academicYear,
    dateAwarded,
    tags
  }
`;

export const AWARDS_PATHS_QUERY = `
  *[_type == "award" && defined(slug.current)]{ "slug": slug.current }
`;

export const AWARDS_DETAIL_QUERY = `
  *[_type == "award" && slug.current == $slug][0]{
    _id, _createdAt, _updatedAt, _type,
    "title": awardTitle,
    "headerImage": headerImage.asset->url,
    "slug": slug.current,
    "content": awardContent,
    "category": awardCategory,
    "recipients": recipients[]->{
      "fullName": fullName.firstName ++ " " ++ fullName.lastName,
      "recipientPhoto": recipientPhoto.asset->url,
      yearLevel, batchYear, program
    },
    "dateAwarded": dateAwarded,
    "description": awardDescription,
    badges, tags
  }
`;
