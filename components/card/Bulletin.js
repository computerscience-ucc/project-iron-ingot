import { Card, CardBody, CardFooter, Chip } from '@material-tailwind/react';

import Link from 'next/link';
import { _Transition_Card } from '../_Animations';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useState } from 'react';

const BulletinCard = ({ bulletin }) => {
  const { _id, _updatedAt, _createdAt, authors, title, tags, slug } = bulletin;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Link href={`/bulletin/${slug}`} scroll={false}>
        <motion.div
          key={_id}
          variants={_Transition_Card}
          initial="initial"
          animate="animate"
          whileHover={{
            y: -5,
          }}
          whileTap={{
            scale: 0.95,
            y: -5,
          }}
          onClick={() => setIsLoading(true)}
        >
          <Card className="bg-[#0f1218] text-grey-100 cursor-pointer">
            <CardBody>
              <p className="text-sm text-grey-700">Bulletin</p>
              <p className="text-lg font-medium">{title}</p>

              <p className="text-sm mt-3 text-grey-600 font-semibold">
                {authors
                  .map((author) => {
                    return `${author.fullName.firstName} ${author.fullName.lastName}`;
                  })
                  .join(', ')}
              </p>

              <p className="text-sm text-grey-700">
                {dayjs(_updatedAt).format('MMM DD, YYYY')}
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

export default BulletinCard;
