'use client';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-[#14B8A6] mb-4">
          Let's Connect! 📞
        </h1>
        <p className="text-2xl text-gray-600">We'd love to hear from you! 💌</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-[#F0FDFA] p-10 rounded-3xl shadow-2xl border-4 border-[#14B8A6]">
          <h2 className="text-3xl font-bold text-[#0F766E] mb-8 flex items-center">
            <span className="mr-3 text-4xl">✉️</span> Send Us a Message
          </h2>
          
          {submitted && (
            <div className="bg-[#F7FEE7] border-4 border-[#84CC16] text-[#65A30D] px-6 py-4 rounded-2xl mb-6 text-lg font-semibold text-center">
              🎉 Thank you! We'll get back to you soon! 🎉
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">👤 Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">📧 Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">📱 Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-800 font-bold mb-3 text-lg">💬 Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg"
                placeholder="Tell us about your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#84CC16] text-white py-5 rounded-2xl hover:bg-[#65A30D] transition font-bold text-xl shadow-lg transform hover:scale-105"
            >
              🚀 Send Message 🚀
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <div className="bg-[#14B8A6] text-white p-10 rounded-3xl shadow-2xl mb-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="mr-3 text-4xl">📍</span> Get In Touch
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <span className="text-5xl mr-4">📍</span>
                <div>
                  <h3 className="font-bold text-2xl mb-2">Our Location</h3>
                  <p className="text-lg">Shiny Kids Play School</p>
                  <p className="text-lg">Uppal Kalan, Telangana</p>
                  <p className="text-lg">India</p>
                </div>
              </div>

              <div className="flex items-start bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <span className="text-5xl mr-4">📞</span>
                <div>
                  <h3 className="font-bold text-2xl mb-2">Call Us</h3>
                  <p className="text-lg">+91 XXXXXXXXXX</p>
                  <p className="text-lg">+91 XXXXXXXXXX</p>
                </div>
              </div>

              <div className="flex items-start bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <span className="text-5xl mr-4">✉️</span>
                <div>
                  <h3 className="font-bold text-2xl mb-2">Email Us</h3>
                  <p className="text-lg">info@shinykids.com</p>
                  <p className="text-lg">admissions@shinykids.com</p>
                </div>
              </div>

              <div className="flex items-start bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <span className="text-5xl mr-4">🕐</span>
                <div>
                  <h3 className="font-bold text-2xl mb-2">Open Hours</h3>
                  <p className="text-lg">Mon - Fri: 8:00 AM - 3:00 PM</p>
                  <p className="text-lg">Saturday: 9:00 AM - 12:00 PM</p>
                  <p className="text-lg">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F7FEE7] p-8 rounded-3xl border-4 border-[#84CC16] shadow-xl">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-3">📅</span>
              <h3 className="text-2xl font-bold text-[#65A30D]">Visit Our School!</h3>
            </div>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Come see our colorful classrooms and happy kids! Please call ahead to schedule 
              your visit! 🎈
            </p>
            <div className="bg-white p-4 rounded-2xl border-2 border-[#84CC16]">
              <p className="text-[#65A30D] font-bold text-xl text-center">
                🌟 Admissions Open for 2026-27! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
