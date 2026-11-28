import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGE_SEO, BASE_URL } from '../src/seo/seoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

function prerenderSeoPages() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`[prerender-seo] Error: ${templatePath} not found. Run "vite build" first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  console.log(`[prerender-seo] Generating static HTML with unique SEO metadata & Schema for ${Object.keys(PAGE_SEO).length} public routes...`);

  // Extra aliases to generate
  const allRoutes = {
    ...PAGE_SEO,
    '/consultation': PAGE_SEO['/book-consultation'],
    '/tutor/apply': PAGE_SEO['/apply-to-teach'],
    '/register/ielts': PAGE_SEO['/ielts-registration']
  };

  for (const [route, config] of Object.entries(allRoutes)) {
    const canonicalUrl = config.canonicalUrl || `${BASE_URL}${route === '/' ? '' : route}`;
    const pageTitle = config.title;
    const pageDesc = config.description;
    const pageImage = config.ogImage || `${BASE_URL}/hero/slide-live-lessons.jpg`;
    const pageImageAlt = config.ogImageAlt || pageTitle;
    const robots = config.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    const schemaString = JSON.stringify(config.schema, null, 2);

    let pageHtml = baseHtml;

    // 1. Replace <title>
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

    // 2. Replace <meta name="description" ...>
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${pageDesc}" />`
    );

    // 3. Replace <link rel="canonical" ...> and hreflang alternates
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']alternate["']\s+hreflang=["']en-GB["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="alternate" hreflang="en-GB" href="${canonicalUrl}" />`
    );
    pageHtml = pageHtml.replace(
      /<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`
    );

    // 4. Replace <meta name="robots" ...>
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="robots" content="${robots}" />`
    );

    // 5. Replace Open Graph (unique title, description, URL, and branded image per page)
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:title" content="${pageTitle}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:description" content="${pageDesc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image" content="${pageImage}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:alt" content="${pageImageAlt}" />`
    );

    // 6. Replace Twitter Cards
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:title" content="${pageTitle}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:description" content="${pageDesc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image" content="${pageImage}" />`
    );

    // 7. Replace Schema.org JSON-LD Script
    const schemaTag = `<script type="application/ld+json" id="bb-page-schema">\n${schemaString}\n    </script>`;
    if (pageHtml.includes('<script type="application/ld+json"')) {
      pageHtml = pageHtml.replace(
        /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
        schemaTag
      );
    } else {
      pageHtml = pageHtml.replace('</head>', `    ${schemaTag}\n  </head>`);
    }

    // Write file
    if (route === '/') {
      fs.writeFileSync(templatePath, pageHtml, 'utf-8');
      console.log(`[prerender-seo] -> Generated index.html for /`);
    } else {
      const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
      const targetDir = path.join(distDir, cleanRoute);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFile, pageHtml, 'utf-8');
      
      // Also write flat html file (e.g. dist/about.html) for web servers matching clean URLs without trailing slash
      if (!cleanRoute.includes('/')) {
        const flatFile = path.join(distDir, `${cleanRoute}.html`);
        fs.writeFileSync(flatFile, pageHtml, 'utf-8');
      }
      console.log(`[prerender-seo] -> Generated ${cleanRoute}/index.html & ${cleanRoute}.html`);
    }
  }

  console.log('[prerender-seo] SEO static prerender complete!');
}

prerenderSeoPages();
