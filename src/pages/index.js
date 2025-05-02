import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { getHomepageSlideshow, getAllGalleryFolders } from '../lib/contentful';

export default function Home({ slideshow, galleryFolders }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = slideshow?.fields?.images || [];
  const [isLoading, setIsLoading] = useState(true);

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handle previous and next navigation
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Set loading state to false once images are loaded
  useEffect(() => {
    if (slides.length > 0) {
      setIsLoading(false);
    }
  }, [slides]);

  return (
    <Layout minimal={true}>
      <Head>
        <title>Photography Portfolio</title>
        <meta name="description" content="Welcome to my photography portfolio" />
      </Head>

      <main className="flex flex-col items-center min-h-screen">
        {/* Full Screen Slideshow */}
        <section className="w-full h-screen fixed inset-0 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full bg-black">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : slides.length > 0 ? (
            <>
              {slides.map((slide, index) => (
                <div
                  key={slide.sys.id}
                  className={`absolute inset-0 transition-opacity duration-2000 ${
                    currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={`https:${slide.fields.file.url}`}
                    alt={slide.fields.title || 'Photography'}
                    layout="fill"
                    objectFit="cover"
                    priority={index === 0}
                    quality={95}
                    className="select-none"
                  />
                </div>
              ))}

              {/* Minimal Title Overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <h1 className="text-white text-5xl md:text-7xl font-light text-center opacity-90 tracking-wider">
                  {slideshow?.fields?.title || 'Portfolio'}
                </h1>
              </div>

              {/* Navigation arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
                    onClick={goToPrevSlide}
                    aria-label="Previous slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
                    onClick={goToNextSlide}
                    aria-label="Next slide"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Minimal progress indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === index ? 'bg-white w-6' : 'bg-white/40'
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-black">
              <p className="text-xl text-white/70">No images found</p>
            </div>
          )}
        </section>

        {/* Gallery Links (positioned at the bottom) */}
        <div className="fixed bottom-24 left-0 right-0 z-30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-6">
              {galleryFolders?.map((gallery) => (
                <Link
                  key={gallery.sys.id}
                  href={`/gallery/${gallery.fields.slug}`}
                  className="px-6 py-2 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors rounded-full"
                >
                  {gallery.fields.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const slideshow = await getHomepageSlideshow();
    const galleryFolders = await getAllGalleryFolders();

    return {
      props: {
        slideshow: slideshow || null,
        galleryFolders: galleryFolders || [],
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    return {
      props: {
        slideshow: null,
        galleryFolders: [],
      },
      revalidate: 60,
    };
  }
}