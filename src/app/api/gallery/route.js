import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_DATA = {
  folders: [
    { id: 'classroom', name: 'Classroom Activities', images: [] },
    { id: 'playground', name: 'Playground Fun', images: [] },
    { id: 'events', name: 'Events & Celebrations', images: [] },
    { id: 'arts-crafts', name: 'Arts & Crafts', images: [] },
  ],
  videos: [],
};

// Helper function to get gallery data
async function getGalleryData() {
  try {
    const { blobs } = await list({ prefix: 'gallery-data.json', limit: 1 });
    
    if (blobs.length === 0) {
      return DEFAULT_DATA;
    }

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return DEFAULT_DATA;
  }
}

// Helper function to save gallery data
async function saveGalleryData(data) {
  try {
    // Delete old blob first
    const { blobs } = await list({ prefix: 'gallery-data.json', limit: 1 });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
    
    // Save new data
    await put('gallery-data.json', JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return true;
  } catch (error) {
    console.error('Error saving gallery data:', error);
    return false;
  }
}

// GET - Fetch gallery data
export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json({
      folders: data.folders || [],
      videos: data.videos || []
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json(DEFAULT_DATA);
  }
}

// POST - Add image, video, or folder
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('POST request:', body);
    
    // Get existing data
    const data = await getGalleryData();
    
    // Create folder
    if (body.type === 'folder') {
      // Check if folder already exists
      const exists = data.folders.some(f => f.id === body.id);
      if (!exists) {
        data.folders.push({
          id: body.id,
          name: body.name,
          images: []
        });
      }
    }
    
    // Add image to folder
    if (body.type === 'image') {
      console.log('Adding image to folder:', body.folderId);
      const folder = data.folders.find(f => f.id === body.folderId);
      if (folder) {
        folder.images.push({
          url: body.url,
          publicId: body.publicId,
          uploadedAt: new Date().toISOString(),
        });
        console.log('Image added. Folder now has', folder.images.length, 'images');
      } else {
        console.error('Folder not found:', body.folderId);
      }
    }
    
    // Add video
    if (body.type === 'video') {
      data.videos.push({
        url: body.videoUrl,
        addedAt: new Date().toISOString(),
      });
    }
    
    // Save data
    const saved = await saveGalleryData(data);
    
    if (saved) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove image, video, or folder
export async function DELETE(request) {
  try {
    const body = await request.json();
    console.log('Delete request:', body);
    
    // Get existing data
    const data = await getGalleryData();
    
    // Delete folder and all its images
    if (body.type === 'folder') {
      const folder = data.folders.find(f => f.id === body.identifier);
      
      if (folder && folder.images) {
        // Delete all images from Cloudinary
        for (const image of folder.images) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
            console.log('Deleted from Cloudinary:', image.publicId);
          } catch (error) {
            console.error('Cloudinary delete error:', error);
          }
        }
      }
      
      // Remove folder
      data.folders = data.folders.filter(f => f.id !== body.identifier);
    }
    
    // Delete single image from folder
    if (body.type === 'image') {
      // Delete from Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(body.identifier);
        console.log('Cloudinary delete result:', result);
      } catch (error) {
        console.error('Cloudinary delete error:', error);
      }
      
      // Remove from folder
      const folder = data.folders.find(f => f.id === body.folderId);
      if (folder) {
        folder.images = folder.images.filter(img => img.publicId !== body.identifier);
        console.log('Image removed. Folder now has', folder.images.length, 'images');
      }
    }
    
    // Delete video
    if (body.type === 'video') {
      data.videos = data.videos.filter(v => v.url !== body.identifier);
    }
    
    // Save updated data
    const saved = await saveGalleryData(data);
    
    if (saved) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
