import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { _Transition_Card } from './_Animations';
import dayjs from 'dayjs';

const titleCase = (str) => {
  let split = str.toLowerCase().split(' ');
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i][0].toUpperCase() + split[i].slice(1);
  }
  return split.join(' ');
};

const BlogCard = (props) => {
  const { blog } = props;
  const { blogTitle, blogAuthor, _updatedAt, tags, _id, slug } = blog;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Link href={`/blog/${slug}`} scroll={false}>
        <motion.div
          key={_id}
          variants={_Transition_Card}
          initial="initial"
          animate="animate"
          whileHover={{
            y: -5,
          }}
          onClick={() => setIsLoading(true)}
          className="card bg-base-200 select-none cursor-pointer items-start"
        >
          <div className="card-body p-7 items-start  w-full">
            <p className="text-sm opacity-25">
              Blog | {dayjs(_updatedAt).format('MMMM DD, YYYY h:mma')}
            </p>
            <p className="text-sm opacity-50"></p>
            <p className="card-title">{blogTitle}</p>
            <div className="flex flex-col mt-4">
              <div className="avatar-group -space-x-2">
                {blogAuthor.map((author, index) => {
                  if (blogAuthor.length < 2) {
                    return (
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 ">
                            <img src={author.authorPhoto} />
                          </div>
                        </div>
                        <p className="text-sm">
                          {author.fullName.firstName} {author.fullName.lastName}
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="avatar">
                        <div className="w-8 ">
                          <img
                            src={author.authorPhoto}
                            alt={`${author.fullName.firstName} ${author.fullName.lastName}`}
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2 w-full">
              {/* tags */}
              {tags &&
                tags.map((tag, index) => (
                  <div key={index} className="badge badge-secondary">
                    {titleCase(tag)}
                  </div>
                ))}
            </div>
            {isLoading && (
              <div className="flex">
                <div>
                  <span>Loading...</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </>
  );
};

export default BlogCard;
