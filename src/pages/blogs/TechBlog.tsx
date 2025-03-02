import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SearchTechBlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BlogPostCard from '@/components/blogs/BlogPostCard';
import BlogSearch, { SortOption, TechBlogOption } from '@/components/blogs/BlogSearch';
import { useTechBlogPosts } from '@/hooks/useTechBlogPosts';

type ViewMode = 'grid' | 'list';

// 검색 컨트롤 컴포넌트
interface SearchControlsProps {
  onSearch: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onTechBlogChange: (blogs: TechBlogOption[]) => void;
  sortOption: SortOption;
  selectedTechBlogs: TechBlogOption[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  onSearch,
  onSortChange,
  onTechBlogChange,
  sortOption,
  selectedTechBlogs,
  viewMode,
  onViewModeChange,
}) => (
  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <BlogSearch
          onSearch={onSearch}
          onSortChange={onSortChange}
          onTechBlogChange={onTechBlogChange}
          sortOption={sortOption}
          selectedTechBlogs={selectedTechBlogs}
        />
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
      <Separator />
    </div>
  </div>
);

// 뷰 모드 토글 컴포넌트
interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => (
  <div className="flex items-center space-x-2 shrink-0">
    <Button
      variant={viewMode === 'grid' ? 'default' : 'outline'}
      size="icon"
      onClick={() => onViewModeChange('grid')}
    >
      <LayoutGrid className="h-4 w-4" />
    </Button>
    <Button
      variant={viewMode === 'list' ? 'default' : 'outline'}
      size="icon"
      onClick={() => onViewModeChange('list')}
    >
      <List className="h-4 w-4" />
    </Button>
  </div>
);

// 블로그 포스트 목록 컴포넌트
interface BlogPostListProps {
  posts: SearchTechBlogPost[];
  viewMode: ViewMode;
  lastPostElementRef: (node: HTMLElement | null) => void;
  loading: boolean;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  viewMode,
  lastPostElementRef,
  loading,
}) => (
  <div className="container mx-auto p-4">
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {posts.map((post, index) => (
        <BlogPostCard
          key={post.id}
          ref={index === posts.length - 1 ? lastPostElementRef : null}
          post={post}
          viewMode={viewMode}
        />
      ))}
    </div>
    {loading && (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )}
  </div>
);

export default function TechBlog() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [selectedTechBlogs, setSelectedTechBlogs] = useState<TechBlogOption[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const observer = useRef<IntersectionObserver>();

  const {
    posts,
    loading,
    hasMore,
    page,
    setPage,
    fetchPosts,
    resetPosts,
  } = useTechBlogPosts();

  const handleSearch = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      resetPosts();
    }, 300);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    resetPosts();
  };

  const handleTechBlogChange = (blogs: TechBlogOption[]) => {
    setSelectedTechBlogs(blogs);
    resetPosts();
  };

  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, setPage]);

  useEffect(() => {
    fetchPosts({ searchQuery, selectedTechBlogs });
  }, [fetchPosts, searchQuery, selectedTechBlogs]);

  return (
    <div className="min-h-screen">
      <SearchControls
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onTechBlogChange={handleTechBlogChange}
        sortOption={sortOption}
        selectedTechBlogs={selectedTechBlogs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <BlogPostList
        posts={posts}
        viewMode={viewMode}
        lastPostElementRef={lastPostElementRef}
        loading={loading}
      />
    </div>
  );
}