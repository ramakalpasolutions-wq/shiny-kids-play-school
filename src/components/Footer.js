export default function Footer() {
  return (
    <footer className="bg-[#0F766E] text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-2">✨</span>
              <h3 className="text-2xl font-bold">Shiny Kids</h3>
            </div>
            <p className="text-white text-lg">Where Little Stars Shine Bright! 🌟</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🔗</span> Quick Links
            </h3>
            <ul className="space-y-2 text-lg">
              <li><a href="/about" className="hover:text-[#84CC16] transition">About Us</a></li>
              <li><a href="/programs" className="hover:text-[#84CC16] transition">Programs</a></li>
              <li><a href="/gallery" className="hover:text-[#84CC16] transition">Gallery</a></li>
              <li><a href="/contact" className="hover:text-[#84CC16] transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📍</span> Contact Info
            </h3>
            <p className="text-white text-lg mb-2">📌 Uppal Kalan, Telangana</p>
            <p className="text-white text-lg mb-2">☎️ +91 XXXXXXXXXX</p>
            <p className="text-white text-lg">✉️ info@shinykids.com</p>
          </div>
        </div>
        
        <div className="border-t-2 border-white/30 mt-8 pt-6 text-center">
          <p className="text-lg">💫 © 2026 Shiny Kids Play School. All rights reserved. 💫</p>
        </div>
      </div>
    </footer>
  );
}
