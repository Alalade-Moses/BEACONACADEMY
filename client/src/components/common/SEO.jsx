import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL, PAGE_SEO } from '../../seo/seoConfig';

/**
 * Senior SEO & Structured Data Head Manager
 * Dynamically updates per-page Title, Meta Description, Canonical Link, Robots, OpenGraph, and JSON-LD Schema.
 */
export const SEO = ({
  title,
  description,
  canonicalPath,
  robots,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop',
  schemaJson = null
}) => {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const config = PAGE_SEO[currentPath] || PAGE_SEO[location.pathname] || {};

  const resolvedTitle = title || config.title || 'Online Tutoring UK | GCSE & A-Level Tutors | Beacon Bridge Academics';
  const resolvedDesc = description || config.description || 'Premier online tutoring for UK GCSEs, A-Levels, and international curricula. Learn with expert tutors through interactive virtual classrooms at Beacon Bridge Academics.';
  const resolvedRobots = robots || config.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const resolvedSchema = schemaJson || config.schema || null;

  const canonicalUrl = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = resolvedTitle.includes('Beacon Bridge') 
      ? resolvedTitle 
      : `${resolvedTitle} | Beacon Bridge Academics`;
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
    setMetaTag('name', 'description', resolvedDesc);
    setMetaTag('property', 'og:description', resolvedDesc);
    setMetaTag('name', 'twitter:description', resolvedDesc);
    setMetaTag('name', 'robots', resolvedRobots);

    // 3. Open Graph & Twitter Cards
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:image', ogImage);

    // 4. Canonical Link Tag (Always self-referencing to the active route)
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 5. JSON-LD Structured Data Schema Tag
    const SCHEMA_ID = 'bb-page-schema';
    
    // Remove any legacy / duplicate static schemas that don't match this page
    const existingSchemas = document.head.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach((script) => {
      if (script.id !== SCHEMA_ID) {
        script.remove();
      }
    });

    let schemaEl = document.getElementById(SCHEMA_ID);
    if (resolvedSchema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = SCHEMA_ID;
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(resolvedSchema, null, 2);
    } else if (schemaEl) {
      schemaEl.remove();
    }
  }, [resolvedTitle, resolvedDesc, canonicalUrl, resolvedRobots, ogType, ogImage, resolvedSchema]);

  return null;
};
