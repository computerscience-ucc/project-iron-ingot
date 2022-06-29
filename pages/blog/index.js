import { AnimatePresence, motion } from 'framer-motion';
import {
  _Transition_Card,
  _Transition_Page,
} from '../../components/_Animations';
import { AiOutlineSearch } from 'react-icons/ai';
import { usePrefetcherContext } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BlogCard from '../../components/BlogCard';
import TopGradient from '../../components/TopGradient';

const Blog = ({}) => {
  const { blogPosts } = usePrefetcherContext();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('_createdAt');
  const [autoSuggestions, setAutoSuggestions] = useState([]);

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (term) => {
    setSearchValue(term);
    const results = blogPosts.filter((post) => {
      return (
        post.blogTitle.toLowerCase().includes(term.toLowerCase()) ||
        // check if it matches any of the tags
        post.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
      );
    });

    // sort by sortBy value
    results.sort((a, b) => {
      return dayjs(b[sortBy]) - dayjs(a[sortBy]);
    });

    setSearchResults(results);
    setIsSearching(true);
    console.log(results);
  };

  // auto suggest
  const handleAutoSuggest = (term) => {
    const results = blogPosts.filter((post) => {
      if (post.blogTitle.toLowerCase().includes(term.toLowerCase())) {
        return post;
      }
      // check if it matches any of the tags
      return post.tags.some((tag) =>
        tag.toLowerCase().includes(term.toLowerCase())
      );
    });
    // limit to 5 results
    setAutoSuggestions(results.slice(0, 5));
  };

  return (
    <>
      <TopGradient colorLeft={'#349ede'} colorRight={'#cea570'} />
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36"
      >
        {/* landing */}
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Blog</p>
          <p className="text-lg font-semibold">
            See what CS students are up to in the CS department
          </p>
        </div>
        {/* search and content */}

        <div className="flex flex-col gap-2 justify-center my-28">
          {/* search bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="input-group relative">
                <input
                  type="text"
                  className="input input-primary w-full"
                  placeholder="Search for something"
                  // check if not focused
                  value={searchValue}
                  onChange={(e) => {
                    if (e.target.value < 1) {
                      setIsSearching(false);
                      setSearchValue('');
                      setSearchResults([]);
                      setAutoSuggestions([]);
                    } else {
                      setSearchValue(e.target.value);
                      handleAutoSuggest(e.target.value);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                      setAutoSuggestions([]);
                    }
                  }}
                />

                <AnimatePresence>
                  {autoSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="menu bg-base-300 p-2 rounded-md absolute z-10 w-full top-16"
                    >
                      {autoSuggestions.map((post) => {
                        return (
                          <Link
                            key={post._id}
                            href={`/blog/${post.slug.current}`}
                          >
                            <li>
                              <span>{post.blogTitle}</span>
                            </li>
                          </Link>
                        );
                      })}
                      {/* toggle suggestion box */}
                      <li
                        className="mt-10"
                        onClick={(e) => setAutoSuggestions([])}
                      >
                        <span className="text-sm bg-error">
                          Toggle off Suggestions
                        </span>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>

                <div
                  onClick={(e) => {
                    handleSearch(searchValue);
                    setAutoSuggestions([]);
                  }}
                  className="btn btn-primary btn-square"
                >
                  <AiOutlineSearch />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <select disabled className="select">
                <option>Sorting Unavailable</option>
                <option value={'_createdAt'}>Creation Time</option>
                <option value={'_updatedAt'}>Update Time</option>
                <option value={'blogTitle'}>Title</option>
              </select>
            </div>
          </div>

          {/* content */}
          {!isSearching && blogPosts && (
            <motion.div
              animate={{ opacity: autoSuggestions.length > 0 ? 0.2 : 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16"
            >
              {blogPosts.map((blog) => (
                <div key={blog._id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </motion.div>
          )}
          {isSearching && searchResults && (
            <motion.div
              animate={{ opacity: autoSuggestions.length > 0 ? 0.2 : 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16"
            >
              {searchResults.map((blog) => (
                <div key={blog._id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </motion.div>
          )}
          {isSearching && searchResults.length < 1 && (
            <motion.div
              variants={_Transition_Page}
              initial="initial"
              animate="animate"
            >
              <p className="text-center">No results found</p>
            </motion.div>
          )}
        </div>
      </motion.section>
    </>
  );
};

export default Blog;
