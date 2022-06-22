import { AiOutlineSearch } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { usePrefetcherContext } from '../../components/Prefetcher';
import CapstoneCard from '../../components/CapstoneCard';
import TopGradient from '../../components/TopGradient';

const Capstone = (e) => {
  const { capstonePosts } = usePrefetcherContext();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('_createdAt');

  useEffect((e) => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (term) => {
    setSearchValue(term);
    const results = capstonePosts.filter((post) => {
      return (
        post.capstoneTitle.toLowerCase().includes(term.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
      );
    });
    results.sort((a, b) => {
      return dayjs(b[sortBy]) - dayjs(a[sortBy]);
    });

    setSearchResults(results);
    setIsSearching(true);
    console.log(results);
  };

  return (
    <>
      <TopGradient colorRight={'#0affff'} colorLeft={'#f0cd00'} />
      <Head>
        <title>Capstone | Ingo</title>
      </Head>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36"
      >
        {/* landing */}
        <div className="flex flex-col gap-2 justify-center mt-16">
          <p className="text-4xl font-semibold">Featured Capstone Projects</p>
          <p className="text-lg font-semibold">
            See what graduating and graduate CS students made their projects
          </p>
        </div>

        {/* search and content */}
        <div className="flex flex-col gap-2 justify-center my-28">
          {/* search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="input-group">
                <input
                  type="text"
                  className="input input-primary w-full"
                  placeholder="Search for something"
                  onChange={(e) => {
                    if (e.target.value < 1) {
                      setIsSearching(false);
                      setSearchValue('');
                      setSearchResults([]);
                    } else {
                      setSearchValue(e.target.value);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                    }
                  }}
                />
                <div
                  onClick={(e) => {
                    handleSearch(searchValue);
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
          {!isSearching && capstonePosts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              {capstonePosts.map((post) => (
                <CapstoneCard key={post._id} capstone={post} />
              ))}
            </div>
          )}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              {searchResults.map((post) => (
                <CapstoneCard key={post._id} capstone={post} />
              ))}
            </div>
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

export default Capstone;
