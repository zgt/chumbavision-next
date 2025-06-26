"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Video {
  id: string;
  url: string;
  source: string;
  createdAt: string;
}

interface VideoFeedProps {
  filterTag?: string;
}

export default function VideoFeed({ filterTag }: VideoFeedProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "up" | "down"
  >("down");
  
  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const lastScrollTime = useRef(0);

  const loadVideos = useCallback(async () => {
    try {
      const url = filterTag ? `/api/videos?tag=${encodeURIComponent(filterTag)}` : "/api/videos";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      const validVideos = data.filter((video): video is Video => {
        const isValid =
          typeof video === "object" &&
          video !== null &&
          typeof video.id === "string" &&
          typeof video.url === "string" &&
          typeof video.source === "string" &&
          typeof video.createdAt === "string";

        if (!isValid) {
          // Skip invalid video objects
        }
        return isValid;
      });

      setVideos(validVideos);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load videos",
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [filterTag]);

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    // Don't handle clicks on video controls
    if (target.tagName === "VIDEO" || target.closest("video")) {
      return;
    }

    const mainContainer = document.querySelector(".relative.w-screen.h-screen");
    if (!mainContainer) return;

    const containerWidth = mainContainer.clientWidth;
    const clickX = event.clientX;
    const isRightClick = clickX > containerWidth / 2;

    if (isRightClick) {
      // Next video
      setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
    } else {
      // Previous video
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Touch event handlers
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const goToNext = useCallback(() => {
    if (isTransitioning || currentIndex >= videos.length - 1) return;

    setIsTransitioning(true);
    setTransitionDirection("down");
    setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, currentIndex, videos.length]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;

    setIsTransitioning(true);
    setTransitionDirection("up");
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, currentIndex]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.x || !touchEnd.x) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    // Vertical swipes for video navigation
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        // Swipe up - next video
        goToNext();
      } else {
        // Swipe down - previous video
        goToPrevious();
      }
    }
    // Horizontal swipes for video navigation (alternative)
    else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe left - next video
        goToNext();
      } else {
        // Swipe right - previous video
        goToPrevious();
      }
    }

    // Reset touch coordinates
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  }, [touchStart, touchEnd, goToNext, goToPrevious]);


  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();

    // Throttle scroll events to prevent too rapid navigation
    const now = Date.now();
    if (now - lastScrollTime.current < 300) return;
    lastScrollTime.current = now;

    if (event.deltaY > 0) {
      // Scrolling down - next video
      goToNext();
    } else if (event.deltaY < 0) {
      // Scrolling up - previous video
      goToPrevious();
    }
  }, [goToNext, goToPrevious]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        goToPrevious();
        break;
      case "ArrowDown":
        event.preventDefault();
        goToNext();
        break;
      case "ArrowLeft":
        event.preventDefault();
        goToPrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        goToNext();
        break;
    }
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

  return (
    <div
      className="relative w-screen h-screen bg-black cursor-pointer"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black overflow-hidden flex justify-center"
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-red-500">Error</h3>
              <p className="mt-2 text-gray-400">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  loadVideos();
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-200">No videos yet</h3>
              <p className="mt-2 text-gray-400">Be the first to submit a video!</p>
              <a
                href="/submit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Video
              </a>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-sm md:max-w-md mx-auto overflow-hidden">
            {videos.map((video, index) => {
              const isCurrent = index === currentIndex;
              const isPrevious = index === currentIndex - 1;
              const isNext = index === currentIndex + 1;

              let translateClass = "";
              let opacityClass = "opacity-0 pointer-events-none";

              if (isCurrent) {
                if (isTransitioning) {
                  translateClass =
                    transitionDirection === "down"
                      ? "translate-y-0 animate-slide-up"
                      : "translate-y-0 animate-slide-down";
                } else {
                  translateClass = "translate-y-0";
                }
                opacityClass = "opacity-100";
              } else if (
                isNext &&
                isTransitioning &&
                transitionDirection === "down"
              ) {
                translateClass = "translate-y-full animate-slide-up";
                opacityClass = "opacity-100";
              } else if (
                isPrevious &&
                isTransitioning &&
                transitionDirection === "up"
              ) {
                translateClass = "-translate-y-full animate-slide-down";
                opacityClass = "opacity-100";
              } else {
                translateClass =
                  index > currentIndex
                    ? "translate-y-full"
                    : "-translate-y-full";
              }

              return (
                <div
                  key={video.id}
                  className={`absolute inset-0 transition-transform duration-500 ease-out ${translateClass} ${opacityClass}`}
                >
                  <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      loop
                      preload="metadata"
                      // webkit-playsinline is not a valid React prop, use playsInline
                    />
                  </div>
                  {/* Bottom overlay with video info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 hover:opacity-100 md:transition-opacity md:duration-300">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-medium truncate">
                          Source: {video.source}
                        </p>
                        <p className="text-xs opacity-75">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}