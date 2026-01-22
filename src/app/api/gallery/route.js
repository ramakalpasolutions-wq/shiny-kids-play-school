import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch gallery data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiny-kids');
    
    const galleryDoc = await db.collection('gallery').findOne({});
    
    if (!galleryDoc) {
      return NextResponse.json({ folders: [], videos: [] });
    }

    return NextResponse.json({
      folders: galleryDoc.folders || [],
      videos: galleryDoc.videos || []
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ folders: [], videos: [] }, { status: 500 });
  }
}

// POST - Add image, video, or folder
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('shiny-kids');

    // Create folder
    if (body.type === 'folder') {
      await db.collection('gallery').updateOne(
        {},
        {
          $push: {
            folders: {
              id: body.id,
              name: body.name,
              images: []
            }
          }
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    // Add image to folder
    if (body.type === 'image') {
      await db.collection('gallery').updateOne(
        { 'folders.id': body.folderId },
        {
          $push: {
            'folders.$.images': {
              url: body.url,
              publicId: body.publicId
            }
          }
        }
      );
      return NextResponse.json({ success: true });
    }

    // Add video
    if (body.type === 'video') {
      await db.collection('gallery').updateOne(
        {},
        {
          $push: {
            videos: { url: body.videoUrl }
          }
        },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove image, video, or folder
export async function DELETE(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('shiny-kids');

    console.log('Delete request:', body);

    // Delete folder and all its images
    if (body.type === 'folder') {
      // First, get the folder to delete all images from Cloudinary
      const galleryDoc = await db.collection('gallery').findOne({});
      const folder = galleryDoc?.folders?.find(f => f.id === body.identifier);

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

      // Remove folder from database
      await db.collection('gallery').updateOne(
        {},
        {
          $pull: {
            folders: { id: body.identifier }
          }
        }
      );

      return NextResponse.json({ success: true });
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

      // Remove from database
      await db.collection('gallery').updateOne(
        { 'folders.id': body.folderId },
        {
          $pull: {
            'folders.$.images': { publicId: body.identifier }
          }
        }
      );

      return NextResponse.json({ success: true });
    }

    // Delete video
    if (body.type === 'video') {
      await db.collection('gallery').updateOne(
        {},
        {
          $pull: {
            videos: { url: body.identifier }
          }
        }
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
