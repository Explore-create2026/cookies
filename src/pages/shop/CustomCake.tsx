import { useState } from 'react';
import { Cake, Upload, MessageCircle } from 'lucide-react';

const BUSINESS_PHONE = "919831097533";

export default function CustomCake() {
  const [formData, setFormData] = useState({
    type: 'Birthday Cake',
    flavour: 'Chocolate',
    size: '1kg',
    message: '',
    theme: '',
    date: '',
    time: '',
    instructions: '',
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateWhatsAppMessage = () => {
    const msg = `Hello Granny's Cookies,

I would like to place a custom cake request.

*Cake Details:*
Type: ${formData.type}
Flavour: ${formData.flavour}
Size: ${formData.size}
Message on Cake: ${formData.message || 'None'}
Theme/Design: ${formData.theme || 'None'}

*Delivery Details:*
Date: ${formData.date}
Time: ${formData.time || 'Anytime'}
Address: ${formData.address}
Instructions: ${formData.instructions || 'None'}

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'None'}

Please confirm availability and the final price based on these details.`;

    return encodeURIComponent(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`https://wa.me/${BUSINESS_PHONE}?text=${generateWhatsAppMessage()}`, '_blank');
  };

  return (
    <div className="min-h-screen py-16 relative overflow-hidden bg-cream">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-10 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1600&q=80')" }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brown-primary mb-6">Customize Your Cake</h1>
          <div className="h-1 w-24 bg-brown-accent mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-brown-dark opacity-80 max-w-2xl mx-auto">
            Tell us your idea and let us create a cake made especially for your celebration. Final price will be confirmed based on your selected design, size, and customization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-beige-mid/30">
          
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-brown-dark mb-6 flex items-center border-b border-beige-mid/50 pb-4">
              <Cake className="mr-3 text-brown-accent" /> Cake Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Cake Type *</label>
                <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark">
                  {['Birthday Cake', 'Anniversary Cake', 'Wedding Cake', 'Kids Cake', 'Theme Cake', 'Other'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Cake Flavour *</label>
                <select required name="flavour" value={formData.flavour} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark">
                  {['Chocolate', 'Vanilla', 'Red Velvet', 'Butterscotch', 'Black Forest', 'Pineapple', 'Other'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Size/Weight *</label>
                <select required name="size" value={formData.size} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark">
                  {['500g', '1kg', '1.5kg', '2kg', '3kg', 'Custom'].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Message on Cake</label>
                <input type="text" name="message" value={formData.message} onChange={handleChange} placeholder="e.g. Happy Birthday!" className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Theme / Design Ideas</label>
                <textarea name="theme" value={formData.theme} onChange={handleChange} rows={3} placeholder="Describe your vision (colors, characters, floral, minimal...)" className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark"></textarea>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-brown-dark mb-6 border-b border-beige-mid/50 pb-4">Delivery & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Delivery Date *</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Preferred Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Full Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark"></textarea>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Special Instructions</label>
                <input type="text" name="instructions" value={formData.instructions} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Your Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-brown-dark opacity-80 uppercase tracking-wider">Email (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-cream/50 border border-beige-mid rounded-2xl focus:ring-brown-accent focus:border-brown-accent text-brown-dark" />
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <button type="submit" className="inline-flex items-center justify-center w-full md:w-auto px-10 py-5 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#1DA851] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
              <MessageCircle className="mr-3" size={24} />
              Send Request on WhatsApp
            </button>
            <p className="mt-4 text-sm text-brown-dark opacity-60">You will be redirected to WhatsApp to confirm your details.</p>
          </div>

        </form>
      </div>
    </div>
  );
}
