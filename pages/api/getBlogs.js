// get post api
// Language: javascript

import { client } from '../../components/Prefetcher';

const getBlogQuery = `
  *[_type == "blog"]{
    _id,
    _createdAt,
    _updatedAt,
    blogTitle,
    blogContent,
    slug,
    "blogAuthor": blogAuthor[] -> fullName,
    tags
  }
`;

const getBlogs = async (req, res) => {
  const fetchRes = await client.fetch(getBlogQuery);

  res.json(fetchRes);
};

export default getBlogs;
