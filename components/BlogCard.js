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
          <div className="card-body p-7 items-start">
            <p className="text-sm opacity-25">Blog</p>
            <p className="card-title">{blogTitle}</p>
            <p className="text-sm opacity-50">
              {dayjs(_updatedAt).format('MMMM DD, YYYY h:mma')}
            </p>
            <div className="flex flex-col mt-4">
              <p>Posted By:</p>
              {blogAuthor.map((author, index) => (
                <blockquote
                  key={author.fullName.lastName}
                  className="italic font-thin "
                >
                  {author.fullName.firstName} {author.fullName.lastName}{' '}
                  {author.pronouns ? `(${author.pronouns})` : ''}
                </blockquote>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap mt-5">
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
