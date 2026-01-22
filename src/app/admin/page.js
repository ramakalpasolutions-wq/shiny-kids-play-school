'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hero');
  const [heroImages, setHeroImages] = useState([]);
  const [galleryData, setGalleryData] = useState({ folders: [], videos: [] });
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderForm, setShowFolderForm] = useState(false);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]*)/);
    return match ? match[1] : null;
  };

  // Show confirmation modal
  const showConfirmation = (title, message, onConfirm) => {
    setConfirmModal({
      show: true,
      title,
      message,
      onConfirm,
    });
  };

  // Hide confirmation modal
  const hideConfirmation = () => {
    setConfirmModal({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
    });
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    hideConfirmation();
  };

  useEffect(() => {
    // Check authentication
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    fetchHeroImages();
    fetchGalleryData();
  }, [router]);

  const fetchHeroImages = async () => {
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      setHeroImages(data.images || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast.error('Failed to load hero images');
    }
  };

  const fetchGalleryData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setGalleryData(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery data');
    }
  };

  const handleHeroUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadingToast = toast.loading(`Uploading ${files.length} image(s)...`);
    
    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'shiny-kids/hero');

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadRes.json();

          if (uploadData.success) {
            const saveRes = await fetch('/api/hero', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: uploadData.url,
                publicId: uploadData.publicId,
              }),
            });

            if (saveRes.ok) {
              successCount++;
              toast.loading(`Uploaded ${successCount}/${files.length}...`, { id: uploadingToast });
            } else {
              failCount++;
            }
          } else {
            failCount++;
          }
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          failCount++;
        }
      }

      toast.dismiss(uploadingToast);
      
      if (successCount > 0 && failCount === 0) {
        toast.success(`✅ Successfully uploaded ${successCount} image(s)!`);
      } else if (successCount > 0 && failCount > 0) {
        toast.success(`✅ Uploaded ${successCount} image(s), ${failCount} failed`, { duration: 5000 });
      } else {
        toast.error(`❌ Failed to upload images`);
      }
      
      fetchHeroImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss(uploadingToast);
      toast.error('❌ Upload failed!');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name!');
      return;
    }

    const loadingToast = toast.loading('Creating folder...');
    
    try {
      const folderId = newFolderName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'folder',
          id: folderId,
          name: newFolderName,
        }),
      });

      toast.dismiss(loadingToast);
      
      if (res.ok) {
        toast.success(`✅ Folder "${newFolderName}" created!`);
        setNewFolderName('');
        setShowFolderForm(false);
        fetchGalleryData();
      } else {
        toast.error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to create folder!');
    }
  };

  const handleGalleryImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (!selectedFolder) {
      toast.error('Please select a folder first!');
      return;
    }

    setUploading(true);
    const uploadingToast = toast.loading(`Uploading ${files.length} image(s)...`);
    
    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', `shiny-kids/gallery/${selectedFolder}`);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadRes.json();

          if (uploadData.success) {
            const saveRes = await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'image',
                url: uploadData.url,
                publicId: uploadData.publicId,
                folderId: selectedFolder,
              }),
            });

            if (saveRes.ok) {
              successCount++;
              toast.loading(`Uploaded ${successCount}/${files.length}...`, { id: uploadingToast });
            } else {
              failCount++;
            }
          } else {
            failCount++;
          }
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          failCount++;
        }
      }

      toast.dismiss(uploadingToast);
      
      if (successCount > 0 && failCount === 0) {
        toast.success(`✅ Successfully uploaded ${successCount} image(s)!`);
      } else if (successCount > 0 && failCount > 0) {
        toast.success(`✅ Uploaded ${successCount} image(s), ${failCount} failed`, { duration: 5000 });
      } else {
        toast.error(`❌ Failed to upload images`);
      }
      
      fetchGalleryData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss(uploadingToast);
      toast.error('❌ Upload failed!');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    const loadingToast = toast.loading('Adding video...');
    
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video',
          videoUrl: videoUrl,
        }),
      });

      toast.dismiss(loadingToast);
      
      if (res.ok) {
        toast.success('✅ Video added successfully!');
        setVideoUrl('');
        fetchGalleryData();
      } else {
        toast.error('Failed to add video');
      }
    } catch (error) {
      console.error('Error adding video:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to add video!');
    }
  };

  const handleDeleteHeroImage = (publicId) => {
    showConfirmation(
      'Delete Hero Image',
      'Are you sure you want to delete this hero image? This action cannot be undone.',
      async () => {
        const loadingToast = toast.loading('Deleting image...');
        
        try {
          const res = await fetch('/api/hero', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });

          toast.dismiss(loadingToast);
          
          if (res.ok) {
            toast.success('✅ Image deleted!');
            fetchHeroImages();
          } else {
            toast.error('Failed to delete image');
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to delete image');
        }
      }
    );
  };

  const handleDeleteGalleryImage = (publicId, folderId) => {
    showConfirmation(
      'Delete Gallery Image',
      'Are you sure you want to delete this image? This action cannot be undone.',
      async () => {
        const loadingToast = toast.loading('Deleting image...');
        
        try {
          const res = await fetch('/api/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'image', identifier: publicId, folderId }),
          });

          toast.dismiss(loadingToast);
          
          if (res.ok) {
            toast.success('✅ Image deleted!');
            fetchGalleryData();
          } else {
            toast.error('Failed to delete image');
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to delete image');
        }
      }
    );
  };

  const handleDeleteFolder = (folderId) => {
    const folder = galleryData.folders.find(f => f.id === folderId);
    const imageCount = folder ? folder.images.length : 0;
    
    showConfirmation(
      'Delete Folder',
      `Are you sure you want to delete the folder "${folder.name}"?${imageCount > 0 ? ` This will permanently delete all ${imageCount} image(s) in this folder.` : ''} This action cannot be undone.`,
      async () => {
        const loadingToast = toast.loading('Deleting folder...');
        
        try {
          const res = await fetch('/api/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'folder', identifier: folderId }),
          });

          toast.dismiss(loadingToast);
          
          if (res.ok) {
            toast.success('✅ Folder deleted!');
            fetchGalleryData();
          } else {
            toast.error('Failed to delete folder');
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to delete folder');
        }
      }
    );
  };

  const handleDeleteVideo = (url) => {
    showConfirmation(
      'Delete Video',
      'Are you sure you want to delete this video? This action cannot be undone.',
      async () => {
        const loadingToast = toast.loading('Deleting video...');
        
        try {
          const res = await fetch('/api/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'video', identifier: url }),
          });

          toast.dismiss(loadingToast);
          
          if (res.ok) {
            toast.success('✅ Video deleted!');
            fetchGalleryData();
          } else {
            toast.error('Failed to delete video');
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to delete video');
        }
      }
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA]">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#14B8A6',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              {confirmModal.title}
            </h3>
            
            <p className="text-gray-600 text-center mb-8">
              {confirmModal.message}
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={hideConfirmation}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#14B8A6] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="text-4xl mr-3">⚙️</span>
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <a href="/" className="hover:text-[#84CC16] transition font-semibold">
                🏠 View Site
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 transition font-semibold"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition ${
              activeTab === 'hero'
                ? 'bg-[#14B8A6] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🖼️ Hero Images
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition ${
              activeTab === 'gallery'
                ? 'bg-[#14B8A6] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📸 Gallery
          </button>
        </div>

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] mb-8">
              <h2 className="text-2xl font-bold text-[#14B8A6] mb-6">Upload Hero Images</h2>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHeroUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className={`${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#84CC16] hover:bg-[#65A30D]'} text-white px-8 py-4 rounded-2xl text-center font-bold transition`}>
                    {uploading ? '📤 Uploading...' : '📁 Choose Images (Multiple)'}
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6]">
              <h2 className="text-2xl font-bold text-[#14B8A6] mb-6">
                Current Hero Images ({heroImages.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <button
                      onClick={() => handleDeleteHeroImage(image.publicId)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition font-bold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
              {heroImages.length === 0 && (
                <p className="text-gray-500 text-center py-8">No hero images uploaded yet</p>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab - Same structure, just using the updated delete functions */}
        {activeTab === 'gallery' && (
          <div>
            {/* Create New Folder */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#84CC16]">📁 Manage Folders</h2>
                <button
                  onClick={() => setShowFolderForm(!showFolderForm)}
                  className="bg-[#84CC16] text-white px-6 py-2 rounded-full hover:bg-[#65A30D] transition font-bold"
                >
                  {showFolderForm ? '❌ Cancel' : '➕ New Folder'}
                </button>
              </div>

              {showFolderForm && (
                <div className="mt-4 p-6 bg-[#F7FEE7] rounded-2xl">
                  <label className="block text-gray-800 font-bold mb-2">Folder Name:</label>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g., Summer Activities"
                      className="flex-1 px-5 py-3 border-2 border-[#84CC16] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="bg-[#14B8A6] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0F766E] transition"
                    >
                      ✅ Create
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-gray-600 mb-3">
                  <strong>Current Folders ({galleryData.folders ? galleryData.folders.length : 0}):</strong>
                </p>
                <div className="flex flex-wrap gap-3">
                  {galleryData.folders && galleryData.folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white px-4 py-2 rounded-full border-2 border-[#84CC16] text-gray-700 font-semibold"
                    >
                      📁 {folder.name} ({folder.images.length})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Gallery Image to Folder */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] mb-8">
              <h2 className="text-2xl font-bold text-[#14B8A6] mb-6">Upload Images to Folder</h2>
              
              <div className="mb-4">
                <label className="block text-gray-800 font-bold mb-2">Select Folder:</label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#14B8A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84CC16]"
                >
                  <option value="">Choose a folder...</option>
                  {galleryData.folders && galleryData.folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      📁 {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                  disabled={uploading || !selectedFolder}
                />
                <div className={`${!selectedFolder || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#84CC16] hover:bg-[#65A30D]'} text-white px-8 py-4 rounded-2xl text-center font-bold transition`}>
                  {uploading ? '📤 Uploading...' : selectedFolder ? '📁 Choose Images (Multiple)' : '⚠️ Select a folder first'}
                </div>
              </label>
            </div>

            {/* Add YouTube Video */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] mb-8">
              <h2 className="text-2xl font-bold text-[#84CC16] mb-6">Add YouTube Video</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube URL here"
                  className="flex-1 px-5 py-4 border-3 border-[#84CC16] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14B8A6] text-lg"
                />
                <button
                  onClick={handleAddVideo}
                  className="bg-[#84CC16] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#65A30D] transition"
                >
                  ➕ Add Video
                </button>
              </div>
            </div>

            {/* Display Folders with Images */}
            {galleryData.folders && galleryData.folders.map((folder) => (
              <div key={folder.id} className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#14B8A6]">
                    📁 {folder.name} ({folder.images.length})
                  </h2>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition font-bold"
                  >
                    🗑️ Delete Folder
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folder.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`${folder.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      <button
                        onClick={() => handleDeleteGalleryImage(image.publicId, folder.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
                {folder.images.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No images in this folder yet</p>
                )}
              </div>
            ))}

            {/* Gallery Videos with Thumbnails */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#84CC16]">
              <h2 className="text-2xl font-bold text-[#84CC16] mb-6">
                📹 YouTube Videos ({galleryData.videos ? galleryData.videos.length : 0})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryData.videos && galleryData.videos.map((video, index) => {
                  const videoId = getYouTubeVideoId(video.url);
                  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
                  
                  return (
                    <div key={index} className="relative group">
                      {thumbnailUrl ? (
                        <div className="relative">
                          <img
                            src={thumbnailUrl}
                            alt={`Video ${index + 1}`}
                            className="w-full h-48 object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-2xl opacity-0 group-hover:opacity-100 transition truncate">
                            {video.url}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-2xl flex items-center justify-center">
                          <p className="text-gray-500">No thumbnail</p>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-3 py-2 rounded-full font-bold hover:bg-blue-600 transition text-sm"
                        >
                          🔗 Open
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(video.url)}
                          className="bg-red-500 text-white px-3 py-2 rounded-full font-bold hover:bg-red-600 transition text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(!galleryData.videos || galleryData.videos.length === 0) && (
                <p className="text-gray-500 text-center py-8">No videos added yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
