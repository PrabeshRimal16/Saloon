import React from 'react';

const CustomerFooter = () => {
  return (
    <footer className="w-full mt-auto py-16 px-8 bg-[#1A1A1A] flex flex-col items-center justify-center gap-8 text-center border-t border-[#333333]">
      <h2 className="font-serif text-[32px] md:text-[40px] text-[#C9A84C] uppercase tracking-widest m-0">
        L'Atelier
      </h2>
      
      <div className="flex flex-wrap justify-center gap-8">
        <a className="text-[#888888] hover:text-[#C9A84C] text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300" href="#">
          Privacy Policy
        </a>
        <a className="text-[#888888] hover:text-[#C9A84C] text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300" href="#">
          Terms of Service
        </a>
        <a className="text-[#888888] hover:text-[#C9A84C] text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300" href="#">
          Careers
        </a>
        <a className="text-[#888888] hover:text-[#C9A84C] text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300" href="#">
          Contact Us
        </a>
      </div>

      <p className="text-[#888888] text-[14px] max-w-lg leading-relaxed mt-2">
        Crafting excellence in beauty and grooming since 2012. Our atelier is a sanctuary for those who appreciate the finer things in life.
      </p>

      <div className="w-full max-w-[200px] h-[1px] bg-[#333333] my-2"></div>

      <span className="text-[10px] text-[#666666] tracking-[0.2em] uppercase">
        © {new Date().getFullYear()} L'Atelier Modern. All Rights Reserved.
      </span>
    </footer>
  );
};

export default CustomerFooter;
