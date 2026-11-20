import { store } from '../database/store.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const { category, type, status, search } = req.query;
    
    // Non-admin users can only view published posts
    const isAdmin = req.user && (req.user.role === 'superadmin' || req.user.role === 'admin');
    const effectiveStatus = isAdmin ? (status || 'all') : 'published';

    let posts = await store.getBlogPosts({
      category,
      type,
      status: effectiveStatus
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      posts = posts.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.author_name && p.author_name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (err) {
    next(err);
  }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let post = await store.getBlogPostBySlug(idOrSlug);
    if (!post) {
      post = await store.getBlogPostById(idOrSlug);
    }

    if (!post) {
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
      title,
      slug,
      category,
      type = 'article',
      excerpt,
      content,
      flyer_image_url,
      author_name,
      author_role,
      read_time,
      tags,
      status = 'published',
      featured = false
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Post title is required.' });
    }

    const newPost = await store.createBlogPost({
      title: title.trim(),
      slug,
      category,
      type,
      excerpt,
      content,
      flyer_image_url,
      author_name: author_name || (req.user ? req.user.full_name : 'Beacon Bridge Academics'),
      author_role: author_role || 'Curriculum Lead',
      read_time,
      tags,
      status,
      featured
    });

    // Broadcast real-time event to all connected clients & public blog visitors
    const io = req.app.get('io');
    if (io) {
      io.emit('blog:created', newPost);
      io.emit('blog:changed', { action: 'create', post: newPost });
      console.log(`📡 [SOCKET] Real-time blog post broadcast: "${newPost.title}" (${newPost.type})`);
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
    const updatedPost = await store.updateBlogPost(id, req.body);

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found to update.' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('blog:updated', updatedPost);
      io.emit('blog:changed', { action: 'update', post: updatedPost });
      console.log(`📡 [SOCKET] Real-time blog update broadcast: "${updatedPost.title}"`);
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      post: updatedPost
    });
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
      console.log(`📡 [SOCKET] Real-time blog delete broadcast: ${id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};
