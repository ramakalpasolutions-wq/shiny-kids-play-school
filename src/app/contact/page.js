'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('🎉 Thank you! Check your email for confirmation!', {
          duration: 5000,
          style: {
            background: '#84CC16',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '12px',
          },
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(`❌ ${data.message || 'Failed to send message. Please try again.'}`, {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '12px',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Something went wrong. Please try again later.', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '16px 24px',
          borderRadius: '12px',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const contactInfo = [
    {
      emoji: '📍',
      title: 'Our Location',
      details: ['Shiny Kids Play School', 'Uppal Kalan, Telangana', 'India']
    },
    {
      emoji: '📞',
      title: 'Call Us',
      details: ['+91 XXXXXXXXXX', '+91 XXXXXXXXXX']
    },
    {
      emoji: '✉️',
      title: 'Email Us',
      details: ['info@shinykids.com', 'admissions@shinykids.com']
    },
    {
      emoji: '🕐',
      title: 'Open Hours',
      details: ['Mon - Fri: 8:00 AM - 3:00 PM', 'Saturday: 9:00 AM - 12:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-6xl font-bold text-[#14B8A6] mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          Let us Connect! 📞
        </motion.h1>
        <p className="text-2xl text-gray-600">We would love to hear from you! 💌</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#F0FDFA] p-10 rounded-3xl shadow-2xl border-4 border-[#14B8A6]"
        >
          <h2 className="text-3xl font-bold text-[#0F766E] mb-8 flex items-center">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="mr-3 text-4xl"
            >
              ✉️
            </motion.span>
            Send Us a Message
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">👤 Your Name *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg transition-all"
                placeholder="Enter your name"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">📧 Email *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg transition-all"
                placeholder="your@email.com"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">📱 Phone *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg transition-all"
                placeholder="+91 XXXXXXXXXX"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-gray-800 font-bold mb-3 text-lg">💬 Message *</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-5 py-4 border-3 border-[#14B8A6] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#84CC16] text-lg transition-all"
                placeholder="Tell us about your inquiry..."
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className={`w-full py-5 rounded-2xl transition font-bold text-xl shadow-lg ${submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#84CC16] hover:bg-[#65A30D] text-white'
                }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"
                  />
                  Sending...
                </span>
              ) : (
                '🚀 Send Message 🚀'
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Contact Information */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#14B8A6] to-[#0F766E] text-white p-10 rounded-3xl shadow-2xl mb-8 relative overflow-hidden"
          >
            {/* Background decoration */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <h2 className="text-3xl font-bold mb-8 flex items-center relative z-10">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="mr-3 text-4xl"
              >
                📍
              </motion.span>
              Get In Touch
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 relative z-10"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-start bg-white/20 backdrop-blur-sm p-6 rounded-2xl cursor-pointer"
                >
                  <motion.span
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl mr-4"
                  >
                    {info.emoji}
                  </motion.span>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-lg">{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#F7FEE7] p-8 rounded-3xl border-4 border-[#84CC16] shadow-xl"
          >
            <div className="flex items-center mb-4">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl mr-3"
              >
                📅
              </motion.span>
              <h3 className="text-2xl font-bold text-[#65A30D]">Visit Our School!</h3>
            </div>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Come see our colorful classrooms and happy kids! Please call ahead to schedule
              your visit! 🎈
            </p>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(132, 204, 22, 0.7)',
                  '0 0 0 10px rgba(132, 204, 22, 0)',
                  '0 0 0 0 rgba(132, 204, 22, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white p-4 rounded-2xl border-2 border-[#84CC16]"
            >
              <p className="text-[#65A30D] font-bold text-xl text-center">
                🌟 Admissions Open for 2026-27! 🌟
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Social Media / Additional CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-[#84CC16] to-[#65A30D] p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="text-8xl absolute top-5 left-10">⭐</div>
          <div className="text-8xl absolute bottom-5 right-10">✨</div>
          <div className="text-8xl absolute top-10 right-20">🎈</div>
          <div className="text-8xl absolute bottom-10 left-20">🌟</div>
        </motion.div>

        <motion.h2
          className="text-4xl font-bold text-white mb-4 drop-shadow-lg relative z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Have Questions? We are Here to Help! 🤗
        </motion.h2>
        <p className="text-xl text-white mb-6 relative z-10">
          Feel free to call us anytime during our open hours!
        </p>
        <motion.a
          href="tel:+91XXXXXXXXXX"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-white text-[#84CC16] px-10 py-4 rounded-full font-bold text-xl shadow-lg relative z-10"
        >
          📞 Call Now: +91 XXXXXXXXXX
        </motion.a>
      </motion.div>
    </div>
  );
}
