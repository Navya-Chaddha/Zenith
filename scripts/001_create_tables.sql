-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID NOT NULL,
  language TEXT DEFAULT 'en',
  read_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog_reads table for tracking unique reads
CREATE TABLE IF NOT EXISTS public.blog_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(blog_id, user_id)
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_reads ENABLE ROW LEVEL SECURITY;

-- Blogs: everyone can read published blogs
CREATE POLICY "blogs_select_published" ON public.blogs
  FOR SELECT USING (published = true);

-- Blogs: author can see all their blogs (including drafts)
CREATE POLICY "blogs_select_own" ON public.blogs
  FOR SELECT USING (auth.uid() = author_id);

-- Blogs: author can insert their own blogs
CREATE POLICY "blogs_insert_own" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Blogs: author can update their own blogs
CREATE POLICY "blogs_update_own" ON public.blogs
  FOR UPDATE USING (auth.uid() = author_id);

-- Blogs: author can delete their own blogs
CREATE POLICY "blogs_delete_own" ON public.blogs
  FOR DELETE USING (auth.uid() = author_id);

-- Blog reads: authenticated users can insert their own read
CREATE POLICY "blog_reads_insert" ON public.blog_reads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blog reads: author can see reads on their blogs
CREATE POLICY "blog_reads_select" ON public.blog_reads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.blogs 
      WHERE blogs.id = blog_reads.blog_id 
      AND blogs.author_id = auth.uid()
    )
  );

-- Blog reads: users can see their own reads
CREATE POLICY "blog_reads_select_own" ON public.blog_reads
  FOR SELECT USING (auth.uid() = user_id);
