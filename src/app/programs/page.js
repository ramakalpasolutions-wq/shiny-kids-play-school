'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState(0);

  const programs = [
    {
      id: 0,
      emoji: '👶',
      title: 'Playgroup',
      age: 'Ages 2-3 years',
      color: 'teal',
      bgColor: 'bg-[#F0FDFA]',
      borderColor: 'border-[#14B8A6]',
      textColor: 'text-[#14B8A6]',
      timing: '9:00 AM - 12:00 PM (Half Day Fun!)',
      activities: [
        'First steps into a fun learning world',
        'Sensory play and hands-on exploration',
        'Music, dance, and movement fun',
        'Making new friends and learning to share',
        'Story time adventures'
      ]
    },
    {
      id: 1,
      emoji: '🧒',
      title: 'Nursery',
      age: 'Ages 3-4 years',
      color: 'lime',
      bgColor: 'bg-[#F7FEE7]',
      borderColor: 'border-[#84CC16]',
      textColor: 'text-[#84CC16]',
      timing: '9:00 AM - 1:00 PM',
      activities: [
        'Building strong bodies with fun activities',
        'Learning ABCs, 123s, and shapes',
        'Creative arts, crafts, and painting',
        'Playing together in groups',
        'Indoor and outdoor games',
        'Talking, listening, and vocabulary building'
      ]
    },
    {
      id: 2,
      emoji: '🎒',
      title: 'Kindergarten',
      age: 'Ages 4-5 years (LKG & UKG)',
      color: 'teal',
      bgColor: 'bg-[#F0FDFA]',
      borderColor: 'border-[#14B8A6]',
      textColor: 'text-[#14B8A6]',
      timing: '9:00 AM - 2:00 PM',
      activities: [
        'Complete pre-school learning program',
        'Phonics and reading basics',
        'Math fun with numbers and puzzles',
        'Discovering the world around us',
        'Learning to write letters and words',
        'Computer basics introduction',
        'Getting ready for big school!'
      ]
    }
  ];

  const extraActivities = [
    { emoji: '🎨', title: 'Art & Craft', desc: 'Painting, drawing, and making cool stuff!', color: 'teal' },
    { emoji: '🎵', title: 'Music & Dance', desc: 'Singing songs and dancing to the beat!', color: 'lime' },
    { emoji: '⚽', title: 'Sports & Games', desc: 'Running, jumping, and playing games!', color: 'teal' },
    { emoji: '📖', title: 'Story Time', desc: 'Amazing stories that spark imagination!', color: 'lime' }
  ];

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
          Our Fun Programs 🎈
        </motion.h1>
        <p className="text-2xl text-gray-600">Learning Adventures for Every Age! 🚀</p>
      </motion.div>

      {/* Program Selector Tabs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {programs.map((program) => (
          <motion.button
            key={program.id}
            onClick={() => setSelectedProgram(program.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-3xl font-bold text-lg transition-all shadow-lg ${
              selectedProgram === program.id
                ? program.color === 'teal'
                  ? 'bg-[#14B8A6] text-white scale-110'
                  : 'bg-[#84CC16] text-white scale-110'
                : 'bg-white text-gray-700 hover:shadow-xl'
            }`}
          >
            <span className="text-3xl mr-2">{program.emoji}</span>
            {program.title}
          </motion.button>
        ))}
      </motion.div>

      {/* Selected Program Details */}
      <motion.section
        key={selectedProgram}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`mb-16 ${programs[selectedProgram].bgColor} p-10 rounded-3xl shadow-xl border-4 ${programs[selectedProgram].borderColor}`}
      >
        <div className="flex items-center justify-center mb-6">
          <motion.span
            className="text-7xl mr-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            {programs[selectedProgram].emoji}
          </motion.span>
          <div className="text-center">
            <h2 className={`text-4xl font-bold ${programs[selectedProgram].textColor}`}>
              {programs[selectedProgram].title}
            </h2>
            <p className="text-2xl text-gray-700">{programs[selectedProgram].age}</p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
            <span className="mr-2">✨</span> What We Do:
          </h3>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 text-gray-700 text-lg"
          >
            {programs[selectedProgram].activities.map((activity, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="flex items-start"
              >
                <span className={`${programs[selectedProgram].color === 'teal' ? 'text-[#14B8A6]' : 'text-[#84CC16]'} mr-3 text-2xl`}>
                  ✓
                </span>
                {activity}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 ${programs[selectedProgram].color === 'teal' ? 'bg-[#F7FEE7] border-[#84CC16]' : 'bg-[#F0FDFA] border-[#14B8A6]'} p-6 rounded-2xl border-2`}
        >
          <h3 className="font-bold text-gray-800 mb-2 text-xl flex items-center">
            <span className="mr-2">🕐</span> Timings:
          </h3>
          <p className="text-gray-700 text-lg">{programs[selectedProgram].timing}</p>
        </motion.div>
      </motion.section>

      {/* Age Comparison Chart */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-16 bg-white p-10 rounded-3xl shadow-xl border-4 border-[#14B8A6]"
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-[#14B8A6]">
          Find Your Child Perfect Program 🎯
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedProgram(program.id)}
              className={`${program.bgColor} p-8 rounded-3xl shadow-lg border-4 ${program.borderColor} cursor-pointer text-center`}
            >
              <motion.div
                className="text-7xl mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {program.emoji}
              </motion.div>
              <h3 className={`text-2xl font-bold ${program.textColor} mb-2`}>
                {program.title}
              </h3>
              <p className="text-gray-700 text-lg mb-4">{program.age}</p>
              <div className="bg-white/70 px-4 py-2 rounded-full">
                <p className="text-sm font-bold text-gray-600">{program.timing}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Extra Activities */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16 bg-white p-10 rounded-3xl shadow-xl border-4 border-[#84CC16]"
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-[#14B8A6]">
          Extra Fun Activities! 🎉
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraActivities.map((activity, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`${activity.color === 'teal' ? 'bg-[#F0FDFA] border-[#14B8A6]' : 'bg-[#F7FEE7] border-[#84CC16]'} p-8 rounded-3xl text-center shadow-lg border-4 cursor-pointer`}
            >
              <motion.div
                className="text-6xl mb-4"
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {activity.emoji}
              </motion.div>
              <h3 className={`font-bold ${activity.color === 'teal' ? 'text-[#14B8A6]' : 'text-[#84CC16]'} mb-2 text-xl`}>
                {activity.title}
              </h3>
              <p className="text-gray-600 text-lg">{activity.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#14B8A6] to-[#84CC16] p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
      >
        {/* Floating emojis background */}
        <motion.div
          className="absolute inset-0 text-6xl opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="absolute top-10 left-10">⭐</div>
          <div className="absolute top-20 right-20">🎈</div>
          <div className="absolute bottom-10 left-20">🌟</div>
          <div className="absolute bottom-20 right-10">✨</div>
        </motion.div>

        <motion.h2
          className="text-4xl font-bold text-white mb-4 drop-shadow-lg relative z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Want to Enroll Your Little Star? ⭐
        </motion.h2>
        <p className="mb-8 text-2xl text-white drop-shadow relative z-10">
          Let us talk and plan your child amazing journey!
        </p>
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#14B8A6] text-xl px-12 py-4 rounded-full hover:bg-gray-100 transition inline-block font-bold shadow-lg relative z-10"
        >
          📞 Contact Us Now! 📞
        </motion.a>
      </motion.div>
    </div>
  );
}
