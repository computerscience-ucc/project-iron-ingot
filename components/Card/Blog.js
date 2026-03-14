import { Card, CardBody, CardFooter, Chip } from '@material-tailwind/react';

import Link from 'next/link';
import { _Transition_Card } from '../../lib/animations';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const BlogCard = ({ blog }) => {
  const { _id, _updatedAt, _createdAt, authors, title, tags, slug } = blog;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Link href={`/blog/${slug}`} scroll={false}>
        <motion.div
          variants={_Transition_Card}
          initial="initial"
          animate="animate"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95, y: -5 }}
          onClick={() => setIsLoading(true)}
          className="relative"
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 rounded-xl bg-[#0f1218]/80 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="bg-[#0f1218] text-grey-100 cursor-pointer">
            <CardBody>
              <p className="text-sm text-grey-700">Blog</p>
              <p className="text-lg font-medium">{title}</p>

              <p className="text-sm mt-3 text-grey-600 font-semibold">
                {authors
                  .map((author) => {
                    return `${author.fullName.firstName} ${author.fullName.lastName}`;
                  })
                  .join(', ')}
              </p>

              <p className="text-sm text-grey-700">
                {dayjs(_createdAt).format('MMM DD, YYYY')}
              </p>
            </CardBody>
            {tags && tags.length > 0 && (
              <CardFooter className="flex justify-end flex-wrap gap-2 text-grey-600">
                {tags.map((tag, i) => (
                  <div key={i}>
                    <Chip className="bg-[#27292D]" value={tag} />
                  </div>
                ))}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </Link>
    </>
  );
};

export default BlogCard;
