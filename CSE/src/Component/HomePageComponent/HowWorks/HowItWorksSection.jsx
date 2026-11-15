import React from 'react';
import { FaUserPlus } from "react-icons/fa";
import { LuPackagePlus } from "react-icons/lu";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoWalletSharp } from "react-icons/io5";
import { BiReceipt } from "react-icons/bi";

const HowItWorksSection = () => {
  const steps = [
    {
      
      icon: FaUserPlus,
      gradient: 'from-[#008ba9] to-cyan-600',
      title: 'Register',
      description: 'Sign up as a Company with a trade license no., or as an Individual with an NID no. An admin approves your account.',
    },
    {
      
      icon: LuPackagePlus,
      gradient: 'from-[#c24e00] to-amber-500',
      title: 'List surplus',
      description: 'Upload a photo. AI suggests the material type, color, pattern and surface. You confirm and publish.',
    },
    {
      
      icon: AiOutlineFileSearch,
      gradient: 'from-[#008ba9] to-emerald-500',
      title: 'Find or request',
      description: 'Search the listings, or post what you need and see the best matches ranked by Match Score.',
    },
    {
      
      icon: IoWalletSharp,
      gradient: 'from-amber-600 to-[#c24e00]',
      title: 'Order and pay advance',
      description: 'Pay an advance online. Your order is confirmed when the advance payment succeeds.',
    },
    {
      
      icon: BiReceipt,
      gradient: 'from-teal-600 to-[#008ba9]',
      title: 'Get the receipt',
      description: 'Both sides receive a receipt with each other company details to arrange the material.',
    },
  ];

  return (
    <section className="py-16 px-6 bg-[#f7f6f2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How it works</h2>
        <p className="text-gray-600 text-sm mb-10">Five simple steps from leftover to sold.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Top Row: Step Number + Gradient Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[#c24e00]"><div
                    className={`w-11 h-11 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-sm`}
                  >
                    <IconComponent className="text-xl" />
                  </div></span>
                  
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;