import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely deletes an uploaded file from disk if it resides in the uploads directory.
 * @param {string} fileUrlOrPath - URL (e.g. /uploads/video.mp4) or disk path
 * @returns {boolean} True if deleted or already gone, false on error
 */
export function safeDeleteUploadedFile(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return false;

  try {
    // Only delete files within /uploads or server/uploads
    const cleanUrl = fileUrlOrPath.split('?')[0].split('#')[0];
    const filename = path.basename(cleanUrl);
    
    if (!filename || filename === '.' || filename === '..') return false;

    const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
    const targetFile = path.join(uploadDir, filename);

    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
      console.log(`🗑️ Successfully deleted uploaded file from disk: ${targetFile}`);

      // If it was a parsed presentation deck, check and clean up decks/deck-{basename}
      const baseName = path.basename(filename, path.extname(filename));
      const deckDir = path.join(uploadDir, 'decks', `deck-${baseName}`);
      if (fs.existsSync(deckDir)) {
        fs.rmSync(deckDir, { recursive: true, force: true });
        console.log(`🗑️ Cleaned up parsed deck folder: ${deckDir}`);
      }

      return true;
    }
    return false;
  } catch (err) {
    console.warn(`⚠️ Could not delete file from disk (${fileUrlOrPath}):`, err.message);
    return false;
  }
}
