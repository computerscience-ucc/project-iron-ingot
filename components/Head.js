import NextHead from 'next/head';

const Head = ({
  title = 'Ingo - BSCS Information Board | Your CS Information on the Go',
  description = 'Your CS Information Board on the Go. Stay updated with BSCS program news, blogs, bulletins, and thesis projects.',
  keywords = 'BSCS, Computer Science, Information Board, Student Portal, Academic Blog, Thesis Projects, University Updates, Ingo, UCC, University of Caloocan City',
  ogImage = '/uccingo.tech.png',
  url = 'https://uccingo.tech',
  type = 'website'
}) => {
  const fullTitle = title.includes('Ingo') ? title : `${title} | Ingo`;
  const fullUrl = url.startsWith('http') ? url : `https://uccingo.tech${url}`;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `https://uccingo.tech${ogImage}`;

  return (
    <NextHead>
      {/* Essential Meta Tags */}
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ingo Team" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/uccingo.tech.png" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Ingo" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="uccingo.tech" />
      <meta property="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta property="twitter:site" content="@ingo_bscs" />
      <meta property="twitter:creator" content="@ingo_bscs" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#d44694" />
      <meta name="msapplication-TileColor" content="#d44694" />
      <meta name="application-name" content="Ingo" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Ingo",
            "description": "BSCS Information Board - Your CS Information on the Go",
            "url": "https://uccingo.tech",
            "logo": "https://uccingo.tech/uccingo.tech.png",
            "sameAs": [
              "https://facebook.com/ingo.bscs",
              "https://twitter.com/ingo_bscs",
              "https://instagram.com/ingo.bscs"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://uccingo.tech/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </NextHead>
  );
};

export default Head;
