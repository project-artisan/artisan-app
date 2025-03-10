import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTechBlogList } from '@/hooks/useTechBlogList';

export type SortOption = 'latest' | 'oldest' | 'popular';
export type TechBlogOption = string;

interface BlogSearchProps {
  onSearch: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onTechBlogChange: (blogs: TechBlogOption[]) => void;
  sortOption: SortOption;
  selectedTechBlogs: TechBlogOption[];
}

export default function BlogSearch({
  onSearch,
  onSortChange,
  onTechBlogChange,
  sortOption,
  selectedTechBlogs,
}: BlogSearchProps) {
  const { techBlogs, loading } = useTechBlogList();
  const [open, setOpen] = useState(false);

  const handleTechBlogToggle = (blogName: string) => {
    if (selectedTechBlogs.includes(blogName)) {
      onTechBlogChange(selectedTechBlogs.filter(name => name !== blogName));
    } else {
      onTechBlogChange([...selectedTechBlogs, blogName]);
    }
  };

  return (
    <div className="flex flex-1 items-center gap-4">
      <Input
        placeholder="검색어를 입력하세요"
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-[200px] justify-between"
            disabled={loading}
          >
            {selectedTechBlogs.length > 0 
              ? `${selectedTechBlogs.length}개 선택됨`
              : "기술 블로그 선택"}
            <Check className={`ml-2 h-4 w-4 ${selectedTechBlogs.length > 0 ? 'opacity-100' : 'opacity-0'}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            <div className="grid gap-1 p-2">
              {techBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent"
                >
                  <Checkbox
                    checked={selectedTechBlogs.includes(blog.name)}
                    onCheckedChange={() => handleTechBlogToggle(blog.name)}
                  />
                  <label className="flex-grow cursor-pointer text-sm">
                    {blog.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
