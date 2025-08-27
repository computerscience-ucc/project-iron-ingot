import { AnimatePresence, motion } from 'framer-motion';
import {
  Breadcrumbs,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Alert,
  Card,
  CardBody,
  Typography
} from '@material-tailwind/react';
import { CgChevronLeft, CgChevronUp, CgInfo, CgWarning, CgDanger } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';

import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { _Transition_Page } from '../../components/_Animations';
import { client } from '../../components/Prefetcher';
import dayjs from 'dayjs';
import urlBuilder from '@sanity/image-url';

const urlFor = (source) =>
  urlBuilder({
    projectId: 'gjvp776o',
    dataset: 'production',
  }).image(source);

const blockComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full h-[300px]">
        <Image
          className="w-full h-full"
          src={urlFor(value.asset).url()}
          layout="fill"
          objectFit="contain"
          alt={value.alt}
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
      <blockquote className="text-base p-10 relative ">
        <span className="absolute text-white text-6xl left-2 top-2">
          &ldquo;
        </span>
        {children}
      </blockquote>
    ),
    span: ({ children }) => <span className="text-light">{children}</span>,
  },
  marks: {
    em: ({ children }) => (
      <em className="text-header-color font-bold">{children}</em>
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

// Data validation utilities
const ValidationError = {
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_IMAGE: 'INVALID_IMAGE',
  SANITIZATION_FAILED: 'SANITIZATION_FAILED',
  DATA_CORRUPTION: 'DATA_CORRUPTION'
};

// Field validation schemas
const AwardValidationSchema = {
  required: ['title', 'slug', '_id', '_createdAt'],
  optional: ['headerImage', 'content', 'recipients', 'tags', 'category'],
  formats: {
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    title: /^.{1,200}$/,
    category: /^[a-zA-Z\s]{1,50}$/
  },
  imageFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxContentLength: 10000
};

// Content sanitization function
const sanitizeContent = (content) => {
  if (!content) return null;
  
  try {
    // Basic sanitization for PortableText content
    if (Array.isArray(content)) {
      return content.filter(block => {
        // Ensure each block has required structure
        return block && typeof block === 'object' && block._type;
      }).map(block => {
        // Sanitize text content
        if (block._type === 'block' && block.children) {
          block.children = block.children.filter(child => 
            child && typeof child.text === 'string'
          );
        }
        return block;
      });
    }
    return content;
  } catch (error) {
    console.error('Content sanitization failed:', error);
    throw new Error(ValidationError.SANITIZATION_FAILED);
  }
};

// Image validation function
const validateImage = (imageUrl, fieldName = 'image') => {
  if (!imageUrl) return { isValid: true, error: null }; // Optional field

  try {
    const url = new URL(imageUrl);
    const extension = url.pathname.split('.').pop()?.toLowerCase();
    
    if (!AwardValidationSchema.imageFormats.includes(extension)) {
      return {
        isValid: false,
        error: `Invalid ${fieldName} format. Supported: ${AwardValidationSchema.imageFormats.join(', ')}`
      };
    }

    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid ${fieldName} URL format`
    };
  }
};

// Field validation function
const validateField = (value, fieldName, isRequired = false) => {
  // Required field validation
  if (isRequired && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  // Optional field - skip validation if empty
  if (!value) return { isValid: true, error: null };

  // Format validation
  const format = AwardValidationSchema.formats[fieldName];
  if (format && typeof value === 'string' && !format.test(value)) {
    return {
      isValid: false,
      error: `Invalid ${fieldName} format`
    };
  }

  return { isValid: true, error: null };
};

// Enhanced validation with Sanity error checking
const validateSanityData = (data, slug) => {
  const errors = [];
  const warnings = [];

  // Check if Sanity returned data
  if (!data) {
    return {
      isValid: false,
      errors: [`No award found with slug: "${slug}"`],
      warnings: [],
      type: ValidationError.DATA_CORRUPTION,
      sanityStatus: 'NOT_FOUND'
    };
  }

  // Check for Sanity connection issues
  if (typeof data === 'string' && data.includes('error')) {
    return {
      isValid: false,
      errors: ['Sanity CMS connection error'],
      warnings: [],
      type: ValidationError.DATA_CORRUPTION,
      sanityStatus: 'CONNECTION_ERROR'
    };
  }

  // Validate required Sanity fields
  const requiredSanityFields = ['_id', '_type', '_createdAt'];
  requiredSanityFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Missing Sanity system field: ${field}`);
    }
  });

  // Check for incomplete Sanity document
  if (data._id && !data._id.startsWith('drafts.') && !data.title) {
    warnings.push('Document exists but title is missing - possible incomplete save');
  }

  // Check for draft documents in production
  if (data._id && data._id.startsWith('drafts.')) {
    warnings.push('This is a draft document - may not be published yet');
  }

  // Validate Sanity asset references
  if (data.headerImage && !data.headerImage.includes('cdn.sanity.io')) {
    warnings.push('Header image may not be properly uploaded to Sanity CDN');
  }

  if (data.recipients && Array.isArray(data.recipients)) {
    data.recipients.forEach((recipient, index) => {
      if (recipient.recipientPhoto && !recipient.recipientPhoto.includes('cdn.sanity.io')) {
        warnings.push(`Recipient ${index + 1} photo may not be properly uploaded to Sanity CDN`);
      }
    });
  }

  const validation = validateAwardData(data);
  
  return {
    isValid: validation.isValid && errors.length === 0,
    errors: [...errors, ...validation.errors],
    warnings,
    type: errors.length > 0 ? ValidationError.DATA_CORRUPTION : validation.type,
    sanityStatus: errors.length === 0 ? 'OK' : 'HAS_ISSUES'
  };
};

// Sample data generator for demonstration
const generateSampleAwardData = (slug) => {
  const sampleData = {
    'excellence-award-2024': {
      _id: 'sample-001',
      _type: 'awards',
      _createdAt: '2024-08-27T10:00:00Z',
      _updatedAt: '2024-08-27T10:00:00Z',
      title: 'Excellence in Computer Science Award 2024',
      slug: 'excellence-award-2024',
      category: 'Academic Excellence',
      headerImage: 'https://cdn.sanity.io/images/sample/800x600/award-ceremony.jpg',
      tags: ['Excellence', 'Academic', '2024', 'Computer Science'],
      recipients: [
        {
          fullName: 'Juan Dela Cruz',
          pronouns: 'he/him',
          yearLevel: 'Senior',
          batchYear: '2024',
          recipientPhoto: 'https://cdn.sanity.io/images/sample/200x200/juan-dela-cruz.jpg'
        },
        {
          fullName: 'Maria Santos',
          pronouns: 'she/her',
          yearLevel: 'Senior',
          batchYear: '2024',
          recipientPhoto: 'https://cdn.sanity.io/images/sample/200x200/maria-santos.jpg'
        }
      ],
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This award recognizes outstanding achievement in computer science studies. The recipients have demonstrated exceptional academic performance, leadership skills, and contribution to the BSCS program.'
            }
          ],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Selection Criteria:'
            }
          ],
          style: 'h3'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '• Minimum GPA of 3.75\n• Leadership in student organizations\n• Outstanding thesis project\n• Community service involvement'
            }
          ],
          style: 'normal'
        }
      ]
    },
    'invalid-data-example': {
      _id: null, // Missing required field
      _type: 'awards',
      title: '', // Empty required field
      slug: 'invalid data example!', // Invalid slug format
      category: 'This category name is way too long and exceeds the maximum allowed length limit',
      headerImage: 'not-a-valid-url',
      recipients: [
        {
          fullName: '', // Empty name
          recipientPhoto: 'invalid-photo-url'
        }
      ],
      content: null
    },
    'missing-content-example': {
      _id: 'sample-003',
      _type: 'awards',
      _createdAt: '2024-08-27T10:00:00Z',
      title: 'Award with Missing Content',
      slug: 'missing-content-example',
      category: 'Demo',
      // Missing headerImage, recipients, content
    }
  };

  return sampleData[slug] || null;
};

export const getStaticPaths = async () => {
  try {
    const awardPosts = await client.fetch(
      `*[_type == "awards" && defined(slug.current)]{  
        "slug": slug.current,
      }`
    );
    
    // Validate slug format for each post
    const validPaths = awardPosts
      .filter(post => {
        const slugValidation = validateField(post.slug, 'slug', true);
        if (!slugValidation.isValid) {
          console.warn(`Invalid slug format for award: ${post.slug}`);
          return false;
        }
        return true;
      })
      .map((post) => ({
        params: { slug: post.slug },
      }));

    return {
      paths: validPaths,
      fallback: 'blocking', // enable incremental static regeneration
    };
  } catch (error) {
    console.error('Error fetching award paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps = async (context) => {
  try {
    const { slug } = context.params;
    
    // Validate slug parameter
    const slugValidation = validateField(slug, 'slug', true);
    if (!slugValidation.isValid) {
      return {
        notFound: true,
      };
    }

    // Sanitize slug input to prevent injection
    const sanitizedSlug = slug.replace(/[^a-z0-9\-]/gi, '');
    
    let awardPost = null;
    let isDemoMode = false;

    try {
      // Try to fetch from Sanity first
      const awardPost = await client.fetch(
        `*[_type == "awards" && slug.current == $slug][0]{
          _id,
          _createdAt,
          _updatedAt,
          _type,
          "title": awardTitle,
          "headerImage": headerImage.asset -> url,
          "slug": slug.current,
          "content": awardContent,
          "category": awardCategory,
          "recipients": recipients[] -> {
            fullName,
            "recipientPhoto": recipientPhoto.asset -> url,
            yearLevel,
            batchYear,
            program
          },
          "dateAwarded": dateAwarded,
          "description": awardDescription,
          tags
        }`,
        { slug: sanitizedSlug }
      );

      if (awardPost) {
        // Validate the fetched data
        const validation = validateSanityData(awardPost, sanitizedSlug, false);
        
        return {
          props: {
            awardPost,
            validationErrors: validation.errors || [],
            validationWarnings: validation.warnings || [],
            errorType: null,
            sanityStatus: validation.sanityStatus || 'OK',
            isDemoMode: false,
            debugInfo: {
              slug: sanitizedSlug,
              originalSlug: slug,
              timestamp: new Date().toISOString(),
              source: 'sanity'
            }
          },
          revalidate: 10,
        };
      }
    } catch (sanityError) {
      console.error('Sanity fetch error:', sanityError);
      
      // Fallback to sample data for demonstration
      awardPost = generateSampleAwardData(sanitizedSlug);
      isDemoMode = true;
    }

    // If no data from Sanity and no sample data, try sample data anyway for demo
    if (!awardPost) {
      awardPost = generateSampleAwardData(sanitizedSlug);
      isDemoMode = true;
    }

    // Validate fetched/sample data with enhanced Sanity checking
    const validation = validateSanityData(awardPost, sanitizedSlug);
    
    // Log validation results for debugging
    console.log('Award validation result:', {
      slug: sanitizedSlug,
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      sanityStatus: validation.sanityStatus,
      isDemoMode
    });

    if (!validation.isValid) {
      console.error('Award data validation failed:', validation.errors);
      
      // Return error data for display
      return {
        props: {
          awardPost: null,
          validationErrors: validation.errors,
          validationWarnings: validation.warnings || [],
          errorType: validation.type,
          sanityStatus: validation.sanityStatus,
          isDemoMode,
          debugInfo: {
            slug: sanitizedSlug,
            originalSlug: slug,
            timestamp: new Date().toISOString()
          }
        },
        revalidate: 10,
      };
    }

    // Sanitize content before sending to client
    const sanitizedPost = {
      ...awardPost,
      content: sanitizeContent(awardPost.content),
      title: awardPost.title ? awardPost.title.trim() : '',
      category: awardPost.category ? awardPost.category.trim() : ''
    };

    return {
      props: {
        awardPost: sanitizedPost,
        validationErrors: null,
        validationWarnings: validation.warnings || [],
        errorType: null,
        sanityStatus: validation.sanityStatus,
        isDemoMode,
        debugInfo: {
          slug: sanitizedSlug,
          originalSlug: slug,
          timestamp: new Date().toISOString(),
          dataSource: isDemoMode ? 'sample' : 'sanity'
        }
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        awardPost: null,
        validationErrors: ['Failed to load award data', error.message],
        validationWarnings: [],
        errorType: ValidationError.DATA_CORRUPTION,
        sanityStatus: 'ERROR',
        isDemoMode: false,
        debugInfo: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      },
      revalidate: 10,
    };
  }
};

const AwardPage = ({ 
  awardPost, 
  validationErrors, 
  validationWarnings, 
  errorType, 
  sanityStatus, 
  isDemoMode, 
  debugInfo 
}) => {
  const [post, setPost] = useState(awardPost);
  const [errors, setErrors] = useState(validationErrors || []);
  const [warnings, setWarnings] = useState(validationWarnings || []);
  const [loading, setLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const mainDocument = useRef(null);
  const [scrollToTopButtonShown, setScrollToTopButtonShown] = useState(false);

  // Error recovery function
  const handleErrorRecovery = async () => {
    setLoading(true);
    try {
      // Attempt to reload the page data
      window.location.reload();
    } catch (error) {
      console.error('Error recovery failed:', error);
      setErrors(prev => [...prev, 'Failed to recover from error']);
    } finally {
      setLoading(false);
    }
  };

  // Image error handler with fallback
  const handleImageError = (e, fallbackSrc = null) => {
    console.warn('Image failed to load:', e.target.src);
    if (fallbackSrc) {
      e.target.src = fallbackSrc;
    } else {
      e.target.style.display = 'none';
    }
  };

  // Safe date formatting with validation
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      const date = dayjs(dateString);
      return date.isValid() ? date.format('MMMM DD, YYYY') : 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date not available';
    }
  };

  // Safe string rendering with length limits
  const renderSafeText = (text, maxLength = 200) => {
    if (!text || typeof text !== 'string') return 'Content not available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  useEffect(() => {
    if (awardPost) {
      // Additional client-side validation
      const clientValidation = validateSanityData(awardPost, debugInfo?.slug || 'unknown');
      if (!clientValidation.isValid) {
        setErrors(clientValidation.errors);
        setWarnings(clientValidation.warnings || []);
      } else {
        setPost(awardPost);
        setErrors([]);
        setWarnings(clientValidation.warnings || []);
      }
    }
  }, [awardPost, debugInfo?.slug]);

  // scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // listen for scroll events
  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      // show scroll to top button if user has scrolled down by 20% to 80% of the page
      setScrollToTopButtonShown(
        window.scrollY > mainDocument.current?.scrollHeight * 0.2 &&
          window.scrollY < mainDocument.current?.scrollHeight - 700
      );
    });

    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  // Enhanced error boundary component with Sanity status
  if (errors.length > 0 || !post) {
    return (
      <>
        <Head 
          title="Award Error | Ingo"
          description="Error loading award content. Please try again later."
          url={`/awards/error`}
        />
        <motion.main
          {..._Transition_Page}
          className="min-h-screen py-36 text-white relative"
        >
          <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
          <div className="container mx-auto px-5">
            <div className="max-w-4xl mx-auto">
              
              {/* Error Header */}
              <div className="text-center mb-8">
                <CgDanger className="text-6xl text-red-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">
                  {sanityStatus === 'NOT_FOUND' ? 'Award Not Found' : 
                   sanityStatus === 'CONNECTION_ERROR' ? 'Connection Error' : 
                   'Data Validation Error'}
                </h1>
                <p className="text-white/80 text-lg mb-6">
                  {sanityStatus === 'NOT_FOUND' 
                    ? 'The requested award could not be found in our database.'
                    : sanityStatus === 'CONNECTION_ERROR'
                    ? 'Unable to connect to content management system.'
                    : 'The award data failed validation checks and cannot be displayed safely.'
                  }
                </p>
              </div>

              {/* Demo Mode Banner */}
              {isDemoMode && (
                <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 font-semibold">Demo Mode Active</span>
                  </div>
                  <p className="text-blue-200 text-sm mt-2">
                    This page is running in demonstration mode with sample data because the Sanity CMS is not available.
                  </p>
                </div>
              )}

              {/* Validation Errors */}
              {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-3">
                    <CgDanger className="text-2xl" />
                    Validation Errors ({errors.length})
                  </h3>
                  <div className="space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-3 text-red-200">
                        <span className="text-red-400 mt-1">•</span>
                        <span className="text-sm">{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleErrorRecovery}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Reload'}
                </button>
                <Link href="/awards">
                  <a className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors text-center">
                    Back to Awards
                  </a>
                </Link>
                {isDemoMode && (
                  <Link href="/awards/excellence-award-2024">
                    <a className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors text-center">
                      View Sample Data
                    </a>
                  </Link>
                )}
              </div>

              {/* Sample Data Preview Links */}
              {isDemoMode && (
                <div className="mt-12 text-center">
                  <h3 className="text-lg font-semibold mb-6 text-gray-300">
                    Available Sample Data:
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/awards/excellence-award-2024">
                      <a className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 px-4 py-2 rounded-lg text-green-300 text-sm transition-colors">
                        Valid Award Data
                      </a>
                    </Link>
                    <Link href="/awards/invalid-data-example">
                      <a className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 px-4 py-2 rounded-lg text-red-300 text-sm transition-colors">
                        Invalid Data Example
                      </a>
                    </Link>
                    <Link href="/awards/missing-content-example">
                      <a className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 px-4 py-2 rounded-lg text-yellow-300 text-sm transition-colors">
                        Missing Content Example
                      </a>
                    </Link>
                    <Link href="/awards/research-innovation-award">
                      <a className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-4 py-2 rounded-lg text-blue-300 text-sm transition-colors">
                        Research Award Sample
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.main>
      </>
    );
  }

  return (
    <>
      <Head 
        title={`${renderSafeText(post?.title, 60)} | Ingo`}
        description={`Award details for ${renderSafeText(post?.title, 100)}. BSCS program recognition and achievements.`}
        url={`/awards/${post?.slug}`}
      />
      <motion.main
        {..._Transition_Page}
        className="min-h-screen py-36 text-white relative"
        ref={mainDocument}
      >
        <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
        {/* Validation status indicator (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-20 right-5 z-50 bg-green-600/90 text-white text-xs px-3 py-1 rounded">
            Data Validated
          </div>
        )}

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30 py-3">
            <div className="container mx-auto px-5 text-center">
              <p className="text-blue-300 text-sm">
                <span className="font-semibold">Demo Mode:</span> This page is displaying sample validation data for demonstration purposes.
              </p>
            </div>
          </div>
        )}

        {/* Award Header */}
        <div className="container mx-auto px-5">
          <div className="flex flex-col gap-7">
            
            {/* Date and Tags */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-7 lg:items-center lg:justify-between">
              <p className="text-white/80">
                {post?.dateAwarded 
                  ? formatDate(post.dateAwarded) 
                  : formatDate(post?._createdAt)
                }
              </p>
              {post?.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 5).map((tag, index) => (
                    <Chip 
                      key={index} 
                      className="bg-[#010409] text-white border-white/20" 
                      value={renderSafeText(tag, 20)} 
                    />
                  ))}
                  {post.tags.length > 5 && (
                    <span className="text-white/60 text-sm px-2 py-1">
                      +{post.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Title with Back Link */}
            <Link href="/awards" scroll={false}>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold flex flex-col md:flex-row gap-2 cursor-pointer transition hover:-translate-x-3">
                <span className="flex items-center">
                  <CgChevronLeft size={30} />
                </span>
                <span>{renderSafeText(post?.title)}</span>
              </h1>
            </Link>

            {/* Breadcrumbs */}
            <div className="hidden md:block">
              <Breadcrumbs className="bg-transparent px-0">
                <Link href="/">
                  <a className="text-white/60 hover:text-white transition font-bold">
                    Home
                  </a>
                </Link>
                <Link href="/awards">
                  <a className="text-white/60 hover:text-white transition font-bold">
                    Awards
                  </a>
                </Link>
                <a className="text-white/60 hover:text-white transition font-bold">
                  {renderSafeText(post?.title, 50)}
                </a>
              </Breadcrumbs>
            </div>

            {/* Award Details */}
            <div className="flex flex-col gap-2">
              {post?.category && (
                <p className="text-white/80">
                  <span className="text-white">Category:</span> {renderSafeText(post.category, 30)}
                </p>
              )}
              {post?.description && (
                <p className="text-white/80 text-lg max-w-3xl">
                  {renderSafeText(post.description, 200)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Header Image Section (Optional) */}
        {post?.headerImage && (
          <div className="w-full h-[50vh] relative mt-10">
            <div
              className="w-full h-full bg-cover bg-center rounded-lg mx-5"
              style={{
                backgroundImage: `url(${post.headerImage})`,
              }}
            />
            <div className="absolute inset-0 rounded-lg mx-5"></div>
          </div>
        )}

        {/* content */}
        <div className="container mx-auto px-5 py-10">
          <div className="w-full max-w-4xl mx-auto">
            {/* recipients section with validation */}
            {post?.recipients && Array.isArray(post.recipients) && post.recipients.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-5">Recipients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {post.recipients.slice(0, 9).map((recipient, index) => {
                    // Validate recipient data
                    if (!recipient?.fullName) return null;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-white/5 rounded-lg"
                      >
                        {recipient?.recipientPhoto && (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                            <Image
                              src={recipient.recipientPhoto}
                              layout="fill"
                              objectFit="cover"
                              alt={`${recipient.fullName} photo`}
                              onError={(e) => {
                                console.warn('Recipient photo failed to load:', recipient.recipientPhoto);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {renderSafeText(recipient.fullName, 30)}
                          </h4>
                          <p className="text-sm text-white/60">
                            {recipient.yearLevel && renderSafeText(recipient.yearLevel, 15)}
                            {recipient.yearLevel && recipient.batchYear && ' - '}
                            {recipient.batchYear && `Batch ${recipient.batchYear}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {post.recipients.length > 9 && (
                  <p className="text-white/60 text-sm mt-4 text-center">
                    And {post.recipients.length - 9} more recipients...
                  </p>
                )}
              </div>
            )}

            {/* content with enhanced error handling */}
            <div className="prose prose-invert max-w-none">
              {post?.content ? (
                <PortableText
                  value={post.content}
                  components={blockComponents}
                />
              ) : (
                <div className="text-center py-10 text-white/60">
                  <p>Content not available for this award.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* back button */}
        <Link href="/awards">
          <a className="fixed z-30 top-5 left-5 md:top-10 md:left-10">
            <Tooltip content="Back to Awards" placement="right">
              <IconButton className="bg-grey-800">
                <CgChevronLeft size={25} />
              </IconButton>
            </Tooltip>
          </a>
        </Link>

        {/* scroll to top button */}
        <AnimatePresence>
          {scrollToTopButtonShown && (
            <motion.div
              initial={{
                opacity: 0,
                x: 10,
              }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: 'circOut' },
              }}
              exit={{
                opacity: 0,
                x: 10,
                transition: { duration: 0.3, ease: 'circIn' },
              }}
              className="fixed z-30 bottom-5 right-5 md:bottom-10 md:right-10"
              onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
            >
              <Tooltip content="Scroll to top" placement="left">
                <IconButton className="bg-grey-800">
                  <CgChevronUp size={25} />
                </IconButton>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default AwardPage;
