import { NextResponse } from 'next/server';
import { utapi } from '@/server/uploadthing';

interface UploadThingFile {
  key: string;
  name: string;
  status: 'Deletion Pending' | 'Failed' | 'Uploaded' | 'Uploading';
  uploadedAt: number;
}

export async function GET() {
  try {
    // Get all files from UploadThing
    const listFilesResponse = await utapi.listFiles();

    if (!listFilesResponse || !listFilesResponse.files) {
      throw new Error('Invalid response from UploadThing listFiles');
    }

    const { files } = listFilesResponse;
    
    // Filter for video files and get their URLs
    const videoFiles = files.filter((file: UploadThingFile) => {
      const isVideo = file.name.toLowerCase().endsWith('.mp4') || 
        file.name.toLowerCase().endsWith('.mov') ||
        file.name.toLowerCase().endsWith('.webm');
      return isVideo;
    });

    if (videoFiles.length === 0) {
      return NextResponse.json(
        [],
        { 
          status: 200,
        }
      );
    }

    const videoUrls = await utapi.getFileUrls(videoFiles.map(file => file.key));

    if (!videoUrls || !videoUrls.data) {
      throw new Error('Invalid response from UploadThing getFileUrls');
    }

    // Map the files to our video format
    const videos = videoFiles.map((file: UploadThingFile, index: number) => {
      if (!videoUrls.data[index] || !videoUrls.data[index].url) {
        throw new Error(`Missing URL for file ${file.key}`);
      }

      // Extract platform from filename if available
      const getPlatformFromFilename = (filename: string): string => {
        if (filename.includes('tiktok_')) return 'TikTok';
        if (filename.includes('instagram_')) return 'Instagram';
        return 'UploadThing';
      };

      const video = {
        id: file.key,
        url: videoUrls.data[index].url,
        source: getPlatformFromFilename(file.name),
        createdAt: new Date(file.uploadedAt).toISOString(),
      };
      return video;
    });

    return NextResponse.json(
      videos,
      { 
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'Error';

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        type: errorName
      },
      { 
        status: 500,
      }
    );
  }
}
