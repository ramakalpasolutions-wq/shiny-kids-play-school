'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [activeValue, setActiveValue] = useState(0);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, years: 0, activities: 0 });

  const coreValues = [
    { emoji: '💕', title: 'Love', description: 'Caring for every child with warmth and affection' },
    { emoji: '🤗', title: 'Respect', description: 'Valuing everyone and their unique qualities' },
    { emoji: '⭐', title: 'Excellence', description: 'Being our best always in everything we do' },
    { emoji: '🎨', title: 'Creativity', description: 'Thinking outside the box and exploring ideas' },
  ];

  // Counter animation
  useEffect(() => {
    const targets = { students: 500, teachers: 25, years: 10, activities: 50 };
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        students: Math.floor(targets.students * progress),
        teachers: Math.floor(targets.teachers * progress),
        years: Math.floor(targets.years * progress),
        activities: Math.floor(targets.activities * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate core values
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
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
          About Shiny Kids ✨
        </motion.h1>
        <p className="text-2xl text-gray-600">Where Little Dreams Take Flight! 🚀</p>
      </motion.div>

      {/* Stats Counter */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 bg-gradient-to-r from-[#14B8A6] to-[#84CC16] p-8 rounded-3xl shadow-2xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          <div>
            <motion.div
              className="text-5xl font-bold mb-2"
              key={counts.students}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {counts.students}+
            </motion.div>
            <p className="text-xl">Happy Students</p>
          </div>
          <div>
            <motion.div
              className="text-5xl font-bold mb-2"
              key={counts.teachers}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {counts.teachers}+
            </motion.div>
            <p className="text-xl">Expert Teachers</p>
          </div>
          <div>
            <motion.div
              className="text-5xl font-bold mb-2"
              key={counts.years}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {counts.years}+
            </motion.div>
            <p className="text-xl">Years Experience</p>
          </div>
          <div>
            <motion.div
              className="text-5xl font-bold mb-2"
              key={counts.activities}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {counts.activities}+
            </motion.div>
            <p className="text-xl">Fun Activities</p>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#F0FDFA] p-10 rounded-3xl shadow-xl border-4 border-[#14B8A6] cursor-pointer"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.span
              className="text-6xl mr-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🎯
            </motion.span>
            <h2 className="text-4xl font-bold text-[#0F766E]">Our Mission</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed text-center">
            At Shiny Kids Play School, we create a magical world where children can explore, learn, 
            and grow with joy! Every child is a shining star, and we help them discover their unique 
            sparkle through love, care, and fun-filled learning adventures! 🌟
          </p>
        </motion.div>
      </motion.section>

      {/* What Makes Us Special */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-[#14B8A6]">
          What Makes Us Special? 💫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { emoji: '🌟', title: 'Quality Education', desc: 'Fun and innovative teaching methods that make learning an exciting adventure for every little learner!', color: 'teal' },
            { emoji: '💖', title: 'Complete Growth', desc: 'We nurture mind, body, heart, and spirit to help every child become their amazing best!', color: 'lime' },
            { emoji: '🤝', title: 'Parent Partnership', desc: 'We work hand-in-hand with parents to create a strong support circle for every child success!', color: 'lime' },
            { emoji: '🎯', title: 'Personal Care', desc: 'Small classes mean every child gets the love, attention, and encouragement they deserve!', color: 'teal' }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`${item.color === 'teal' ? 'bg-[#F0FDFA] border-[#14B8A6]' : 'bg-[#F7FEE7] border-[#84CC16]'} p-8 rounded-3xl shadow-lg border-4 cursor-pointer`}
            >
              <div className="flex items-center mb-4">
                <motion.span
                  className="text-5xl mr-3"
                  whileHover={{ scale: 1.3, rotate: 20 }}
                >
                  {item.emoji}
                </motion.span>
                <h3 className={`text-2xl font-bold ${item.color === 'teal' ? 'text-[#0F766E]' : 'text-[#65A30D]'}`}>
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-700 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Facilities */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-[#84CC16]">
          Our Amazing Facilities 🏫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { emoji: '🏫', title: 'Colorful Classrooms', desc: 'Bright, cheerful rooms filled with fun learning tools!', color: 'teal' },
            { emoji: '🎪', title: 'Play Areas', desc: 'Safe indoor & outdoor spaces for jumping and fun!', color: 'lime' },
            { emoji: '📚', title: 'Learning Tools', desc: 'Exciting toys, books, and activities for curious minds!', color: 'teal' }
          ].map((facility, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, rotate: 2 }}
              className={`text-center bg-white p-8 rounded-3xl shadow-xl border-4 ${facility.color === 'teal' ? 'border-[#14B8A6]' : 'border-[#84CC16]'} cursor-pointer`}
            >
              <motion.div
                className="text-7xl mb-4"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {facility.emoji}
              </motion.div>
              <h3 className={`text-2xl font-bold mb-3 ${facility.color === 'teal' ? 'text-[#14B8A6]' : 'text-[#84CC16]'}`}>
                {facility.title}
              </h3>
              <p className="text-gray-600 text-lg">{facility.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Core Values - Interactive */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#14B8A6] to-[#0F766E] text-white p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden"
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <h2 className="text-4xl font-bold mb-6 drop-shadow-lg relative z-10">Our Core Values 💎</h2>
        
        {/* Value Selector */}
        <div className="flex justify-center gap-4 mb-8 relative z-10">
          {coreValues.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveValue(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeValue === index ? 'bg-white scale-150' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Active Value Display */}
        <motion.div
          key={activeValue}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <motion.div
            className="text-9xl mb-6"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {coreValues[activeValue].emoji}
          </motion.div>
          <h3 className="text-5xl font-bold mb-4">{coreValues[activeValue].title}</h3>
          <p className="text-2xl max-w-2xl mx-auto">{coreValues[activeValue].description}</p>
        </motion.div>

        {/* All Values Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 relative z-10">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, rotate: 5 }}
              onClick={() => setActiveValue(index)}
              className={`bg-white/20 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all ${
                activeValue === index ? 'ring-4 ring-white' : ''
              }`}
            >
              <div className="text-5xl mb-3">{value.emoji}</div>
              <p className="text-2xl font-bold">{value.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[#84CC16] text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-[#84CC16]/50 transition"
        >
          Join Our Family Today! 🌟
        </motion.a>
      </motion.section>
    </div>
  );
}
