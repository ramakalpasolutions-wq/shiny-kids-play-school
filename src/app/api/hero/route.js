import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch hero images
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'hero-data' });
    
    if (blobs.length === 0) {
      return NextResponse.json({ images: [] });
    }

    const latestBlob = blobs[0];
    const response = await fetch(latestBlob.url);
    const data = await response.json();
    
    return NextResponse.json({ images: data.images || [] });
  } catch (error) {
    console.error('Hero fetch error:', error);
    return NextResponse.json({ images: [] });
  }
}

// POST - Add hero image
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get existing data
    const { blobs } = await list({ prefix: 'hero-data' });
    let images = [];
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      const data = await response.json();
      images = data.images || [];
    }
    
    // Add new image
    images.push({
      url: body.url,
      publicId: body.publicId,
      uploadedAt: new Date().toISOString(),
    });
    
    // Save to blob
    await put('hero-data.json', JSON.stringify({ images }), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove hero image
export async function DELETE(request) {
  try {
    const body = await request.json();
    
    console.log('Delete hero image:', body.publicId);
    
    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(body.publicId);
      console.log('Cloudinary delete result:', result);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
    
    // Get existing data
    const { blobs } = await list({ prefix: 'hero-data' });
    let images = [];
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      const data = await response.json();
      images = data.images || [];
    }
    
    // Remove image
    images = images.filter(img => img.publicId !== body.publicId);
    
    // Save updated data
    await put('hero-data.json', JSON.stringify({ images }), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
