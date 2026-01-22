'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-[#14B8A6] to-[#84CC16] py-16 relative overflow-hidden"
      >
        {/* Floating emojis background */}
        <motion.div
          className="absolute inset-0 text-6xl opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="absolute top-10 left-10">📸</div>
          <div className="absolute top-20 right-20">🎨</div>
          <div className="absolute bottom-10 left-20">🌟</div>
          <div className="absolute bottom-20 right-10">✨</div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            Our Gallery 📸
          </motion.h1>
          <p className="text-xl md:text-2xl text-white drop-shadow">
            Glimpses of joy, learning, and fun at Shiny Kids
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block rounded-full h-16 w-16 border-4 border-[#14B8A6] border-t-transparent"
            />
            <p className="mt-4 text-gray-600 text-lg">Loading gallery...</p>
          </motion.div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-wrap gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToFolders}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  viewMode === 'folders'
                    ? 'bg-[#14B8A6] text-white shadow-xl'
                    : 'bg-white text-gray-700 border-2 border-[#14B8A6] hover:bg-[#F0FDFA]'
                }`}
              >
                📁 Events ({galleryData.folders ? galleryData.folders.length : 0})
              </motion.button>

              {galleryData.videos && galleryData.videos.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('videos')}
                  className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                    viewMode === 'videos'
                      ? 'bg-[#84CC16] text-white shadow-xl'
                      : 'bg-white text-gray-700 border-2 border-[#84CC16] hover:bg-[#F7FEE7]'
                  }`}
                >
                  📹 Videos ({galleryData.videos.length})
                </motion.button>
              )}
            </motion.div>

            {/* Breadcrumb */}
            <AnimatePresence>
              {viewMode === 'images' && activeFolder && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6 flex items-center space-x-2 text-lg"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Folders Grid View */}
            <AnimatePresence mode="wait">
              {viewMode === 'folders' && (
                <motion.div
                  key="folders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#14B8A6] mb-6 text-center"
                  >
                    Photo Albums 📚
                  </motion.h2>
                  
                  {galleryData.folders && galleryData.folders.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {galleryData.folders.map((folder) => (
                        <motion.div
                          key={folder.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFolderClick(folder.id)}
                          className="group cursor-pointer bg-white rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:border-[#84CC16] hover:shadow-2xl transition-all duration-300 overflow-hidden"
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
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="text-8xl opacity-30"
                                >
                                  📁
                                </motion.div>
                              </div>
                            )}
                            
                            {/* Image count badge */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                              className="absolute top-4 right-4 bg-[#14B8A6] text-white px-4 py-2 rounded-full font-bold shadow-lg"
                            >
                              {folder.images.length} 📷
                            </motion.div>

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
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        📁
                      </motion.div>
                      <p className="text-gray-600 text-lg">No folders created yet</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Images View */}
              {viewMode === 'images' && activeFolder && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-3xl font-bold text-[#14B8A6]"
                    >
                      📸 {galleryData.folders.find(f => f.id === activeFolder)?.name}
                    </motion.h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBackToFolders}
                      className="bg-[#14B8A6] text-white px-6 py-3 rounded-full hover:bg-[#0F766E] transition font-bold"
                    >
                      ← Back to Folders
                    </motion.button>
                  </div>

                  {getFolderImages(activeFolder).length > 0 ? (
                    <GalleryGrid images={getFolderImages(activeFolder)} videos={[]} />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        📷
                      </motion.div>
                      <p className="text-gray-600 text-lg">No photos in this folder yet</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Videos View */}
              {viewMode === 'videos' && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-[#84CC16] mb-6 text-center"
                  >
                    📹 YouTube Videos ({galleryData.videos ? galleryData.videos.length : 0})
                  </motion.h2>
                  {galleryData.videos && galleryData.videos.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {galleryData.videos.map((video, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-[#84CC16]"
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
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        📹
                      </motion.div>
                      <p className="text-gray-600 text-lg">No videos available yet</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
