import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { getAboutPage, getSocialLinks } from '../lib/contentful';

export default function About({ aboutPage, socialLinks }) {
  return (
    <Layout>
      <Head>
        <title>About | Photography Portfolio</title>
        <meta name="description" content="Learn more about the photographer" />
      </Head>

      <main className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
            {aboutPage?.fields?.image ? (
              <Image
                src={`https:${aboutPage.fields.image.fields.file.url}`}
                alt="About me"
                layout="fill"
                objectFit="cover"
                priority
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Image not available</p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div>
            <h1 className="text-4xl font-bold mb-6">
              {aboutPage?.fields?.heading || 'About Me'}
            </h1>
            
            <div className="prose prose-lg">
              {aboutPage?.fields?.description ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: aboutPage.fields.description.replace(/\n/g, '<br />') 
                }} />
              ) : (
                <p>No description available.</p>
              )}
            </div>

            {/* Social Links */}
            {socialLinks?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Connect With Me</h2>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.sys.id}
                      href={link.fields.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {link.fields.platformName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const aboutPage = await getAboutPage();
    const socialLinks = await getSocialLinks();

    return {
      props: {
        aboutPage: aboutPage || null,
        socialLinks: socialLinks || [],
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching about page data:', error);
    
    return {
      props: {
        aboutPage: null,
        socialLinks: [],
      },
      revalidate: 60,
    };
  }
}