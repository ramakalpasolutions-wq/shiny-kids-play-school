import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ROOT = process.cwd();
// Use /tmp on Vercel (serverless), data/ locally
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(ROOT, "data");
const HERO_FILE = path.join(DATA_DIR, "hero.json");

async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(HERO_FILE);
  } catch {
    await fs.writeFile(HERO_FILE, JSON.stringify({ images: [] }, null, 2), "utf8");
  }
}

async function readHero() {
  await ensureFiles();
  const raw = await fs.readFile(HERO_FILE, "utf8");
  const data = raw ? JSON.parse(raw) : { images: [] };
  return data.images || [];
}

async function writeHero(images) {
  await ensureFiles();
  await fs.writeFile(HERO_FILE, JSON.stringify({ images }, null, 2), "utf8");
}

// GET - Fetch hero images
export async function GET() {
  try {
    const images = await readHero();
    return NextResponse.json({ images });
  } catch (err) {
    console.error("Hero GET error:", err);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}

// POST - Add hero image
export async function POST(request) {
  try {
    const body = await request.json();
    const images = await readHero();
    
    images.push({
      url: body.url,
      publicId: body.publicId,
      uploadedAt: new Date().toISOString(),
    });
    
    await writeHero(images);
    
    return NextResponse.json({ success: true, images });
  } catch (err) {
    console.error("Hero POST error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

// DELETE - Remove hero image
export async function DELETE(request) {
  try {
    const body = await request.json();
    
    console.log("Delete hero image:", body.publicId);
    
    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(body.publicId, {
        invalidate: true,
        resource_type: "image",
      });
      console.log("Cloudinary delete result:", result);
    } catch (error) {
      console.warn("Cloudinary delete error:", error);
    }
    
    // Remove from JSON
    const images = await readHero();
    const updatedImages = images.filter(img => img.publicId !== body.publicId);
    await writeHero(updatedImages);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Hero DELETE error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
