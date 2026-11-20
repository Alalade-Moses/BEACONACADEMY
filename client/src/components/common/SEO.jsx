import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://beaconbridgeacademics.co.uk';

/**
 * Senior SEO & Structured Data Head Manager
 * Sets unique per-page Title, Meta Description, Canonical Link, Robots, and JSON-LD Schema.
 */
export const SEO = ({
  title,
  description,
  canonicalPath,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop',
  schemaJson = null
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title 
      ? (title.includes('Beacon Bridge') ? title : `${title} | Beacon Bridge Academics`)
      : 'Online Tutoring UK | GCSE & A-Level Tutors | Beacon Bridge';
    document.title = formattedTitle;

    // Helper to create or update meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta Description & Robots
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }
    setMetaTag('name', 'robots', robots);

    // 3. Open Graph & Twitter Cards
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:image', ogImage);

    // 4. Canonical Link Tag
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 5. JSON-LD Structured Data Schema Tag
    const SCHEMA_ID = 'bb-page-schema';
    let schemaEl = document.getElementById(SCHEMA_ID);
    if (schemaJson) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = SCHEMA_ID;
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schemaJson, null, 2);
    } else if (schemaEl) {
      schemaEl.remove();
    }
  }, [title, description, canonicalUrl, robots, ogType, ogImage, schemaJson]);

  return null;
};
