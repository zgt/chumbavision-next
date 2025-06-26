"use client";

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onFilterChange('');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`text-white hover:text-gray-300 transition-colors duration-200 ${className}`}
          aria-label="Filter videos by tag"
        >
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
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-black/90 backdrop-blur-sm border-gray-800" 
        align={align}
        side={isMobile ? "top" : "bottom"}
        sideOffset={isMobile ? 20 : 4}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Filter by Tag</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Enter tag to filter..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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