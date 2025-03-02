import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

interface TechBlog {
  id: number;
  name: string;
  title: string;
  logo: string;
  url: string;
}

export function useTechBlogList() {
  const [techBlogs, setTechBlogs] = useState<TechBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTechBlogs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<TechBlog[]>('/api/v1/blogs/tech');
        setTechBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch tech blogs:', error);
        toast({
          variant: "destructive",
          title: "에러 발생",
          description: "기술 블로그 목록을 불러오는데 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTechBlogs();
  }, [toast]);

  return { techBlogs, loading };
} 