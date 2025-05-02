import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSocialLinks } from '../lib/contentful';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [year] = useState(new Date().getFullYear());

  // Fetch social links
  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const links = await getSocialLinks();
        setSocialLinks(links || []);
      } catch (error) {
        console.error('Error fetching social links for footer:', error);
      }
    }
    
    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Site Name */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold">
              Portfolio
            </Link>
            <p className="mt-2 text-gray-400">
              Capturing moments, preserving memories
            </p>
          </div>

          {/* Navigation */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-3">Explore</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Connect</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.sys.id}
                    href={link.fields.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={link.fields.platformName}
                  >
                    {link.fields.platformName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {year} Photography Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}