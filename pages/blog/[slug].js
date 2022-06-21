import { motion } from 'framer-motion';
import { _Transition_Page } from '../../components/_Animations';
import { useRouter } from 'next/router';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { PortableText } from '@portabletext/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const blockComponents = {
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
      <em className="text-pink-700 font-bold">{children}</em>
    ),
    link: ({ children, href }) => (
      <a href={href} className="underline underline-offset-4 cursor-pointer">
        {children}
      </a>
    ),
  },
};

export const getServerSideProps = async (e) => {
  const { slug } = e.query;
  const blogPost = await client.fetch(
    `*[_type == "blog" && slug.current == "${slug}"]{
            _id,
            _createdAt,
            _updatedAt,
            blogTitle,
            blogContent,
            slug,
            "blogAuthor": blogAuthor[] -> fullName,
            tags
        }`
  );
  return {
    props: {
      blogPost,
    },
  };
};

const BlogPage = ({ blogPost }) => {
  const [post, setPost] = useState(blogPost[0]);

  useEffect(
    (e) => {
      setPost(blogPost[0]);
      console.log(blogPost[0]);
      window.scrollTo(0, 0);
    },
    [blogPost]
  );

  return (
    <>
      <Head>
        <title>{post.blogTitle} | Ingo</title>
      </Head>
      <motion.section
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 select-none"
      >
        {post && (
          <>
            <div className="flex flex-col gap-2 justify-center mt-16">
              <Link href={'/blog'}>
                <motion.p
                  whileHover={{ x: -10 }}
                  className="flex gap-4 items-center font-bold cursor-pointer"
                >
                  <AiOutlineArrowLeft />
                  <span>Go Back</span>
                </motion.p>
              </Link>
              <p className="text-4xl font-semibold mt-5">{post.blogTitle}</p>
              <p className="flex flex-col gap-2 md:flex-row md:items-center font-semibold">
                {post.blogAuthor.map((author) => (
                  <span key={author.lastName} className="badge badge-primary">
                    {author.firstName} {author.lastName}
                  </span>
                ))}
              </p>
              <p className="mt-5">
                Updated at{' '}
                {dayjs(post._updatedAt).format('MMMM D, YYYY h:mm a')}
              </p>
              <p>
                Posted at {dayjs(post._createdAt).format('MMMM D, YYYY h:mm a')}
              </p>
              <p className="flex flex-col gap-2 md:flex-row md:items-center">
                Posted under
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-secondary font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            </div>

            <div className="divider py-10" />

            <div className="mt-5 flex flex-col gap-5">
              <PortableText
                value={post.blogContent}
                components={blockComponents}
              />
            </div>
          </>
        )}
      </motion.section>
    </>
  );
};

export default BlogPage;
