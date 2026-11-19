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
            <button className="px-9 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50">
              Register
            </button>
            </Link>

            <Link to='/login'>
            <button className="px-5 py-2 text-sm font-medium text-gray-900 bg-white rounded hover:bg-gray-100 transition-all cursor-pointer rounded-full">
              Login
            </button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;