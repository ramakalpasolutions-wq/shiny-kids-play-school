import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

const DEFAULT_DATA = {
  folders: [
    { id: 'classroom', name: 'Classroom Activities', images: [] },
    { id: 'playground', name: 'Playground Fun', images: [] },
    { id: 'events', name: 'Events & Celebrations', images: [] },
    { id: 'arts-crafts', name: 'Arts & Crafts', images: [] },
  ],
  videos: [],
};

// Ensure data directory and file exist
async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(GALLERY_FILE);
  } catch {
    await fs.writeFile(GALLERY_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

// Read gallery data
async function readGalleryData() {
  await ensureFiles();
  const raw = await fs.readFile(GALLERY_FILE, 'utf8');
  const data = JSON.parse(raw);
  return {
    folders: data.folders || DEFAULT_DATA.folders,
    videos: data.videos || []
  };
}

// Write gallery data
async function writeGalleryData(data) {
  await ensureFiles();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET - Fetch gallery data
export async function GET() {
  try {
    const data = await readGalleryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json(DEFAULT_DATA, { status: 500 });
  }
}

// POST - Add image, video, or folder
export async function POST(request) {
  try {
    const body = await request.json();
    const data = await readGalleryData();
    
    // Create folder
    if (body.type === 'folder') {
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
    
    await writeGalleryData(data);
    
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
    
    const data = await readGalleryData();
    
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
    
    await writeGalleryData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
