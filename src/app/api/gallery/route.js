import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/galleryContent.json');

// Initialize default structure if file doesn't exist
function initializeGalleryData() {
  const defaultData = {
    folders: [
      { id: 'classroom', name: 'Classroom Activities', images: [] },
      { id: 'playground', name: 'Playground Fun', images: [] },
      { id: 'events', name: 'Events & Celebrations', images: [] },
      { id: 'arts-crafts', name: 'Arts & Crafts', images: [] },
    ],
    videos: [],
  };

  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    }
  } catch (error) {
    console.error('Error initializing gallery data:', error);
  }
}

export async function GET() {
  try {
    initializeGalleryData();
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ folders: [], videos: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, url, publicId, videoUrl, folderId } = body;
    
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    
    if (type === 'image') {
      // Find the folder and add image
      const folder = data.folders.find(f => f.id === folderId);
      if (folder) {
        folder.images.push({
          url,
          publicId,
          uploadedAt: new Date().toISOString(),
        });
      }
    } else if (type === 'video') {
      data.videos.push({
        url: videoUrl,
        addedAt: new Date().toISOString(),
      });
    } else if (type === 'folder') {
      // Add new folder
      const newFolder = {
        id: body.id,
        name: body.name,
        images: [],
      };
      data.folders.push(newFolder);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { type, identifier, folderId } = await request.json();
    
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    
    if (type === 'image') {
      // Find folder and remove image
      const folder = data.folders.find(f => f.id === folderId);
      if (folder) {
        folder.images = folder.images.filter(img => img.publicId !== identifier);
      }
    } else if (type === 'video') {
      data.videos = data.videos.filter(vid => vid.url !== identifier);
    } else if (type === 'folder') {
      data.folders = data.folders.filter(f => f.id !== identifier);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
