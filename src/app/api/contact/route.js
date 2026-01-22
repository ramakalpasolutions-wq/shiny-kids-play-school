import { NextResponse } from 'next/server';
import { transporter, adminEmailTemplate, userEmailTemplate } from '@/lib/email';

export async function POST(request) {
  try {
    // DEBUG: Log environment variables
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '***EXISTS***' : '***MISSING***');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    const formData = await request.json();

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if credentials exist
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.error('Missing email credentials in environment variables');
      return NextResponse.json(
        { success: false, message: 'Email configuration error' },
        { status: 500 }
      );
    }

    console.log('Sending admin email...');
    await transporter.sendMail(adminEmailTemplate(formData));
    console.log('Admin email sent successfully');

    console.log('Sending user confirmation email...');
    await transporter.sendMail(userEmailTemplate(formData));
    console.log('User confirmation sent successfully');

    return NextResponse.json(
      { success: true, message: 'Emails sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send emails', error: error.message },
      { status: 500 }
    );
  }
}
