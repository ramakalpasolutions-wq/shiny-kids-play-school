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

// GET - Fetch gallery data
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'gallery-data.json' });
    
    if (blobs.length === 0) {
      return NextResponse.json(DEFAULT_DATA);
    }

    const latestBlob = blobs[0];
    const response = await fetch(latestBlob.url);
    const data = await response.json();
    
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
    
    // Get existing data
    const { blobs } = await list({ prefix: 'gallery-data.json' });
    let data = DEFAULT_DATA;
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      data = await response.json();
      
      // Delete old blob
      await del(blobs[0].url);
    }
    
    // Create folder
    if (body.type === 'folder') {
      data.folders.push({
        id: body.id,
        name: body.name,
        images: []
      });
    }
    
    // Add image to folder
    if (body.type === 'image') {
      const folder = data.folders.find(f => f.id === body.folderId);
      if (folder) {
        folder.images.push({
          url: body.url,
          publicId: body.publicId,
          uploadedAt: new Date().toISOString(),
        });
      }
    }
    
    // Add video
    if (body.type === 'video') {
      data.videos.push({
        url: body.videoUrl,
        addedAt: new Date().toISOString(),
      });
    }
    
    // Save to blob
    await put('gallery-data.json', JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ success: true });
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
    const { blobs } = await list({ prefix: 'gallery-data.json' });
    let data = DEFAULT_DATA;
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      data = await response.json();
      
      // Delete old blob
      await del(blobs[0].url);
    }
    
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
      }
    }
    
    // Delete video
    if (body.type === 'video') {
      data.videos = data.videos.filter(v => v.url !== body.identifier);
    }
    
    // Save updated data
    await put('gallery-data.json', JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
