import { Heart, Cake, ShoppingBag, Star, Gift, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-primary mb-6">Baked with Care, Made for Your Celebrations</h1>
          <div className="h-1 w-24 bg-brown-accent mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-brown-dark opacity-80 leading-relaxed">
            Granny's Cookies offers freshly baked cakes, customized cakes, cookies, brownies, and delicious bakery goodies in Behala, Kolkata. We believe that every celebration deserves a touch of sweetness made with the utmost care, hygiene, and love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=800&q=80" 
                alt="Baking with care" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30 max-w-xs">
              <p className="text-sm font-bold text-brown-dark italic">"Always fresh, soft, and full of flavor and homemade."</p>
              <div className="flex text-brown-accent mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-brown-dark">Our Promise of Quality</h2>
            <p className="text-brown-dark opacity-70">
              At Granny's Cookies, we don't just bake; we craft experiences. From our humble beginnings, our focus has always been on maintaining that authentic "homemade taste" while ensuring professional hygiene and beautiful presentation.
            </p>
            <p className="text-brown-dark opacity-70">
              Whether it's an elaborate customized theme cake for your child's birthday, an elegant wedding tier, or a simple box of our signature butter cookies, we use premium ingredients and bake everything fresh to order.
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-brown-dark mb-4">Why Granny's Cookies?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Made with Care", desc: "Every batch is baked with attention to detail and love." },
            { icon: Cake, title: "Customized Cakes", desc: "Bring your vision to life with our expert decorators." },
            { icon: ShoppingBag, title: "Freshly Baked Cookies", desc: "Crisp, buttery, and baked fresh daily." },
            { icon: Star, title: "Beautiful Presentation", desc: "We ensure your treats look as good as they taste." },
            { icon: Gift, title: "Perfect for Celebrations", desc: "Curated gift boxes and hampers for every occasion." },
            { icon: Users, title: "Customer Focused", desc: "Reliable service and a commitment to your satisfaction." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-beige-mid/30 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-beige-light rounded-full flex items-center justify-center mx-auto mb-6 text-brown-primary">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-brown-dark mb-3">{feature.title}</h3>
              <p className="text-brown-dark opacity-70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
