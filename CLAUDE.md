# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server with Turbopack at localhost:3000
npm run build    # Build production application
npm run start    # Start production server
npm run lint     # Run ESLint for code quality checks
```

## Architecture Overview

**ChumbaVision Next** is a TikTok-style video sharing platform built with Next.js App Router that allows users to submit social media video URLs (TikTok/Instagram) which are then scraped, downloaded, and hosted for viewing in a mobile-first feed interface.

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **File Storage**: UploadThing for video hosting and management
- **Video Scraping**: Apify Client for TikTok/Instagram video extraction

### Core Architecture Components

**Video Processing Pipeline:**
1. **Video Submission** (`src/components/VideoSubmit.tsx`): Form component that validates TikTok/Instagram URLs and optional tags
2. **API Submit Route** (`src/app/api/submit/route.ts`): Processes video submissions by calling VideoScraper and VideoUploader services
3. **Video Scraper Service** (`src/services/videoScraper.ts`): Uses Apify API to extract video metadata and download URLs from social media platforms
4. **Video Uploader Service** (`src/services/videoUploader.ts`): Downloads video files and uploads them to UploadThing with proper metadata
5. **API Videos Route** (`src/app/api/videos/route.ts`): Fetches stored videos from UploadThing with optional tag filtering
6. **Video Feed Component** (`src/components/VideoFeed.tsx`): Mobile-first video player with TikTok-style navigation (swipe, scroll, keyboard controls)

**Key Features:**
- Mobile-first vertical video feed with transition animations
- Multi-input navigation: touch gestures, scroll wheel, keyboard (WASD/arrow keys), click-to-navigate
- Tag-based filtering system for video organization
- Responsive design supporting both desktop and mobile interfaces
- Real-time video processing from social media URLs

### File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── submit/route.ts      # Video submission endpoint
│   │   ├── videos/route.ts      # Video retrieval endpoint  
│   │   └── uploadthing/core.ts  # UploadThing server config
│   ├── page.tsx                 # Main video feed page with filtering
│   └── submit/page.tsx          # Video submission page
├── components/
│   ├── VideoFeed.tsx            # TikTok-style feed with navigation
│   └── VideoSubmit.tsx          # URL submission form with validation
├── services/
│   ├── videoScraper.ts          # Apify-based video scraping
│   └── videoUploader.ts         # UploadThing video upload handling
├── lib/uploadthing.ts           # Client-side UploadThing utilities
└── server/uploadthing.ts        # Server-side UploadThing configuration
```

### Environment Variables
Required for full functionality:
- `UPLOADTHING_SECRET` - UploadThing API secret key
- `UPLOADTHING_APP_ID` - UploadThing application identifier  
- `APIFY_TOKEN` - Apify API token for video scraping services

### Development Notes
- Uses Next.js 15 App Router with TypeScript strict mode
- Tailwind CSS with custom animations for video transitions
- Error handling includes platform-specific video scraping errors
- Video size limits: 50MB for download, 512MB for UploadThing storage
- Supports both data URLs and HTTP video URLs for upload flexibility
- Tag filtering implemented at both API and UI levels