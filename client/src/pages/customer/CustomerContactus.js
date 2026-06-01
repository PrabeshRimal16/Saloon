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
    <div className="bg-background font-body-md text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      <CustomerNavbar />

      {/* Main Content */}
      <main className="pt-32 pb-section-gap-desktop max-w-container-max-width mx-auto px-gutter">
        {/* Header Section */}
        <header className="mb-section-gap-mobile md:mb-20 text-center md:text-left">
          <h1 className="font-headline-xl text-headline-xl mb-4 text-primary leading-tight">
            Get in Touch
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Experience the pinnacle of Parisian beauty. Whether you're looking for a transformation or a moment of tranquility, our experts are here to guide you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Details & Form */}
          <div className="lg:col-span-7 space-y-16">
            {/* Info Cards Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-outline-variant/30 bg-surface-container-lowest hover:border-secondary transition-all duration-500 group">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  location_on
                </span>
                <h3 className="font-label-md text-label-md uppercase tracking-widest mb-2 text-primary">
                  The Atelier
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  123 Avenue Montaigne<br/>75008 Paris, France
                </p>
              </div>
              <div className="p-8 border border-outline-variant/30 bg-surface-container-lowest hover:border-secondary transition-all duration-500 group">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block group-hover:scale-110 transition-transform">
                  call
                </span>
                <h3 className="font-label-md text-label-md uppercase tracking-widest mb-2 text-primary">
                  Inquiries
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  +33 1 23 45 67 89<br/>atelier@modernsalon.com
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <section className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md mb-8 text-primary">
                Send a Message
              </h2>
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <label 
                      className={`block font-label-sm text-label-sm uppercase tracking-widest mb-2 transition-colors duration-200 ${
                        focusedField === 'name' ? 'text-secondary' : 'text-on-surface-variant'
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
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body-md text-body-md focus:ring-0 focus:border-secondary transition-colors placeholder:text-outline-variant/50" 
                      placeholder="Your Full Name" 
                      type="text"
                    />
                  </div>
                  <div className="relative">
                    <label 
                      className={`block font-label-sm text-label-sm uppercase tracking-widest mb-2 transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-secondary' : 'text-on-surface-variant'
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
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body-md text-body-md focus:ring-0 focus:border-secondary transition-colors placeholder:text-outline-variant/50" 
                      placeholder="email@address.com" 
                      type="email"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label 
                    className={`block font-label-sm text-label-sm uppercase tracking-widest mb-2 transition-colors duration-200 ${
                      focusedField === 'message' ? 'text-secondary' : 'text-on-surface-variant'
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
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body-md text-body-md focus:ring-0 focus:border-secondary transition-colors placeholder:text-outline-variant/50 resize-none" 
                    placeholder="How can we assist you today?" 
                    rows="4"
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="group relative px-10 py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Send Message</span>
                    <div className="absolute inset-0 bg-secondary-container transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-0 opacity-10"></div>
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Map & Hours Sidebar */}
          <div className="lg:col-span-5 space-y-12">
            {/* Map / Visual Representation */}
            <div className="aspect-[4/5] bg-surface-container-high relative overflow-hidden group">
              <img 
                alt="Salon Location" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSnWm5sfcOnE70QO5mbwLx66P0ZlaOyl4Smw8rjsatrkMvsR0RwmJ9NWDKgUwq6nteJ7TKUFwAh1u6t7Pym31TDKeYkhCwe6oizsIQyKUfi2a39peiSfNaJCdU2Q1nNET-x5J4-TbRPGfV_NLf-PDe-W4pP0tlKl5zAPFpmaX6oMxWfy-jDUjGMIWGnN1N5gLbzGdtBonuZ28dyelnXs2uZLV5Aiio2d7inLMhTFto7Np6yVEH9Y3RvY6d9Ffcyb7svIH68DJbz3dt"
              />
              {/* Decorative Map Overlay (Simulation) */}
              <div className="absolute inset-0 bg-primary/20 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md p-6 border border-secondary/30">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">explore</span>
                  <div>
                    <p className="font-label-md text-label-md text-primary mb-1">Interactive Map</p>
                    <p className="text-xs font-body-md text-on-surface-variant uppercase tracking-tighter">Click to open navigation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <section className="border border-outline-variant/20 p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-12 h-[1px] bg-secondary"></span>
                <h2 className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary">
                  Opening Hours
                </h2>
              </div>
              <ul className="space-y-6">
                <li className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                  <span className="font-body-md text-on-surface-variant">Monday — Saturday</span>
                  <span className="font-label-md text-primary">10:00 AM – 8:00 PM</span>
                </li>
                <li className="flex justify-between items-center pb-4 opacity-50">
                  <span className="font-body-md text-on-surface-variant">Sunday</span>
                  <span className="font-label-md text-secondary">Closed</span>
                </li>
              </ul>
              <p className="mt-8 text-xs font-body-md text-on-surface-variant italic">
                * Private appointments outside of standard hours are available upon special request.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap-mobile md:py-section-gap-desktop px-gutter flex flex-col items-center justify-center gap-base text-center bg-surface border-t border-outline-variant/20">
        <span className="font-headline-lg text-headline-lg text-primary uppercase mb-8">
          L'Atelier
        </span>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <button 
            onClick={() => handleNavigation('privacy')}
            className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => handleNavigation('terms')}
            className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => handleNavigation('career')}
            className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md"
          >
            Career
          </button>
          <button 
            onClick={() => handleNavigation('contact')}
            className="text-outline hover:text-primary underline decoration-secondary font-label-md text-label-md"
          >
            Contact Us
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-8">
          Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
        </p>
        <span className="font-label-sm text-label-sm text-outline font-headline-lg">
          © 2024 L'Atelier Modern. All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default ContactUsPage;