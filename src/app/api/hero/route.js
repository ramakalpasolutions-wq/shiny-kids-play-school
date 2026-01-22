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
const HERO_FILE = path.join(DATA_DIR, 'hero.json');

// Ensure data directory and file exist
async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(HERO_FILE);
  } catch {
    await fs.writeFile(HERO_FILE, JSON.stringify({ images: [] }, null, 2), 'utf8');
  }
}

// Read hero data
async function readHeroData() {
  await ensureFiles();
  const raw = await fs.readFile(HERO_FILE, 'utf8');
  const data = JSON.parse(raw);
  return data.images || [];
}

// Write hero data
async function writeHeroData(images) {
  await ensureFiles();
  await fs.writeFile(HERO_FILE, JSON.stringify({ images }, null, 2), 'utf8');
}

// GET - Fetch hero images
export async function GET() {
  try {
    const images = await readHeroData();
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Hero fetch error:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}

// POST - Add hero image
export async function POST(request) {
  try {
    const body = await request.json();
    const images = await readHeroData();
    
    images.push({
      url: body.url,
      publicId: body.publicId,
      uploadedAt: new Date().toISOString(),
    });
    
    await writeHeroData(images);
    
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
    
    // Remove from data
    const images = await readHeroData();
    const updatedImages = images.filter(img => img.publicId !== body.publicId);
    await writeHeroData(updatedImages);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
