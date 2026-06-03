import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [focusedField, setFocusedField] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const labelClass = (field) =>
    `block text-[11px] font-bold uppercase tracking-widest mb-2 transition-colors duration-200 ${
      focusedField === field ? 'text-[#C9A84C]' : 'text-gray-400'
    }`;

  const inputClass =
    'w-full bg-transparent border-0 border-b border-gray-200 py-3 px-0 text-[#1A1A1A] text-[15px] focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-gray-300 outline-none';

  const contactCards = [
    { icon: 'location_on', title: 'Our Atelier', lines: ['123 Avenue Montaigne', '75008 Paris, France'] },
    { icon: 'call', title: 'Phone', lines: ['+33 1 23 45 67 89'] },
    { icon: 'mail', title: 'Email', lines: ['atelier@modernsalon.com'] },
    { icon: 'schedule', title: 'Hours', lines: ['Mon–Sat: 10:00 AM – 8:00 PM', 'Sunday: Closed'] },
  ];

  return (
    <div className="bg-[#FBF8F2] font-sans text-[#1A1A1A] min-h-screen flex flex-col">
      <CustomerNavbar />

      <main className="flex-grow pt-[80px]">

        {/* Hero */}
        <section className="relative bg-[#1A1A1A] text-white py-24 px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80"
              alt="Salon interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-4 font-bold">Reach Out</div>
            <h1 className="font-serif text-[48px] md:text-[64px] font-bold leading-[1.05] mb-5 m-0">
              Get in Touch
            </h1>
            <p className="text-[16px] text-white/65 max-w-lg leading-relaxed">
              Whether you're looking for a transformation or a moment of tranquility, our experts are here to guide you.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="px-8 py-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {contactCards.map(card => (
              <div key={card.title} className="bg-white p-6 border border-[#EDE8DC] rounded-xl hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 group">
                <span className="material-symbols-outlined text-[#C9A84C] text-[28px] mb-3 block group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
                <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2 text-[#1A1A1A]">{card.title}</h3>
                {card.lines.map((line, i) => (
                  <p key={i} className="text-[13px] text-gray-500 leading-snug">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="px-8 pb-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-white p-10 border border-[#EDE8DC] rounded-2xl shadow-sm">
              <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-3 font-bold">Message Us</div>
              <h2 className="font-serif text-[30px] font-bold text-[#1A1A1A] mb-8 m-0">Send a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-[#2D7A4F]/10 border border-[#2D7A4F]/30 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2D7A4F]">check_circle</span>
                  <p className="text-[#2D7A4F] text-sm font-medium">Message sent! We'll get back to you soon.</p>
                </div>
              )}

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass('name')}>Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} onFocus={() => handleFocus('name')} onBlur={handleBlur} className={inputClass} placeholder="Your full name" type="text" required />
                  </div>
                  <div>
                    <label className={labelClass('email')}>Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} onFocus={() => handleFocus('email')} onBlur={handleBlur} className={inputClass} placeholder="email@address.com" type="email" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass('phone')}>Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} onFocus={() => handleFocus('phone')} onBlur={handleBlur} className={inputClass} placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                  <div>
                    <label className={labelClass('service')}>Service Interest</label>
                    <select name="service" value={formData.service} onChange={handleInputChange} onFocus={() => handleFocus('service')} onBlur={handleBlur} className={`${inputClass} cursor-pointer`}>
                      <option value="">Select a service</option>
                      <option>Hair Styling</option>
                      <option>Beard Grooming</option>
                      <option>Facial Treatment</option>
                      <option>Nail Care</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass('message')}>Message</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} onFocus={() => handleFocus('message')} onBlur={handleBlur} className={`${inputClass} resize-none`} placeholder="How can we assist you today?" rows="4" required />
                </div>
                <div className="pt-2">
                  <button type="submit" className="inline-flex items-center gap-2 px-10 py-4 bg-[#1A1A1A] text-white text-[12px] font-bold uppercase tracking-widest border border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 rounded">
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Map & Hours */}
            <div className="flex flex-col gap-6">
              {/* Map visual */}
              <div className="relative overflow-hidden group rounded-2xl shadow-sm border border-[#EDE8DC] h-72">
                <img
                  alt="Salon Location Map"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  src="https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&q=80"
                />
                <div className="absolute inset-0 bg-[#1A1A1A]/15 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 border border-[#EDE8DC] rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#C9A84C]">explore</span>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1A1A]">123 Avenue Montaigne, Paris</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest">Click to open in Maps</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="bg-white p-8 border border-[#EDE8DC] rounded-2xl shadow-sm flex-grow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-[2px] bg-[#C9A84C]"></span>
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] m-0">Opening Hours</h2>
                </div>
                <ul className="space-y-5">
                  {[
                    { day: 'Monday — Friday', hours: '10:00 AM – 8:00 PM', active: true },
                    { day: 'Saturday', hours: '9:00 AM – 6:00 PM', active: true },
                    { day: 'Sunday', hours: 'Closed', active: false },
                  ].map(item => (
                    <li key={item.day} className="flex justify-between items-center border-b border-[#F0EBE0] pb-4 last:border-0 last:pb-0">
                      <span className="text-[14px] text-gray-500">{item.day}</span>
                      <span className={`font-bold text-[14px] ${item.active ? 'text-[#1A1A1A]' : 'text-[#C9A84C] uppercase tracking-wider text-[11px]'}`}>
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[12px] text-gray-400 italic leading-relaxed">
                  * Private appointments outside standard hours are available upon special request.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      <CustomerFooter />
    </div>
  );
};

export default ContactUsPage;