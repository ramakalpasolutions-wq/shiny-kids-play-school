'use client';
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // Create Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 fade-in-scroll">
          <h2 className="text-5xl font-bold text-[#14B8A6] mb-4">
            Why Choose Shiny Kids? ✨
          </h2>
          <p className="text-2xl text-gray-600">Where Every Child Shines Bright! 🌟</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="bg-[#F0FDFA] p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:border-[#84CC16] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">🎨</div>
              <h3 className="text-2xl font-bold mb-3 text-[#0F766E] text-center">Creative Learning</h3>
              <p className="text-gray-700 text-lg text-center">Fun activities that spark creativity and imagination!</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="bg-[#F7FEE7] p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] hover:border-[#14B8A6] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">👨‍🏫</div>
              <h3 className="text-2xl font-bold mb-3 text-[#65A30D] text-center">Caring Teachers</h3>
              <p className="text-gray-700 text-lg text-center">Loving educators who nurture every child!</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="bg-[#F0FDFA] p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:border-[#84CC16] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">🏫</div>
              <h3 className="text-2xl font-bold mb-3 text-[#0F766E] text-center">Safe & Happy</h3>
              <p className="text-gray-700 text-lg text-center">A joyful place where kids learn and play safely!</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.4s' }}>
            <div className="bg-[#F7FEE7] p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] hover:border-[#14B8A6] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">📚</div>
              <h3 className="text-2xl font-bold mb-3 text-[#65A30D] text-center">Holistic Development</h3>
              <p className="text-gray-700 text-lg text-center">Nurturing mind, body, and social skills together!</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.5s' }}>
            <div className="bg-[#F0FDFA] p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:border-[#84CC16] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">🎪</div>
              <h3 className="text-2xl font-bold mb-3 text-[#0F766E] text-center">Fun Activities</h3>
              <p className="text-gray-700 text-lg text-center">Music, dance, sports, and hands-on learning!</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="fade-in-scroll" style={{ transitionDelay: '0.6s' }}>
            <div className="bg-[#F7FEE7] p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] hover:border-[#14B8A6] hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <div className="text-6xl mb-4 text-center group-hover:scale-125 group-hover:animate-bounce-gentle transition-transform duration-300">👫</div>
              <h3 className="text-2xl font-bold mb-3 text-[#65A30D] text-center">Small Classes</h3>
              <p className="text-gray-700 text-lg text-center">Personal attention for every child's needs!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-[#F0FDFA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-scroll">
            <h2 className="text-5xl font-bold text-[#14B8A6] mb-4">
              Our Fun Programs 🎈
            </h2>
            <p className="text-2xl text-gray-600">Learning Made Fun for Every Age! 🎉</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Playgroup */}
            <div className="fade-in-scroll" style={{ transitionDelay: '0.1s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:shadow-2xl hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-7xl text-center mb-4 group-hover:animate-bounce-gentle">👶</div>
                <h3 className="text-3xl font-bold text-[#14B8A6] mb-2 text-center">Playgroup</h3>
                <p className="text-gray-600 mb-3 text-center text-lg font-semibold">Ages 2-3 years</p>
                <p className="text-gray-700 text-center text-lg">First steps into a world of fun and learning!</p>
              </div>
            </div>

            {/* Nursery */}
            <div className="fade-in-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#84CC16] hover:shadow-2xl hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-7xl text-center mb-4 group-hover:animate-bounce-gentle">🧒</div>
                <h3 className="text-3xl font-bold text-[#84CC16] mb-2 text-center">Nursery</h3>
                <p className="text-gray-600 mb-3 text-center text-lg font-semibold">Ages 3-4 years</p>
                <p className="text-gray-700 text-center text-lg">Growing minds through play and exploration!</p>
              </div>
            </div>

            {/* Kindergarten */}
            <div className="fade-in-scroll" style={{ transitionDelay: '0.3s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#14B8A6] hover:shadow-2xl hover:rotate-2 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-7xl text-center mb-4 group-hover:animate-bounce-gentle">🎒</div>
                <h3 className="text-3xl font-bold text-[#14B8A6] mb-2 text-center">Kindergarten</h3>
                <p className="text-gray-600 mb-3 text-center text-lg font-semibold">Ages 4-5 years</p>
                <p className="text-gray-700 text-center text-lg">Ready for school with confidence and joy!</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 fade-in-scroll">
            <Link href="/programs" className="bg-[#84CC16] text-white text-xl px-12 py-5 rounded-full hover:bg-[#65A30D] transition-all duration-300 inline-block font-bold shadow-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-1">
              🌟 Explore Our Programs 🌟
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="fade-in-scroll">
          <div className="bg-gradient-to-r from-[#14B8A6] to-[#84CC16] p-12 md:p-16 rounded-3xl shadow-2xl text-center hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <div className="text-7xl mb-6 animate-bounce-gentle">🎉</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Join the Fun?
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow">
              Let's start your child's amazing journey with us!
            </p>
            <Link 
              href="/contact" 
              className="bg-white text-[#14B8A6] text-xl px-12 py-5 rounded-full hover:bg-[#F0FDFA] transition-all duration-300 inline-block font-bold shadow-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-2"
            >
              📞 Contact Us Today! 📞
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
