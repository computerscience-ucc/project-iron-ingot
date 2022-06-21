import { useContext, createContext, useEffect, useState } from 'react';
import sanityClient from '@sanity/client';

export const client = new sanityClient({
  projectId: 'gjvp776o',
  dataset: 'production',
  useCdn: true,
});

const blogQuery = `
  *[_type == "blog"] | order(_createdAt desc) {
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

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);

  const fetchBlogPosts = async (e) => {
    const blogPosts = await client.fetch(blogQuery);
    setBlogPosts(blogPosts);
  };

  useEffect((e) => {
    fetchBlogPosts();
  }, []);

  let sharedState = {
    blogPosts,
  };

  return (
    <PrefetcherContext.Provider value={sharedState}>
      {children}
    </PrefetcherContext.Provider>
  );
};

const usePrefetcherContext = (e) => {
  return useContext(PrefetcherContext);
};

export { PrefetcherWrapper, usePrefetcherContext };
