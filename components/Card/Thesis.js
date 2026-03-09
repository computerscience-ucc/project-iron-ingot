import { Card, CardBody, CardFooter, Chip } from '@material-tailwind/react';

import Link from 'next/link';
import { _Transition_Card } from '../_Animations';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const ThesisCard = ({ thesis }) => {
  const { _id, _createdAt, authors, title, tags, slug, headerImage } = thesis;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Link href={`/thesis/${slug}`} scroll={false}>
        <motion.div
          key={_id}
          variants={_Transition_Card}
          initial="initial"
          animate="animate"
          className="relative"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95, y: -5 }}
          onClick={() => setIsLoading(true)}
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

          <Card className="bg-[#0f1218] border border-[#0f1218] text-grey-100 cursor-pointer overflow-hidden group">
            <motion.div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <div className="absolute inset-0 w-[90%] transition-all duration-200 group-hover:w-[100%] h-full bg-gradient-to-r from-[#0f1218] via-[#0f1218] to-transparent z-10" />
              {headerImage && (
                <Image
                  className="absolute w-3/4 transition-all duration-200 h-full top-0 right-0 object-cover object-center -z-10 opacity-40 group-hover:scale-[0.95] rounded-xl group-hover:opacity-90"
                  src={headerImage}
                  alt={title}
                  layout="fill"
                />
              )}
            </motion.div>
            <CardBody className="relative overflow-hidden">
              <p className="z-10 text-sm text-grey-700">Thesis</p>
              <p className="z-10 text-lg font-medium">{title}</p>
              <p className="z-10 text-sm mt-3 text-grey-600 font-semibold">
                {authors
                  ?.map((author) => `${author.fullName.firstName} ${author.fullName.lastName}`)
                  .join(', ')}
              </p>
              <p className="z-10 text-sm text-grey-700">
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

export default ThesisCard;
