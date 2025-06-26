"use client";

import { useState } from 'react';
import VideoFeed from '@/components/VideoFeed';
import FilterPopover from '@/components/FilterPopover';
import Link from 'next/link';

export default function Home() {
  const [filterTag, setFilterTag] = useState('');

  return (
    <div className="h-screen relative">
      <VideoFeed filterTag={filterTag} />
      
      {/* Enhanced Navigation with Filter */}
      {/* Desktop Sidebar - extends the existing one with filter */}
      <nav className="hidden md:fixed md:flex left-0 top-0 bottom-0 w-16 bg-black/50 backdrop-blur-sm z-50 flex-col items-center py-4">
        <div className="flex-1 flex flex-col items-center space-y-8">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link href="/submit" className="text-white hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
          <FilterPopover 
            filterTag={filterTag} 
            onFilterChange={setFilterTag}
            iconSize={32}
            align="start"
          />
        </div>
        <div className="mt-auto">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - extends the existing one with filter */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-around px-4 border-t border-gray-800">
        <Link href="/" className="flex flex-col items-center justify-center text-white hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <div className="flex flex-col items-center justify-center">
          <FilterPopover 
            filterTag={filterTag} 
            onFilterChange={setFilterTag}
            iconSize={24}
            align="center"
          />
          <span className="text-xs mt-1 text-white">Filter</span>
        </div>
        <Link href="/submit" className="flex flex-col items-center justify-center text-white hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs mt-1">Submit</span>
        </Link>
      </nav>
    </div>
  );
}