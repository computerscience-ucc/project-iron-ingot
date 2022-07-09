import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { _Transition_Card } from './_Animations';
import { CgUser } from 'react-icons/cg';
import dayjs from 'dayjs';

const titleCase = (str) => {
  let split = str.toLowerCase().split(' ');
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i][0].toUpperCase() + split[i].slice(1);
  }
  return split.join(' ');
};

const CapstoneCard = (props) => {
  const { capstone } = props;
  const { capstoneTitle, postAuthor, _updatedAt, tags, _id, slug } = capstone;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Link href={`/capstone/${slug}`} scroll={false}>
        <motion.div
          key={_id}
          variants={_Transition_Card}
          initial="initial"
          animate="animate"
          whileHover={{
            y: -5,
          }}
          onClick={() => setIsLoading(true)}
          className="card bg-base-200 select-none cursor-pointer items-start break-inside w-full"
        >
          <div className="card-body p-7 items-start w-full">
            <p className="text-sm opacity-25">
              Capstone |{dayjs(_updatedAt).format('MMMM DD, YYYY h:mma')}
            </p>
            <p className="card-title">{capstoneTitle}</p>
            <div className="flex flex-col mt-4">
              <div className="avatar-group -space-x-2">
                {postAuthor.map((author, index) => {
                  if (postAuthor.length < 2) {
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
                    if (author.authorPhoto) {
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
                    } else {
                      return (
                        <div className="avatar">
                          <div className="w-8 flex items-center justify-center">
                            <CgUser size={25} className="mt-1 mx-auto" />
                          </div>
                        </div>
                      );
                    }
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

export default CapstoneCard;
