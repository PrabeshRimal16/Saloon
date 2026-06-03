import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';

const ContactUsPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // State to track which field is focused (for label color change)
  const [focusedField, setFocusedField] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle focus events to change label color
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to an API endpoint
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Optionally reset form
    // setFormData({ name: '', email: '', message: '' });
  };

  // Navigation handlers (could be replaced with React Router links)
  const handleNavigation = (path) => {
    console.log(`Navigate to ${path}`);
    // Implement navigation logic based on your routing setup
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic
  };

  const handleNotification = () => {
    console.log('Notifications clicked');
  };

  return (
    <div className="bg-[#FBF8F2] font-sans text-[#1A1A1A] min-h-screen flex flex-col">
      <CustomerNavbar />

      {/* Main Content */}
      <main className="flex-grow pt-[120px] pb-24 max-w-7xl mx-auto px-8 w-full">
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 text-[#1A1A1A] leading-tight">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Experience the pinnacle of Parisian beauty. Whether you're looking for a transformation or a moment of tranquility, our experts are here to guide you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Details & Form */}
          <div className="lg:col-span-7 space-y-12">
            {/* Info Cards Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white border border-gray-200 hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 group rounded-lg">
                <span className="material-symbols-outlined text-[#C9A84C] text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  location_on
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-[#1A1A1A]">
                  The Atelier
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  123 Avenue Montaigne<br/>75008 Paris, France
                </p>
              </div>
              <div className="p-8 bg-white border border-gray-200 hover:border-[#C9A84C] hover:shadow-md transition-all duration-300 group rounded-lg">
                <span className="material-symbols-outlined text-[#C9A84C] text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  call
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-[#1A1A1A]">
                  Inquiries
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  +33 1 23 45 67 89<br/>atelier@modernsalon.com
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <section className="bg-white p-8 md:p-12 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="font-serif text-3xl mb-8 text-[#1A1A1A]">
                Send a Message
              </h2>
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <label 
                      className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-200 ${
                        focusedField === 'name' ? 'text-[#C9A84C]' : 'text-gray-500'
                      }`}
                    >
                      Name
                    </label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className="w-full bg-transparent border-0 border-b border-gray-300 py-3 px-0 text-[#1A1A1A] focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-gray-300 outline-none" 
                      placeholder="Your Full Name" 
                      type="text"
                    />
                  </div>
                  <div className="relative">
                    <label 
                      className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-[#C9A84C]' : 'text-gray-500'
                      }`}
                    >
                      Email
                    </label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className="w-full bg-transparent border-0 border-b border-gray-300 py-3 px-0 text-[#1A1A1A] focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-gray-300 outline-none" 
                      placeholder="email@address.com" 
                      type="email"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label 
                    className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-200 ${
                      focusedField === 'message' ? 'text-[#C9A84C]' : 'text-gray-500'
                    }`}
                  >
                    Message
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-3 px-0 text-[#1A1A1A] focus:ring-0 focus:border-[#C9A84C] transition-colors placeholder:text-gray-300 resize-none outline-none" 
                    placeholder="How can we assist you today?" 
                    rows="4"
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="group relative px-10 py-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest border border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 overflow-hidden rounded-sm"
                  >
                    <span className="relative z-10">Send Message</span>
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Map & Hours Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            {/* Map / Visual Representation */}
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden group rounded-lg shadow-sm border border-gray-200">
              <img 
                alt="Salon Location" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSnWm5sfcOnE70QO5mbwLx66P0ZlaOyl4Smw8rjsatrkMvsR0RwmJ9NWDKgUwq6nteJ7TKUFwAh1u6t7Pym31TDKeYkhCwe6oizsIQyKUfi2a39peiSfNaJCdU2Q1nNET-x5J4-TbRPGfV_NLf-PDe-W4pP0tlKl5zAPFpmaX6oMxWfy-jDUjGMIWGnN1N5gLbzGdtBonuZ28dyelnXs2uZLV5Aiio2d7inLMhTFto7Np6yVEH9Y3RvY6d9Ffcyb7svIH68DJbz3dt"
              />
              {/* Decorative Map Overlay (Simulation) */}
              <div className="absolute inset-0 bg-[#1A1A1A]/10 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#C9A84C]">explore</span>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A] mb-1">Interactive Map</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Click to open navigation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <section className="border border-gray-200 p-8 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-12 h-[1px] bg-[#C9A84C]"></span>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  Opening Hours
                </h2>
              </div>
              <ul className="space-y-6">
                <li className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="text-gray-600">Monday — Saturday</span>
                  <span className="text-[#1A1A1A] font-bold">10:00 AM – 8:00 PM</span>
                </li>
                <li className="flex justify-between items-center pb-2 opacity-60">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">Closed</span>
                </li>
              </ul>
              <p className="mt-8 text-xs text-gray-500 italic leading-relaxed">
                * Private appointments outside of standard hours are available upon special request.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 flex flex-col items-center justify-center gap-8 text-center bg-[#FBF8F2] border-t border-gray-200 mt-auto">
        <span className="font-serif text-3xl text-[#1A1A1A] uppercase tracking-widest">
          L'Atelier
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          <button 
            onClick={() => handleNavigation('privacy')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => handleNavigation('terms')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => handleNavigation('career')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors"
          >
            Career
          </button>
          <button 
            onClick={() => handleNavigation('contact')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors"
          >
            Contact Us
          </button>
        </div>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="text-xs text-gray-400 tracking-widest uppercase mt-4">
          © 2024 L'Atelier Modern. All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default ContactUsPage;