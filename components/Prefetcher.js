import { useContext, createContext, useEffect, useState } from 'react';
import sanityClient from '@sanity/client';

export const client = new sanityClient({
  projectId: 'gjvp776o',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2022-06-22',
});

const blogQuery = `
  *[_type == "blog"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    blogTitle,
    slug,
    "blogAuthor": blogAuthor[] -> {fullName, pronouns},
    tags
  }
`;

const bulletinQuery = `
  *[_type == "bulletin"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    bulletinTitle,
    slug,
    "bulletinAuthor": bulletinAuthor[] -> {fullName, pronouns},
    tags
  }
`;

const capstoneQuery = `
  *[_type == 'capstone'] {
    _createdAt,
    _id,
    _updatedAt,
    capstoneContent,
    capstoneTitle,
    "headerImage": headerImage.asset -> url,
    ownersInformation,
    "postAuthor": postAuthor[] -> {
      "authorPhoto": authorPhoto.asset -> url,
      fullName,
      pronouns
    },
    "slug": slug.current,
    tags
  }
`;

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [bulletinPosts, setBulletinPosts] = useState([]);
  const [capstonePosts, setCapstonePosts] = useState([]);

  const fetchBlogPosts = async (e) => {
    const blogPosts = await client.fetch(blogQuery);
    setBlogPosts(blogPosts);
  };

  const fetchBulletinPosts = async (e) => {
    const bulletinPosts = await client.fetch(bulletinQuery);
    setBulletinPosts(bulletinPosts);
  };

  const fetchCapstonePosts = async (e) => {
    const capstonePosts = await client.fetch(capstoneQuery);
    setCapstonePosts(capstonePosts);
  };

  useEffect((e) => {
    fetchBlogPosts();
    fetchBulletinPosts();
    fetchCapstonePosts();
  }, []);

  let sharedState = {
    blogPosts,
    bulletinPosts,
    capstonePosts,
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
