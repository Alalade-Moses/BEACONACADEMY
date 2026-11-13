import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLuminance(hex) {
  if (!hex) return 0.9;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.9;
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function decodeXml(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

/**
 * Extracts and parses a PowerPoint (.pptx) file into structured slide deck data with color fidelity.
 * @param {string} pptxFilePath - Absolute path to the .pptx file on disk
 * @param {string} deckId - Unique identifier for the presentation deck
 * @returns {object} Structured deck object with slides array, totalSlides, and deckId
 */
export function parsePptx(pptxFilePath, deckId) {
  try {
    const uploadsDir = path.dirname(pptxFilePath);
    const decksBaseDir = path.join(uploadsDir, 'decks');
    if (!fs.existsSync(decksBaseDir)) {
      fs.mkdirSync(decksBaseDir, { recursive: true });
    }

    const deckDir = path.join(decksBaseDir, deckId);
    if (!fs.existsSync(deckDir)) {
      fs.mkdirSync(deckDir, { recursive: true });
      // Extract pptx using native tar (supports zip extraction on Windows/macOS/Linux)
      try {
        execSync(`tar -xf "${pptxFilePath}" -C "${deckDir}"`, { stdio: 'pipe' });
      } catch (extractErr) {
        console.error('Failed to unpack PPTX using tar:', extractErr.message);
        return null;
      }
    }

    // 1. Resolve Slide Order from presentation.xml.rels and presentation.xml
    const presRelsPath = path.join(deckDir, 'ppt', '_rels', 'presentation.xml.rels');
    const presXmlPath = path.join(deckDir, 'ppt', 'presentation.xml');

    if (!fs.existsSync(presRelsPath) || !fs.existsSync(presXmlPath)) {
      console.warn('PPTX structure missing presentation.xml or relations');
      return null;
    }

    const presRelsContent = fs.readFileSync(presRelsPath, 'utf8');
    const presXmlContent = fs.readFileSync(presXmlPath, 'utf8');

    // Extract Universal Theme Colors if available (theme1.xml)
    let themeLt1 = '#FFFFFF';
    let themeDk1 = '#15201A';
    let themeAccent1 = '#046A38';
    let themeAccent2 = '#FF7A1A';
    const themePath = path.join(deckDir, 'ppt', 'theme', 'theme1.xml');
    if (fs.existsSync(themePath)) {
      const themeXml = fs.readFileSync(themePath, 'utf8');
      const ltMatch = /<a:lt1>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(themeXml);
      if (ltMatch) themeLt1 = `#${ltMatch[1].toUpperCase()}`;
      const dkMatch = /<a:dk1>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(themeXml);
      if (dkMatch) themeDk1 = `#${dkMatch[1].toUpperCase()}`;
      const acc1Match = /<a:accent1>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(themeXml);
      if (acc1Match) themeAccent1 = `#${acc1Match[1].toUpperCase()}`;
      const acc2Match = /<a:accent2>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(themeXml);
      if (acc2Match) themeAccent2 = `#${acc2Match[1].toUpperCase()}`;
    }

    // Build map: relationshipId -> target file (e.g. "rId2" -> "slides/slide1.xml")
    const relRegex = /<Relationship[^>]+Id="([^"]+)"[^>]+Type="[^"]*\/slide"[^>]+Target="([^"]+)"/gi;
    const relMap = {};
    let relMatch;
    while ((relMatch = relRegex.exec(presRelsContent)) !== null) {
      relMap[relMatch[1]] = relMatch[2].replace(/^\/?/, '');
    }

    // Read slide order from sldIdLst in presentation.xml
    const sldIdRegex = /<p:sldId[^>]+r:id="([^"]+)"/gi;
    let sldMatch;
    const orderedSlideRelIds = [];
    while ((sldMatch = sldIdRegex.exec(presXmlContent)) !== null) {
      orderedSlideRelIds.push(sldMatch[1]);
    }

    const slideFiles = (orderedSlideRelIds.length > 0 ? orderedSlideRelIds : Object.keys(relMap))
      .map(rid => relMap[rid])
      .filter(Boolean);

    // Fallback: If sldId list is empty, scan slides directory directly
    if (slideFiles.length === 0) {
      const slidesDir = path.join(deckDir, 'ppt', 'slides');
      if (fs.existsSync(slidesDir)) {
        const found = fs.readdirSync(slidesDir)
          .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
          .sort((a, b) => {
            const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
            const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
            return na - nb;
          })
          .map(f => `slides/${f}`);
        slideFiles.push(...found);
      }
    }

    const slides = [];

    // 2. Parse Each Slide
    slideFiles.forEach((slideRelPath, index) => {
      const slideIndex = index + 1;
      const slideXmlPath = path.join(deckDir, 'ppt', slideRelPath);
      if (!fs.existsSync(slideXmlPath)) return;

      const slideXml = fs.readFileSync(slideXmlPath, 'utf8');

      // Check for image relationships in slide's _rels file
      const slideBaseName = path.basename(slideRelPath);
      const slideRelsPath = path.join(deckDir, 'ppt', 'slides', '_rels', `${slideBaseName}.rels`);
      const imageMap = {};

      if (fs.existsSync(slideRelsPath)) {
        const slideRelsXml = fs.readFileSync(slideRelsPath, 'utf8');
        const imgRelRegex = /<Relationship[^>]+Id="([^"]+)"[^>]+Type="[^"]*\/image"[^>]+Target="([^"]+)"/gi;
        let imgMatch;
        while ((imgMatch = imgRelRegex.exec(slideRelsXml)) !== null) {
          const target = imgMatch[2].replace(/^(\.\.\/)+/, '');
          const imgFilename = path.basename(target);
          imageMap[imgMatch[1]] = `/uploads/decks/${deckId}/ppt/media/${imgFilename}`;
        }
      }

      // Check pictures <p:pic>
      const slideImages = [];
      const picRegex = /<p:pic>([\s\S]*?)<\/p:pic>/gi;
      let picMatch;
      while ((picMatch = picRegex.exec(slideXml)) !== null) {
        const blipMatch = /<a:blip[^>]+r:embed="([^"]+)"/i.exec(picMatch[1]);
        if (blipMatch && imageMap[blipMatch[1]]) {
          slideImages.push(imageMap[blipMatch[1]]);
        }
      }

      // Extract Slide Background Color
      let bgColor = null;
      const bgMatch = /<p:bg>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(slideXml);
      if (bgMatch) {
        bgColor = `#${bgMatch[1].toUpperCase()}`;
      } else {
        // Gradient fill check
        const gradMatch = /<p:bg>[\s\S]*?<a:gsLst>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i.exec(slideXml);
        if (gradMatch) {
          bgColor = `#${gradMatch[1].toUpperCase()}`;
        }
      }

      // Extract colors used in slide text runs
      const srgbMatches = [...slideXml.matchAll(/<a:srgbClr val="([A-Fa-f0-9]{6})"/gi)].map(m => `#${m[1].toUpperCase()}`);
      const uniqueColors = [...new Set(srgbMatches)];

      // If bgColor wasn't explicitly found in <p:bg>, determine from theme and text contrast
      if (!bgColor) {
        const hasWhiteText = uniqueColors.some(c => getLuminance(c) > 0.85);
        const hasDarkText = uniqueColors.some(c => getLuminance(c) < 0.25);
        if (hasDarkText) {
          bgColor = themeLt1 || '#F8FAFC';
        } else if (hasWhiteText) {
          bgColor = themeDk1 || '#0F172A';
        } else {
          bgColor = index === 0 ? (themeDk1 || '#0B1A12') : (themeLt1 || '#F6F8F5');
        }
      }

      const lum = getLuminance(bgColor);
      const isDark = lum < 0.5;
      const defaultTextColor = isDark ? '#FFFFFF' : '#15201A';

      // Find accent colors (not pure black/white)
      const accentCandidates = uniqueColors.filter(c => {
        const cLum = getLuminance(c);
        return cLum > 0.08 && cLum < 0.92;
      });
      const accentColor = accentCandidates[0] || (isDark ? (themeAccent1 || '#38BDF8') : (themeAccent1 || '#046A38'));
      const secondaryAccent = accentCandidates[1] || (isDark ? (themeAccent2 || '#34D399') : (themeAccent2 || '#FF7A1A'));

      // Extract shapes <p:sp>
      const shapes = [];
      const spRegex = /<p:sp>([\s\S]*?)<\/p:sp>/gi;
      let spMatch;

      while ((spMatch = spRegex.exec(slideXml)) !== null) {
        const spXml = spMatch[1];
        const paragraphs = [];
        const pRegex = /<a:p>([\s\S]*?)<\/a:p>/gi;
        let pMatch;

        while ((pMatch = pRegex.exec(spXml)) !== null) {
          const pXml = pMatch[1];
          const textRuns = [];
          const tRegex = /<a:t>([^<]+)<\/a:t>/gi;
          let tMatch;
          while ((tMatch = tRegex.exec(pXml)) !== null) {
            textRuns.push(decodeXml(tMatch[1]));
          }

          if (textRuns.length > 0) {
            const combined = textRuns.join('').trim();
            if (combined) {
              paragraphs.push(combined);
            }
          }
        }

        if (paragraphs.length > 0) {
          shapes.push(paragraphs);
        }
      }

      // Synthesize slide structure
      let title = '';
      let subtitle = '';
      let category = '';
      let callout = '';
      let footerText = '';
      const contentBlocks = [];
      const allTextLines = [];

      shapes.forEach((shapeParas) => {
        shapeParas.forEach((pText) => {
          allTextLines.push(pText);
        });
      });

      // Filter out footer strings like "TEAM AXIOM | MEDICINE AVAILABILITY IN NIGERIA" or pure slide number
      const contentLines = [];
      allTextLines.forEach((l) => {
        if (slideIndex > 1 && l.includes('|') && /AXIOM|MEDICINE|AVAILABILITY|PRESENTATION|REPORT/i.test(l)) {
          footerText = l;
        } else if (/^\d+$/.test(l.trim()) && l.trim().length <= 3) {
          // Slide page number
        } else {
          contentLines.push(l);
        }
      });

      // Slide Title & Subtitle assignment
      if (slideIndex === 1 && contentLines.length >= 2) {
        title = contentLines[0];
        if (contentLines.length >= 3 && /^(in|of|for|on)\s+/i.test(contentLines[2])) {
          subtitle = `${contentLines[1]} ${contentLines[2]}`;
        } else {
          subtitle = contentLines[1];
        }
      } else {
        if (contentLines.length > 0) {
          title = contentLines[0];
        }
        if (contentLines.length > 1 && contentLines[1].length < 100) {
          subtitle = contentLines[1];
        }
      }

      // Check category candidate (e.g. "Section 4", "Chapter One", "Overview")
      const catCandidate = contentLines.find(l => /^(Chapter|Module|Section|Overview|Part)\b/i.test(l));
      if (catCandidate) {
        category = catCandidate;
      }

      // Group remaining text into structured blocks
      // Example on Slide 4: "Primary Users" followed by description, "Secondary Users" followed by description
      const remainingLines = contentLines.filter(l => l !== title && l !== subtitle && l !== category);

      let currentBlock = null;
      remainingLines.forEach(line => {
        // Ignore lone quote characters
        if (/^[“"”'’\s]+$/.test(line.trim())) return;

        // Check if it's a callout or key conclusion
        if (line.includes('This is not a hypothetical') || line.includes('— it is') || (line.includes('affects both sides') && line.length > 40)) {
          callout = line;
          return;
        }

        // If line is short and looks like a header (e.g. "Primary Users", "Aim", "PRESSURE")
        if (line.length <= 40 && !line.endsWith('.') && !line.includes(';')) {
          if (currentBlock) contentBlocks.push(currentBlock);
          currentBlock = { header: line, body: '' };
        } else if (currentBlock) {
          currentBlock.body = currentBlock.body ? `${currentBlock.body} ${line}` : line;
        } else {
          contentBlocks.push({ header: '', body: line });
        }
      });
      if (currentBlock) contentBlocks.push(currentBlock);

      slides.push({
        slideIndex,
        title: title || `Slide ${slideIndex}`,
        subtitle: subtitle || '',
        category: category || (index === 0 ? 'Title Slide' : `Section ${slideIndex}`),
        bgColor,
        isDark,
        textColor: defaultTextColor,
        accentColor,
        secondaryAccent,
        contentBlocks: contentBlocks.length > 0 ? contentBlocks : shapes.map(s => ({ header: s[0], body: s.slice(1).join(' ') })),
        callout,
        footerText,
        rawLines: allTextLines,
        images: slideImages,
        bgImage: slideImages.length > 0 ? slideImages[0] : null
      });
    });

    return {
      success: true,
      deckId,
      totalSlides: slides.length,
      slides
    };
  } catch (err) {
    console.error('Error parsing PPTX:', err);
    return null;
  }
}
