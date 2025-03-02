import { useState, useRef, useCallback } from 'react';
import { SearchTechBlogPost, BlogResponse } from '@/types/blog';
import { TechBlogOption } from '@/components/blogs/BlogSearch';
import { axiosInstance } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 12;

export function useTechBlogPosts() {
  const [posts, setPosts] = useState<SearchTechBlogPost[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchPosts = useCallback(async ({
    searchQuery,
    selectedTechBlogs
  }: {
    searchQuery: string;
    selectedTechBlogs: TechBlogOption[];
  }) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<BlogResponse>('/api/v1/blogs', {
        params: {
          title: searchQuery,
          page: page,
          size: ITEMS_PER_PAGE,
          select: selectedTechBlogs.length > 0 ? selectedTechBlogs.join(',') : undefined,
        }
      });

      const newPosts = response.data.content;
      setPosts(prevPosts => page === 0 ? newPosts : [...prevPosts, ...newPosts]);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast({
        variant: "destructive",
        title: "에러 발생",
        description: "게시글을 불러오는데 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  const resetPosts = () => {
    setPage(0);
    setPosts([]);
  };

  return {
    posts,
    loading,
    hasMore,
    page,
    setPage,
    fetchPosts,
    resetPosts,
  };
} 