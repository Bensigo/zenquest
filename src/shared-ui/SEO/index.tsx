import Head from "next/head";

type SEO =  {
    title: string,
    description: string,
    keywords: string
}
const SEO = ({ title, description, keywords }: SEO) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Your Name" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://yourwebsite.com" />

      {/* Open Graph meta tags for social media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://yourwebsite.com" />
      <meta property="og:image" content="https://yourwebsite.com/og-image.jpg" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://yourwebsite.com/twitter-image.jpg" />
      
      {/* Add more SEO meta tags here */}
    </Head>
  );
};

export default SEO;
