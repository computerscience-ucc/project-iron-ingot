import { createContext, useContext, useEffect, useRef, useState } from "react";

import { client, listenSanity, refetchType } from "../lib/sanity";
import { SITE_CONFIG_QUERY } from "../lib/siteConfig";

const PrefetcherContext = createContext();

const PrefetcherWrapper = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [awards, setAwards] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [globalSearchItems, setGlobalSearchItems] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);

  const sharedStates = { blogs, bulletins, thesis, awards, gallery, globalSearchItems, siteConfig };

  const fetchInitialData = async () => {
    try {
      const [res_blog, res_bulletin, res_thesis, res_awards, res_gallery, res_config] = await Promise.all([
        client.fetch("*[_type == \"blog\"] | order(_createdAt desc, _updatedAt desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": blogTitle, \"slug\": slug.current, \"authors\": blogAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, academicYear, tags }"),
        client.fetch("*[_type == \"bulletin\"] | order(_createdAt desc, _updatedAt desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": bulletinTitle, \"slug\": slug.current, \"authors\": bulletinAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, tags }"),
        client.fetch("*[_type == \"thesis\"] | order(academicYear desc, _createdAt desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": thesisTitle, \"slug\": slug.current, \"authors\": postAuthor[] -> { fullName, pronouns, \"authorPhoto\": authorPhoto.asset -> url }, \"description\": pt::text(thesisContent), academicYear, department, tags }"),
        client.fetch("*[_type == \"award\"] | order(academicYear desc, dateAwarded desc) { _id, _createdAt, _updatedAt, _type, \"headerImage\": headerImage.asset -> url, \"title\": awardTitle, \"slug\": slug.current, \"category\": awardCategory, \"badges\": awardBadges, \"recipients\": recipients[] -> { \"fullName\": fullName.firstName ++ \" \" ++ fullName.lastName, pronouns, batchYear, yearLevel, program, \"recipientPhoto\": recipientPhoto.asset -> url }, \"images\": awardImages[].asset->url, \"description\": awardDescription, academicYear, dateAwarded, tags }"),
        client.fetch("*[_type == \"gallery\"] | order(projectDate desc, _createdAt desc) { _id, _createdAt, _updatedAt, _type, \"title\": projectTitle, \"slug\": slug.current, personName, \"profilePicture\": profilePicture.asset -> url, projectDate, youtubeEmbedLink, githubUrl, linkedinProfile, tags }"),
        client.fetch(SITE_CONFIG_QUERY),
      ]);
      setBlogs(res_blog || []);
      setBulletins(res_bulletin || []);
      setThesis(res_thesis || []);
      setAwards(res_awards || []);
      setGallery(res_gallery || []);
      setSiteConfig(res_config || {});
      setGlobalSearchItems([...(res_blog || []), ...(res_bulletin || []), ...(res_thesis || []), ...(res_awards || []), ...(res_gallery || [])]);
    } catch (err) {
      console.error("[Prefetcher] Initial fetch error:", err);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);

  const setterMap = useRef({
    blog: (data) => { setBlogs(data); updateGlobal(data, "blog"); },
    bulletin: (data) => { setBulletins(data); updateGlobal(data, "bulletin"); },
    thesis: (data) => { setThesis(data); updateGlobal(data, "thesis"); },
    award: (data) => { setAwards(data); updateGlobal(data, "award"); },
    gallery: (data) => { setGallery(data); updateGlobal(data, "gallery"); },
  });

  function updateGlobal(data, type) {
    setGlobalSearchItems((prev) => {
      const filtered = prev.filter((item) => item._type !== type);
      return [...filtered, ...data];
    });
  }

  useEffect(() => {
    const sub = listenSanity((type) => {
      const setter = setterMap.current[type];
      if (setter) refetchType(type).then((data) => { if (data) setter(data); });
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <PrefetcherContext.Provider value={sharedStates}>
      {children}
    </PrefetcherContext.Provider>
  );
};

const usePrefetcher = () => useContext(PrefetcherContext);

export { PrefetcherWrapper, usePrefetcher };
