import { motion } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import { AiOutlineSearch } from 'react-icons/ai';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Blog = ({}) => {
  return (
    <>
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
              <div className="input-group">
                <input
                  type="text"
                  className="input input-primary w-full"
                  placeholder="Search for something"
                />
                <div className="btn btn-primary btn-square">
                  <AiOutlineSearch />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <select className="select">
                <option>Creation Time</option>
                <option>Update Time</option>
                <option>Author</option>
              </select>
            </div>
          </div>

          {/* content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-16">
            {items.map((e, i) => (
              <div key={i} className="card bg-base-200">
                <div className="card-body p-7">
                  <p className="card-title">
                    This is some long title made for clout
                  </p>
                  <p>June 17, 2022</p>
                  <div className="flex gap-2 flex-wrap mt-5">
                    {/* tags */}
                    <div className="badge badge-secondary">Tag 1</div>
                    <div className="badge badge-secondary">Tag 2</div>
                    <div className="badge badge-secondary">Tag 3</div>
                    <div className="badge badge-secondary">Tag 4</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Blog;
