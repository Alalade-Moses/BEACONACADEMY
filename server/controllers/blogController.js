import { store } from '../database/store.js';
import { isSafeUrl, clampText, pickFields } from '../utils/validators.js';

const BLOG_EDITABLE_FIELDS = [
  'title', 'slug', 'category', 'type', 'excerpt', 'content',
  'flyer_image_url', 'author_name', 'author_role', 'read_time', 'tags', 'status', 'featured'
];
const VALID_BLOG_TYPES = new Set(['article', 'flyer']);
const VALID_BLOG_STATUSES = new Set(['published', 'draft']);

export const getBlogPosts = async (req, res, next) => {
  try {
    const { category, type, status, search } = req.query;
    const isAdmin = req.user && (req.user.role === 'superadmin' || req.user.role === 'admin');
    const effectiveStatus = isAdmin ? (status || 'all') : 'published';

    let posts = await store.getBlogPosts({ category, type, status: effectiveStatus });

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      posts = posts.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          (p.author_name && p.author_name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (err) {
    next(err);
  }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let post = await store.getBlogPostBySlug(idOrSlug);
    if (!post) post = await store.getBlogPostById(idOrSlug);

    const isAdmin = req.user && (req.user.role === 'superadmin' || req.user.role === 'admin');
    if (!post || (post.status !== 'published' && !isAdmin)) {
      return res.status(404).json({ success: false, message: 'Blog post or flyer not found.' });
    }

    res.status(200).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const {
      title, slug, category, type = 'article', excerpt, content,
      flyer_image_url, author_name, author_role, read_time, tags,
      status = 'published', featured = false
    } = req.body || {};

    const cleanTitle = clampText(title || '', 240);
    if (!cleanTitle) {
      return res.status(400).json({ success: false, message: 'Post title is required.' });
    }
    if (!VALID_BLOG_TYPES.has(type)) {
      return res.status(400).json({ success: false, message: 'Invalid post type.' });
    }
    if (!VALID_BLOG_STATUSES.has(status)) {
      return res.status(400).json({ success: false, message: 'Invalid post status.' });
    }
    if (flyer_image_url && !isSafeUrl(flyer_image_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid flyer image URL.' });
    }

    const newPost = await store.createBlogPost({
      title: cleanTitle,
      slug: slug ? clampText(slug, 180) : undefined,
      category: clampText(category || 'GCSE Mastery', 100),
      type,
      excerpt: clampText(excerpt || '', 1000),
      content: clampText(content || '', 40000),
      flyer_image_url: flyer_image_url ? String(flyer_image_url).trim() : '',
      author_name: clampText(author_name || req.user?.full_name || 'Beacon Bridge Academics', 120),
      author_role: clampText(author_role || 'Curriculum Lead', 120),
      read_time: clampText(read_time || '', 50),
      tags,
      status,
      featured: Boolean(featured)
    });

    const io = req.app.get('io');
    if (io && newPost.status === 'published') {
      io.emit('blog:created', newPost);
      io.emit('blog:changed', { action: 'create', post: newPost });
    }

    res.status(201).json({
      success: true,
      message: `${newPost.type === 'flyer' ? 'Flyer' : 'Article'} published successfully.`,
      post: newPost
    });
  } catch (err) {
    next(err);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = pickFields(req.body, BLOG_EDITABLE_FIELDS);
    if (updates.type && !VALID_BLOG_TYPES.has(updates.type)) {
      return res.status(400).json({ success: false, message: 'Invalid post type.' });
    }
    if (updates.status && !VALID_BLOG_STATUSES.has(updates.status)) {
      return res.status(400).json({ success: false, message: 'Invalid post status.' });
    }
    if (updates.flyer_image_url && !isSafeUrl(updates.flyer_image_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid flyer image URL.' });
    }

    const updatedPost = await store.updateBlogPost(id, updates);
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found to update.' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('blog:updated', updatedPost);
      io.emit('blog:changed', { action: 'update', post: updatedPost });
    }

    res.status(200).json({ success: true, message: 'Post updated successfully.', post: updatedPost });
  } catch (err) {
    next(err);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await store.deleteBlogPost(id);

    const io = req.app.get('io');
    if (io) {
      io.emit('blog:deleted', { id });
      io.emit('blog:changed', { action: 'delete', id });
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
