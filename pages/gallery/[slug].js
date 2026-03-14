import { CgChevronLeft } from 'react-icons/cg';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { _Transition_Page } from '../../lib/animations';
import { client } from '../../lib/sanity';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;

      if (parsed.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

export const getStaticPaths = async () => {
  const projects = await client.fetch(
    `*[_type == "gallery"]{ "slug": slug.current }`
  );

  return {
    paths: projects.map((project) => ({ params: { slug: project.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const project = await client.fetch(
    `*[_type == "gallery" && slug.current == $slug]{
      _id,
      _createdAt,
      _updatedAt,
      "title": projectTitle,
      "slug": slug.current,
      personName,
      "profilePicture": profilePicture.asset -> url,
      projectDate,
      youtubeEmbedLink,
      githubUrl,
      linkedinProfile,
      tags
    }[0]`,
    { slug: params.slug }
  );

  if (!project) {
    return { notFound: true };
  }

  return {
    props: { project },
    revalidate: 10,
  };
};

const GalleryProjectPage = ({ project }) => {
  const embedUrl = getYouTubeEmbedUrl(project.youtubeEmbedLink);

  return (
    <>
      <Head>
        <title>{`${project.title} | Gallery | Ingo`}</title>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://static.doubleclick.net" />
      </Head>

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen py-36"
      >
        <div className="flex flex-col gap-5 mt-16">
          <Link href="/gallery" scroll={false}>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold flex flex-col md:flex-row gap-2 cursor-pointer transition hover:-translate-x-3">
              <span className="flex items-center">
                <CgChevronLeft size={30} />
              </span>
              <span>{project.title}</span>
            </p>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={project.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-16 h-16 rounded-full overflow-hidden border border-white/15 bg-[#171a20] shrink-0"
            >
              {project.profilePicture ? (
                <Image
                  src={project.profilePicture}
                  alt={project.personName}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-lg text-white/50 font-semibold">
                  {(project.personName || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </a>

            <div className="flex flex-col gap-1 text-white/70">
              <p>
                <span className="text-white/40">By:</span> {project.personName}
              </p>
              <p>
                <span className="text-white/40">Date:</span>{' '}
                {dayjs(project.projectDate || project._createdAt).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {(project.tags || []).map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-full text-xs bg-[#27292D] text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/15 hover:border-white/30 text-sm transition-colors"
            >
              View GitHub Work
            </a>
            <a
              href={project.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/15 hover:border-white/30 text-sm transition-colors"
            >
              View LinkedIn Profile
            </a>
          </div>
        </div>

        <hr className="mb-10 mt-6 opacity-30" />

        {embedUrl ? (
          <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`${embedUrl}?rel=0&modestbranding=1&enablejsapi=1`}
              title={`${project.title} video output`}
              allow="autoplay; fullscreen; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <p className="text-white/40">No valid YouTube embed link was provided for this project.</p>
        )}
      </motion.main>
    </>
  );
};

export default GalleryProjectPage;