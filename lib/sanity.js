// lib/sanity.js
// Server-side Sanity client for fetching content to feed into the chatbot context.
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'gjvp776o',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2022-06-22',
});

/**
 * Fetches all thesis entries with full detail for AI context.
 */
export async function fetchAllTheses() {
  const query = `
    *[_type == 'thesis'] | order(academicYear desc, _createdAt desc) {
      "title": thesisTitle,
      "slug": slug.current,
      "headerImage": headerImage.asset -> url,
      "authors": postAuthor[] -> { fullName },
      "owners": ownersInformation,
      academicYear,
      department,
      tags,
      "imrad": pt::text(imradContent),
      _createdAt,
      _updatedAt
    }
  `;
  return client.fetch(query);
}

/**
 * Fetches thesis content by slug for deep-dive questions.
 */
export async function fetchThesisBySlug(slug) {
  const query = `
    *[_type == "thesis" && slug.current == $slug]{
      "title": thesisTitle,
      "slug": slug.current,
      "content": pt::text(thesisContent),
      "imrad": pt::text(imradContent),
      "authors": postAuthor[] -> { fullName },
      "owners": ownersInformation,
      academicYear,
      department,
      tags,
      _createdAt,
      _updatedAt
    }[0]
  `;
  return client.fetch(query, { slug });
}

/**
 * Fetches all blog entries (summaries).
 */
export async function fetchAllBlogs() {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      "title": blogTitle,
      "slug": slug.current,
      "authors": blogAuthor[] -> { fullName },
      tags,
      _createdAt
    }
  `;
  return client.fetch(query);
}

/**
 * Fetches all bulletin entries (summaries).
 */
export async function fetchAllBulletins() {
  const query = `
    *[_type == 'bulletin'] | order(_createdAt desc) {
      "title": bulletinTitle,
      "slug": slug.current,
      "authors": bulletinAuthor[] -> { fullName },
      tags,
      _createdAt
    }
  `;
  return client.fetch(query);
}

/**
 * Fetches all award entries.
 */
export async function fetchAllAwards() {
  const query = `
    *[_type == 'award'] | order(_createdAt desc) {
      "title": awardTitle,
      "slug": slug.current,
      "category": awardCategory,
      "badges": awardBadges,
      "recipients": awardRecipients[] -> { fullName, batchYear, program },
      tags,
      _createdAt
    }
  `;
  return client.fetch(query);
}

/**
 * Build a text context blob for the AI from all site content.
 */
export async function buildSiteContext() {
  const [theses, blogs, bulletins, awards] = await Promise.all([
    fetchAllTheses(),
    fetchAllBlogs(),
    fetchAllBulletins(),
    fetchAllAwards(),
  ]);

  let context = `=== ABOUT INGO ===
Ingo is the BSCS (Bachelor of Science in Computer Science) information board website of the University of Caloocan City - Caloocan City (UCC).
It serves as a centralized hub for CS students to find thesis projects, blogs, bulletins/announcements, and awards.
The website is built by CS students for CS students.

Sections of the website:
- Home: Overview with latest blogs, bulletins, and thesis projects
- Thesis: Showcases graduating and graduate CS students' thesis/capstone projects
- Blog: Posts written by BSCS students about CS topics, trends, and tutorials
- Bulletin: Official announcements and updates from professors and the CS department
- Awards: Achievements and recognitions in the CS program
- About: Information about the development team, CS student council, and MIS-ACES
`;

  if (theses.length > 0) {
    context += `\n=== THESIS PROJECTS (${theses.length} total) ===\n`;
    theses.forEach((t, i) => {
      const authors = t.authors?.map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`).join(', ') || 'Unknown';
      const owners = t.owners?.ownerFullname?.join(', ') || 'Unknown';
      const tags = t.tags?.join(', ') || 'None';
      context += `${i + 1}. "${t.title}" (slug: ${t.slug})\n   Academic Year: ${t.academicYear || 'N/A'}\n   Department: ${t.department || 'N/A'}\n   Posted by: ${authors}\n   Thesis Authors: ${owners}\n   Tags: ${tags}\n   Created: ${t._createdAt}\n`;
      if (t.imrad) {
        // Truncate IMRAD to 2000 chars per thesis to keep context manageable
        const excerpt = t.imrad.replace(/\s+/g, ' ').trim().slice(0, 2000);
        context += `   IMRAD Summary: ${excerpt}${t.imrad.length > 2000 ? '...' : ''}\n`;
      }
    });
  }

  if (blogs.length > 0) {
    context += `\n=== BLOG POSTS (${blogs.length} total) ===\n`;
    blogs.forEach((b, i) => {
      const authors = b.authors?.map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`).join(', ') || 'Unknown';
      const tags = b.tags?.join(', ') || 'None';
      context += `${i + 1}. "${b.title}" (slug: ${b.slug})\n   Authors: ${authors}\n   Tags: ${tags}\n`;
    });
  }

  if (bulletins.length > 0) {
    context += `\n=== BULLETINS (${bulletins.length} total) ===\n`;
    bulletins.forEach((b, i) => {
      const authors = b.authors?.map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`).join(', ') || 'Unknown';
      context += `${i + 1}. "${b.title}" (slug: ${b.slug})\n   Authors: ${authors}\n`;
    });
  }

  if (awards.length > 0) {
    context += `\n=== AWARDS (${awards.length} total) ===\n`;
    awards.forEach((a, i) => {
      const recipients = a.recipients?.map((r) => `${r.fullName?.firstName || ''} ${r.fullName?.lastName || ''}`).join(', ') || 'Unknown';
      context += `${i + 1}. "${a.title}" (slug: ${a.slug})\n   Category: ${a.category || 'N/A'}\n   Recipients: ${recipients}\n`;
    });
  }

  return context;
}
