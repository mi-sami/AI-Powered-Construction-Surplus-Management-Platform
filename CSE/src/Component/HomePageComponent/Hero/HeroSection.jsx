import React from 'react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <section className="bg-[#1e232a] text-white px-6 py-12 md:py-20 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Give leftover construction material a second life.
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Surplus Exchange is a marketplace where a construction project can sell materials it did not use to another project that needs them. Sellers recover some of their investment, buyers avoid buying new, and less material goes to waste.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <Link to='/register'>
            <button className="px-6 py-2.5 bg-[#c24e00] hover:bg-[#a84300] text-white font-medium rounded transition-colors cursor-pointer">
              Register
            </button>
            </Link>

            <Link to='/login'>
            <button className="px-6 py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-medium rounded transition-colors cursor-pointer">
              Login
            </button>
            </Link>
          </div>
        </div>

        {/* Right Example Card */}
        <div >
          
        </div>

      </div>
    </section>
  );
};

export default HeroSection;