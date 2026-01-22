export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-[#14B8A6] mb-4">
          About Shiny Kids ✨
        </h1>
        <p className="text-2xl text-gray-600">Where Little Dreams Take Flight! 🚀</p>
      </div>

      <section className="mb-16">
        <div className="bg-[#F0FDFA] p-10 rounded-3xl shadow-xl border-4 border-[#14B8A6]">
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl mr-3">🎯</span>
            <h2 className="text-4xl font-bold text-[#0F766E]">Our Mission</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed text-center">
            At Shiny Kids Play School, we create a magical world where children can explore, learn, 
            and grow with joy! Every child is a shining star, and we help them discover their unique 
            sparkle through love, care, and fun-filled learning adventures! 🌟
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#14B8A6]">
          What Makes Us Special? 💫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F0FDFA] p-8 rounded-3xl shadow-lg transform hover:scale-105 transition border-4 border-[#14B8A6]">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-3">🌟</span>
              <h3 className="text-2xl font-bold text-[#0F766E]">Quality Education</h3>
            </div>
            <p className="text-gray-700 text-lg">
              Fun and innovative teaching methods that make learning an exciting adventure 
              for every little learner!
            </p>
          </div>

          <div className="bg-[#F7FEE7] p-8 rounded-3xl shadow-lg transform hover:scale-105 transition border-4 border-[#84CC16]">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-3">💖</span>
              <h3 className="text-2xl font-bold text-[#65A30D]">Complete Growth</h3>
            </div>
            <p className="text-gray-700 text-lg">
              We nurture mind, body, heart, and spirit to help every child become their 
              amazing best!
            </p>
          </div>

          <div className="bg-[#F7FEE7] p-8 rounded-3xl shadow-lg transform hover:scale-105 transition border-4 border-[#84CC16]">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-3">🤝</span>
              <h3 className="text-2xl font-bold text-[#65A30D]">Parent Partnership</h3>
            </div>
            <p className="text-gray-700 text-lg">
              We work hand-in-hand with parents to create a strong support circle 
              for every child's success!
            </p>
          </div>

          <div className="bg-[#F0FDFA] p-8 rounded-3xl shadow-lg transform hover:scale-105 transition border-4 border-[#14B8A6]">
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-3">🎯</span>
              <h3 className="text-2xl font-bold text-[#0F766E]">Personal Care</h3>
            </div>
            <p className="text-gray-700 text-lg">
              Small classes mean every child gets the love, attention, and encouragement 
              they deserve!
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#84CC16]">
          Our Amazing Facilities 🏫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] transform hover:rotate-2 transition">
            <div className="text-7xl mb-4">🏫</div>
            <h3 className="text-2xl font-bold mb-3 text-[#14B8A6]">Colorful Classrooms</h3>
            <p className="text-gray-600 text-lg">Bright, cheerful rooms filled with fun learning tools!</p>
          </div>

          <div className="text-center bg-white p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] transform hover:rotate-2 transition">
            <div className="text-7xl mb-4">🎪</div>
            <h3 className="text-2xl font-bold mb-3 text-[#84CC16]">Play Areas</h3>
            <p className="text-gray-600 text-lg">Safe indoor & outdoor spaces for jumping and fun!</p>
          </div>

          <div className="text-center bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] transform hover:rotate-2 transition">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-3 text-[#14B8A6]">Learning Tools</h3>
            <p className="text-gray-600 text-lg">Exciting toys, books, and activities for curious minds!</p>
          </div>
        </div>
      </section>

      <section className="bg-[#14B8A6] text-white p-12 rounded-3xl text-center shadow-2xl">
        <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Our Core Values 💎</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-5xl mb-3">💕</div>
            <p className="text-2xl font-bold">Love</p>
            <p className="text-sm mt-2">Caring for every child</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-5xl mb-3">🤗</div>
            <p className="text-2xl font-bold">Respect</p>
            <p className="text-sm mt-2">Valuing everyone</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-5xl mb-3">⭐</div>
            <p className="text-2xl font-bold">Excellence</p>
            <p className="text-sm mt-2">Being our best always</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-5xl mb-3">🎨</div>
            <p className="text-2xl font-bold">Creativity</p>
            <p className="text-sm mt-2">Thinking outside the box</p>
          </div>
        </div>
      </section>
    </div>
  );
}
