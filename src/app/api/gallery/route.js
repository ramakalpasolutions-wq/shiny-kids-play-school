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
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");

const DEFAULT_DATA = {
  folders: [
    { id: "classroom", name: "Classroom Activities", images: [] },
    { id: "playground", name: "Playground Fun", images: [] },
    { id: "events", name: "Events & Celebrations", images: [] },
    { id: "arts-crafts", name: "Arts & Crafts", images: [] },
  ],
  videos: [],
};

async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(GALLERY_FILE);
  } catch {
    await fs.writeFile(GALLERY_FILE, JSON.stringify(DEFAULT_DATA, null, 2), "utf8");
  }
}

async function readGallery() {
  await ensureFiles();
  const raw = await fs.readFile(GALLERY_FILE, "utf8");
  const data = raw ? JSON.parse(raw) : DEFAULT_DATA;
  return {
    folders: data.folders || DEFAULT_DATA.folders,
    videos: data.videos || [],
  };
}

async function writeGallery(data) {
  await ensureFiles();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(data, null, 2), "utf8");
}

// GET - Fetch gallery data
export async function GET() {
  try {
    const data = await readGallery();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Gallery GET error:", err);
    return NextResponse.json(DEFAULT_DATA, { status: 500 });
  }
}

// POST - Add image, video, or folder
export async function POST(request) {
  try {
    const body = await request.json();
    const data = await readGallery();
    
    // Create folder
    if (body.type === "folder") {
      const exists = data.folders.some(f => f.id === body.id);
      if (!exists) {
        data.folders.push({
          id: body.id,
          name: body.name,
          images: [],
        });
      }
    }
    
    // Add image to folder
    if (body.type === "image") {
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
    if (body.type === "video") {
      data.videos.push({
        url: body.videoUrl,
        addedAt: new Date().toISOString(),
      });
    }
    
    await writeGallery(data);
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Gallery POST error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

// DELETE - Remove image, video, or folder
export async function DELETE(request) {
  try {
    const body = await request.json();
    console.log("Delete request:", body);
    
    const data = await readGallery();
    
    // Delete folder and all its images
    if (body.type === "folder") {
      const folder = data.folders.find(f => f.id === body.identifier);
      
      if (folder && folder.images) {
        // Delete all images from Cloudinary
        for (const image of folder.images) {
          try {
            await cloudinary.uploader.destroy(image.publicId, {
              invalidate: true,
              resource_type: "image",
            });
            console.log("Deleted from Cloudinary:", image.publicId);
          } catch (error) {
            console.warn("Cloudinary delete error:", error);
          }
        }
      }
      
      // Remove folder
      data.folders = data.folders.filter(f => f.id !== body.identifier);
    }
    
    // Delete single image
    if (body.type === "image") {
      // Delete from Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(body.identifier, {
          invalidate: true,
          resource_type: "image",
        });
        console.log("Cloudinary delete result:", result);
      } catch (error) {
        console.warn("Cloudinary delete error:", error);
      }
      
      // Remove from folder
      const folder = data.folders.find(f => f.id === body.folderId);
      if (folder) {
        folder.images = folder.images.filter(img => img.publicId !== body.identifier);
      }
    }
    
    // Delete video
    if (body.type === "video") {
      data.videos = data.videos.filter(v => v.url !== body.identifier);
    }
    
    await writeGallery(data);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gallery DELETE error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
