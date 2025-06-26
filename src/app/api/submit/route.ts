import { NextResponse } from 'next/server';
import { VideoScraper } from '../../../services/videoScraper';
import { VideoUploader } from '../../../services/videoUploader';

export async function POST(request: Request) {
  const scraper = new VideoScraper();
  
  try {
    const { url, tags } = await request.json();
    console.log('Processing video submission for URL:', url);
    
    // Validate URL
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/[^\s]*$/;
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/[^\s]*$/;
    
    if (!tiktokRegex.test(url) && !instagramRegex.test(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Only TikTok and Instagram URLs are supported.' },
        { status: 400 }
      );
    }

    // Initialize browser for scraping
    console.log('Initializing video scraper...');
    await scraper.init();

    // Scrape video metadata and URL
    console.log('Scraping video metadata...');
    const videoMetadata = await scraper.scrapeVideo(url);
    
    if (!videoMetadata.videoUrl) {
      throw new Error('Could not extract video URL from the provided link');
    }

    console.log('Video metadata extracted:', {
      platform: videoMetadata.platform,
      title: videoMetadata.title,
      author: videoMetadata.author,
      hasVideoUrl: !!videoMetadata.videoUrl,
      hasBuffer: !!videoMetadata.videoBuffer
    });

    // Upload video to UploadThing
    console.log('Uploading video to UploadThing...');
    const uploader = new VideoUploader();
    const uploadResult = await uploader.uploadVideoFromUrl(videoMetadata.videoUrl, url, videoMetadata.videoBuffer, tags);
    
    console.log('Video uploaded successfully:', {
      fileId: uploadResult.fileId,
      fileSize: uploadResult.fileSize
    });

    // Return success response with metadata
    return NextResponse.json(
      {
        success: true,
        message: 'Video uploaded successfully',
        data: {
          fileId: uploadResult.fileId,
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          metadata: {
            title: videoMetadata.title,
            author: videoMetadata.author,
            platform: videoMetadata.platform,
            originalUrl: url
          }
        }
      },
      { 
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Error processing video submission:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = errorMessage.includes('Invalid URL') ? 400 :
                      errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('timeout') ? 408 :
                      errorMessage.includes('too large') ? 413 : 500;

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { 
        status: statusCode,
      }
    );
  } finally {
    // Always close the browser
    try {
      await scraper.close();
    } catch (closeError) {
      console.error('Error closing scraper:', closeError);
    }
  }
}
