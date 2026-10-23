import { Camera } from 'lucide-react';

export default function GalleryPage() {
  const images = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    "https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=600&q=80",
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=600&q=80",
    "https://images.unsplash.com/photo-1519869491916-8ca6f615d6bd?w=600&q=80",
    "https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=600&q=80"
  ];

  return (
    <div className="bg-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-primary mb-6">Our Creations</h1>
          <div className="h-1 w-24 bg-brown-accent mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-brown-dark opacity-80 max-w-2xl mx-auto">
            A glimpse into our kitchen. From elegant celebration cakes to our signature butter cookies, see what's baking at Granny's Cookies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {images.map((src, idx) => (
            <div key={idx} className={`rounded-[32px] overflow-hidden ${idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
              <img 
                src={src} 
                alt="Granny's Cookies Gallery" 
                className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="text-center bg-[#FDFBF7] p-12 rounded-[40px] border border-beige-mid/30">
          <Camera size={40} className="mx-auto text-brown-primary mb-4" />
          <h2 className="text-2xl font-serif font-bold text-brown-dark mb-4">Follow Us on Instagram</h2>
          <p className="text-brown-dark opacity-70 mb-8 max-w-md mx-auto">Stay updated with our latest creations, behind-the-scenes baking, and special offers.</p>
          <a 
            href="https://www.instagram.com/grannys.cookiess/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-brown-primary text-white rounded-full font-bold hover:bg-brown-dark transition-colors"
          >
            @grannys.cookiess
          </a>
        </div>
      </div>
    </div>
  );
}
