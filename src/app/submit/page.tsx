import VideoSubmit from '@/components/VideoSubmit';

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Submit a Video</h1>
          <p className="text-gray-400 text-sm md:text-base">Share your favorite TikTok or Instagram Reels</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
          <VideoSubmit />
        </div>
      </div>
    </div>
  );
}
