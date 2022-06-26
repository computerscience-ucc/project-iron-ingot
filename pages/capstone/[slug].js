import { motion } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import { useRouter } from 'next/router';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import { AiOutlineArrowLeft, AiOutlineUser } from 'react-icons/ai';
import { PortableText } from '@portabletext/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import urlBuilder from '@sanity/image-url';

const urlFor = (source) =>
  urlBuilder({
    projectId: 'gjvp776o',
    dataset: 'production',
  }).image(source);

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[500px]">
        <Image
          className="w-full h-full"
          src={urlFor(value.asset).url()}
          layout="fill"
          objectFit="contain"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold">{children}</h4>,
    h5: ({ children }) => <h5 className="text-lg font-bold">{children}</h5>,
    h6: ({ children }) => <h6 className="text-md font-bold">{children}</h6>,
    p: ({ children }) => <p className="">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="text-base">{children}</blockquote>
    ),
    span: ({ children }) => <span className="text-light">{children}</span>,
    image: ({ node }) => (
      <img src={urlFor(node.asset)} alt={node.alt} className="w-full" />
    ),
  },
  marks: {
    em: ({ children }) => (
      <em className="text-yellow-400  font-bold">{children}</em>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        className="underline underline-offset-4 cursor-pointer text-blue-400"
      >
        {children}
      </a>
    ),
  },
};

export const getStaticPaths = async (e) => {
  const data = await client.fetch(
    `*[_type == "capstone"]{
        _id,
        _createdAt,
        _updatedAt,
        capstoneTitle,
        capstoneContent,
        slug,
        "headerImage": headerImage.asset->url,
        "capstoneAuthor": capstoneAuthor[] -> {fullName, pronouns,"authorPhoto": authorPhoto.asset-> url},
        tags
    }`
  );

  const paths = data.map((item) => {
    return {
      params: {
        slug: item.slug.current,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { slug } = context.params;
  const data = await client.fetch(
    `*[_type == "capstone" && slug.current == "${slug}"]{
        _id,
        _createdAt,
        _updatedAt,
        capstoneTitle,
        capstoneContent,
        slug,
        "headerImage": headerImage.asset->url,
        "capstoneAuthor": capstoneAuthor[] -> {fullName, pronouns,"authorPhoto": authorPhoto.asset-> url},
        tags
    }`
  );

  return {
    props: {
      data,
    },
  };
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  const words = s.split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
};

const CapstonePage = ({ data }) => {
  const router = useRouter();
  const [capstonePost, setCasptonePost] = useState(false);

  useEffect(
    (e) => {
      setCasptonePost(data[0]);
      window.scrollTo(0, 0);
    },
    [data]
  );

  return (
    <>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 select-none"
      >
        {capstonePost && (
          <>
            <Head>
              <title>{capstonePost.capstoneTitle} | Ingo</title>
            </Head>
            <div className="flex flex-col gap-2 justify-center mt-16">
              <Link href={'/capstone'}>
                <motion.p
                  whileHover={{ x: -10 }}
                  className="flex gap-4 items-center font-bold cursor-pointer"
                >
                  <AiOutlineArrowLeft />
                  <span>Go Back to Capstone List</span>
                </motion.p>
              </Link>

              {/* header image */}
              {capstonePost.headerImage && (
                <div className="w-full h-64 overflow-hidden mt-16">
                  <img
                    src={capstonePost.headerImage}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <p className="text-4xl font-semibold mt-5">
                {capstonePost.capstoneTitle}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                <p className="flex flex-col gap-2 ">
                  <span>Posted By</span>
                  {capstonePost.capstoneAuthor.map((author) => (
                    <span
                      key={author.fullName.lastName}
                      className=" flex items-center gap-5"
                    >
                      <span
                        className={
                          author.authorPhoto
                            ? 'avatar'
                            : 'w-10 h-10 flex justify-center items-center'
                        }
                      >
                        {author.authorPhoto ? (
                          <div className="w-10 h-10 mask mask-squircle ">
                            <img src={author.authorPhoto} />
                          </div>
                        ) : (
                          <AiOutlineUser className="w-5 h-5" />
                        )}
                      </span>
                      {author.fullName.firstName} {author.fullName.lastName}{' '}
                      {author.pronouns ? `(${author.pronouns})` : ''}
                    </span>
                  ))}
                </p>
                <div className="flex flex-col gap-1 mt-5 md:mt-0">
                  <p className="flex flex-col ">
                    Updated at{' '}
                    <span className="ml-5 text-primary">
                      {dayjs(capstonePost._updatedAt).format(
                        'MMMM D, YYYY h:mm a'
                      )}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    Posted at{' '}
                    <span className="ml-5 text-primary">
                      {dayjs(capstonePost._createdAt).format(
                        'MMMM D, YYYY h:mm a'
                      )}
                    </span>
                  </p>
                  <p className="flex flex-col gap-2 ">
                    Posted under
                    {capstonePost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-secondary font-semibold ml-5"
                      >
                        {capitalize(tag)}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="divider py-10" />

            <div className="mt-5 flex flex-col gap-5">
              <PortableText
                value={capstonePost.capstoneContent}
                components={blockComponents}
              />
            </div>
          </>
        )}
      </motion.section>
    </>
  );
};

export default CapstonePage;
