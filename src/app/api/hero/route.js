import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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
    const client = await clientPromise;
    const db = client.db('shiny-kids');
    
    const heroDoc = await db.collection('hero').findOne({});
    
    return NextResponse.json({
      images: heroDoc?.images || []
    });
  } catch (error) {
    console.error('Hero fetch error:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}

// POST - Add hero image
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('shiny-kids');

    await db.collection('hero').updateOne(
      {},
      {
        $push: {
          images: {
            url: body.url,
            publicId: body.publicId
          }
        }
      },
      { upsert: true }
    );

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
    const client = await clientPromise;
    const db = client.db('shiny-kids');

    console.log('Delete hero image:', body.publicId);

    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(body.publicId);
      console.log('Cloudinary delete result:', result);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }

    // Remove from database
    await db.collection('hero').updateOne(
      {},
      {
        $pull: {
          images: { publicId: body.publicId }
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
