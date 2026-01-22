'use client';
import { useState, useEffect } from 'react';
import GalleryGrid from '@/components/GalleryGrid';
import Image from 'next/image';

export default function Gallery() {
  const [galleryData, setGalleryData] = useState({ folders: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState(null);
  const [viewMode, setViewMode] = useState('folders'); // 'folders', 'images', 'videos'

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setGalleryData(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFolderImages = (folderId) => {
    if (!galleryData.folders) return [];
    const folder = galleryData.folders.find(f => f.id === folderId);
    return folder ? folder.images : [];
  };

  const getTotalImages = () => {
    if (!galleryData.folders) return 0;
    return galleryData.folders.reduce((total, folder) => total + folder.images.length, 0);
  };

  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
    setViewMode('images');
  };

  const handleBackToFolders = () => {
    setActiveFolder(null);
    setViewMode('folders');
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#14B8A6] to-[#84CC16] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Our Gallery 📸
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow">
            Glimpses of joy, learning, and fun at Shiny Kids
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#14B8A6] border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading gallery...</p>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleBackToFolders}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-110 ${
                  viewMode === 'folders'
                    ? 'bg-[#14B8A6] text-white shadow-xl'
                    : 'bg-white text-gray-700 border-2 border-[#14B8A6] hover:bg-[#F0FDFA]'
                }`}
              >
                📁 Events ({galleryData.folders ? galleryData.folders.length : 0})
              </button>

              {galleryData.videos && galleryData.videos.length > 0 && (
                <button
                  onClick={() => setViewMode('videos')}
                  className={`px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-110 ${
                    viewMode === 'videos'
                      ? 'bg-[#84CC16] text-white shadow-xl'
                      : 'bg-white text-gray-700 border-2 border-[#84CC16] hover:bg-[#F7FEE7]'
                  }`}
                >
                  📹 Videos ({galleryData.videos.length})
                </button>
              )}
            </div>

            {/* Breadcrumb */}
            {viewMode === 'images' && activeFolder && (
              <div className="mb-6 flex items-center space-x-2 text-lg">
                <button
                  onClick={handleBackToFolders}
                  className="text-[#14B8A6] hover:text-[#0F766E] font-semibold transition"
                >
                  📁 Folders
                </button>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 font-semibold">
                  {galleryData.folders.find(f => f.id === activeFolder)?.name}
                </span>
              </div>
            )}

            {/* Folders Grid View */}
            {viewMode === 'folders' && (
              <div>
                <h2 className="text-3xl font-bold text-[#14B8A6] mb-6 text-center">
                  Photo Albums 📚
                </h2>
                
                {galleryData.folders && galleryData.folders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryData.folders.map((folder) => (
                      <div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.id)}
                        className="group cursor-pointer bg-white rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:border-[#84CC16] hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 transform"
                      >
                        {/* Folder Thumbnail */}
                        <div className="relative h-64 bg-gradient-to-br from-[#F0FDFA] to-[#F7FEE7] overflow-hidden">
                          {folder.images && folder.images.length > 0 ? (
                            <Image
                              src={folder.images[0].url}
                              alt={folder.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-8xl opacity-30">📁</div>
                            </div>
                          )}
                          
                          {/* Image count badge */}
                          <div className="absolute top-4 right-4 bg-[#14B8A6] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            {folder.images.length} 📷
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <p className="text-lg font-bold">🔍 View Photos</p>
                            </div>
                          </div>
                        </div>

                        {/* Folder Info */}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-[#14B8A6] mb-2 group-hover:text-[#84CC16] transition-colors">
                            📁 {folder.name}
                          </h3>
                          <p className="text-gray-600">
                            {folder.images.length} {folder.images.length === 1 ? 'photo' : 'photos'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-gray-600 text-lg">No folders created yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Images View */}
            {viewMode === 'images' && activeFolder && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-[#14B8A6]">
                    📸 {galleryData.folders.find(f => f.id === activeFolder)?.name}
                  </h2>
                  <button
                    onClick={handleBackToFolders}
                    className="bg-[#14B8A6] text-white px-6 py-3 rounded-full hover:bg-[#0F766E] transition font-bold"
                  >
                    ← Back to Folders
                  </button>
                </div>

                {getFolderImages(activeFolder).length > 0 ? (
                  <GalleryGrid images={getFolderImages(activeFolder)} videos={[]} />
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4 animate-bounce">📷</div>
                    <p className="text-gray-600 text-lg">No photos in this folder yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Videos View */}
            {viewMode === 'videos' && (
              <div>
                <h2 className="text-3xl font-bold text-[#84CC16] mb-6 text-center">
                  YouTube Videos ({galleryData.videos ? galleryData.videos.length : 0})
                </h2>
                {galleryData.videos && galleryData.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {galleryData.videos.map((video, index) => (
                      <div 
                        key={index} 
                        className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-[#84CC16]" 
                        style={{ paddingBottom: '56.25%' }}
                      >
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={getYouTubeEmbedUrl(video.url)}
                          title={`Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No videos available yet</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getYouTubeEmbedUrl(url) {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]*)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
