import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { axiosInstance } from '@/lib/axios';

interface TechBlog {
  id: number;
  name: string;
  title: string;
  logo: string;
  url: string;
}

export default function Companies() {
  const [techBlogs, setTechBlogs] = useState<TechBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==';
    e.currentTarget.classList.add('p-8', 'opacity-30');
  };

  useEffect(() => {
    const fetchTechBlogs = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/blogs/tech');
        setTechBlogs(response.data);
      } catch (error) {
        console.error('기술 블로그 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">기술 블로그 회사 목록</h1>
        <p className="text-muted-foreground">
          국내 IT 기업들의 기술 블로그 모음입니다. 각 회사의 개발 문화와 기술을 확인해보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techBlogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col">
            <CardHeader>
              <div className="h-32 flex items-center justify-center bg-sky-50 dark:bg-sky-900/30 rounded-lg overflow-hidden">
                <img
                  src={blog.logo}
                  alt={`${blog.title} 로고`}
                  onError={handleImageError}
                  className="max-h-full max-w-full object-contain p-4 transition-all"
                />
              </div>
              <div className="mt-4">
                <CardTitle className="text-center">
                  {blog.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <Button
                className="w-full"
                onClick={() => window.open(blog.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                블로그 방문하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
