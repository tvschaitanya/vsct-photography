import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllGalleryFolders, getGalleryFolderBySlug } from '../../lib/contentful';

export default function GalleryPage({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // If gallery not found
  if (!gallery) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Gallery Not Found</h1>
          <p className="mb-8">Sorry, the gallery you're looking for doesn't exist.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md">
            Return Home
          </Link>
        </div>
      </Layout>
    );
  }

  // Open image modal
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <Layout>
      <Head>
        <title>{gallery.fields.title} | Photography Portfolio</title>
        <meta 
          name="description" 
          content={gallery.fields.description || `Photos from ${gallery.fields.title}`}
        />
      </Head>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{gallery.fields.title}</h1>
          
          {gallery.fields.description && (
            <div className="max-w-3xl">
              <p className="text-gray-700">
                {gallery.fields.description}
              </p>
            </div>
          )}
        </div>

        {/* Photo Grid */}
        {gallery.fields.photos && gallery.fields.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.fields.photos.map((photo) => (
              <div 
                key={photo.sys.id} 
                className="aspect-square relative rounded-lg overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(photo)}
              >
                <Image
                  src={`https:${photo.fields.file.url}`}
                  alt={photo.fields.title || ''}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105 duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos found in this gallery.</p>
          </div>
        )}
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full">
              <Image
                src={`https:${selectedImage.fields.file.url}`}
                alt={selectedImage.fields.title || ''}
                layout="fill"
                objectFit="contain"
              />
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image title/caption if available */}
            {selectedImage.fields.title && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="bg-black/50 text-white p-2 inline-block rounded-md">
                  {selectedImage.fields.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const galleries = await getAllGalleryFolders();
    
    // Create paths for each gallery
    const paths = galleries.map((gallery) => ({
      params: { slug: gallery.fields.slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Show 404 for non-existent slugs after checking with Contentful
    };
  } catch (error) {
    console.error('Error generating gallery paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const gallery = await getGalleryFolderBySlug(params.slug);
    
    // If gallery not found, return 404
    if (!gallery) {
      return { notFound: true };
    }

    return {
      props: {
        gallery,
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`Error fetching gallery ${params.slug}:`, error);
    return { notFound: true };
  }
}