"use client";

import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface FilterPopoverProps {
  filterTag: string;
  onFilterChange: (tag: string) => void;
  className?: string;
  iconSize?: number;
  align?: "start" | "center" | "end";
}

export default function FilterPopover({ 
  filterTag, 
  onFilterChange, 
  className = "", 
  iconSize = 20,
  align = "end"
}: FilterPopoverProps) {
  const [inputValue, setInputValue] = useState(filterTag);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setInputValue(filterTag);
  }, [filterTag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onFilterChange('');
  };

  const filterButtonContent = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9"/>
      <line x1="4" x2="20" y1="15" y2="15"/>
      <line x1="10" x2="14" y1="3" y2="21"/>
    </svg>
  );

  const FilterForm = ({ autoFocus = false }: { autoFocus?: boolean }) => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter tag to filter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus={autoFocus}
        className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-400"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Apply Filter
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Clear
        </button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button
            className={`text-white hover:text-gray-300 transition-colors duration-200 ${className}`}
            aria-label="Filter videos by tag"
          >
            {filterButtonContent}
          </button>
        </SheetTrigger>
        <SheetContent 
          side="top" 
          className="bg-black/95 backdrop-blur-sm border-gray-800 border-b"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="text-white text-left">Filter by Tag</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <FilterForm autoFocus={true} />
            {filterTag && (
              <p className="text-sm text-gray-300 mt-2">
                Current filter: <span className="text-gray-200">#{filterTag}</span>
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`text-white hover:text-gray-300 transition-colors duration-200 ${className}`}
          aria-label="Filter videos by tag"
        >
          {filterButtonContent}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-black/90 backdrop-blur-sm border-gray-800" 
        align={align}
        side="bottom"
        sideOffset={4}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Filter by Tag</h4>
            <FilterForm autoFocus={true} />
            {filterTag && (
              <p className="text-sm text-gray-300 mt-2">
                Current filter: <span className="text-gray-200">#{filterTag}</span>
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}