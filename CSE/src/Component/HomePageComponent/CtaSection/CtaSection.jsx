import React from 'react';
import { Link } from 'react-router';

const CtaSection = () => {
  return (
    <section className="bg-[#1e232a] text-white py-16 px-6 text-center w-full">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to start?
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Create a free account as a Company or as an Individual.
        </p>
        <div className="flex justify-center items-center space-x-4 pt-4">
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
    </section>
  );
};

export default CtaSection;