import nodemailer from 'nodemailer';

// Debug logging
console.log('Loading email configuration...');
console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? 'SET' : 'NOT SET');

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Admin notification email template
export const adminEmailTemplate = (formData) => {
  return {
    from: `"Shiny Kids Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: `🎉 New Contact Form Submission - ${formData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f0fdfa; border-radius: 20px; }
          .header { background: linear-gradient(135deg, #14B8A6, #84CC16); color: white; padding: 30px; text-align: center; border-radius: 15px; margin-bottom: 20px; }
          .content { background: white; padding: 25px; border-radius: 15px; border: 3px solid #14B8A6; }
          .field { margin-bottom: 20px; padding: 15px; background: #f7fee7; border-radius: 10px; border-left: 4px solid #84CC16; }
          .label { font-weight: bold; color: #14B8A6; font-size: 14px; text-transform: uppercase; }
          .value { margin-top: 5px; font-size: 16px; color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🌟 New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0;">Shiny Kids Play School</p>
          </div>
          
          <div class="content">
            <h2 style="color: #14B8A6; margin-top: 0;">Contact Details</h2>
            
            <div class="field">
              <div class="label">👤 Name</div>
              <div class="value">${formData.name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email</div>
              <div class="value"><a href="mailto:${formData.email}" style="color: #14B8A6;">${formData.email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">📱 Phone</div>
              <div class="value"><a href="tel:${formData.phone}" style="color: #14B8A6;">${formData.phone}</a></div>
            </div>
            
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="value">${formData.message}</div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #f0fdfa; border-radius: 10px; text-align: center;">
              <p style="margin: 0; color: #14B8A6; font-weight: bold;">📅 Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Shiny Kids Play School contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// User confirmation email template
export const userEmailTemplate = (formData) => {
  return {
    from: `"Shiny Kids Play School" <${process.env.GMAIL_USER}>`,
    to: formData.email,
    subject: '🎉 Thank You for Contacting Shiny Kids Play School!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f0fdfa; border-radius: 20px; }
          .header { background: linear-gradient(135deg, #14B8A6, #84CC16); color: white; padding: 40px; text-align: center; border-radius: 15px; margin-bottom: 20px; }
          .content { background: white; padding: 30px; border-radius: 15px; border: 3px solid #14B8A6; }
          .highlight { background: #f7fee7; padding: 20px; border-radius: 10px; border-left: 4px solid #84CC16; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .info-box { background: #f0fdfa; padding: 15px; border-radius: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">✨ Thank You, ${formData.name}! ✨</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">We received your message!</p>
          </div>
          
          <div class="content">
            <p style="font-size: 18px; color: #14B8A6; font-weight: bold;">Dear ${formData.name},</p>
            
            <p>Thank you for reaching out to Shiny Kids Play School! 🎈 We are excited to connect with you.</p>
            
            <div class="highlight">
              <p style="margin: 0; font-weight: bold; color: #65A30D;">📝 Your Message:</p>
              <p style="margin: 10px 0 0 0;">${formData.message}</p>
            </div>
            
            <p>Our team will review your inquiry and get back to you within <strong>24-48 hours</strong>. We look forward to helping your little one shine! 🌟</p>
            
            <div class="info-box">
              <h3 style="color: #14B8A6; margin-top: 0;">📞 Contact Information</h3>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +91 XXXXXXXXXX</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> info@shinykids.com</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> Uppal Kalan, Telangana, India</p>
            </div>
            
            <div class="info-box">
              <h3 style="color: #84CC16; margin-top: 0;">🕐 Open Hours</h3>
              <p style="margin: 5px 0;"><strong>Mon - Fri:</strong> 8:00 AM - 3:00 PM</p>
              <p style="margin: 5px 0;"><strong>Saturday:</strong> 9:00 AM - 12:00 PM</p>
              <p style="margin: 5px 0;"><strong>Sunday:</strong> Closed</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f7fee7, #f0fdfa); border-radius: 10px;">
              <p style="font-size: 20px; font-weight: bold; color: #14B8A6; margin: 0;">🌟 Admissions Open for 2026-27! 🌟</p>
              <p style="margin: 10px 0 0 0; color: #666;">Schedule a visit to see our amazing facilities!</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Shiny Kids Play School</strong></p>
            <p>Where Little Dreams Take Flight! 🚀</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
