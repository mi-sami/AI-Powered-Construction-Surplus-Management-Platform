import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Register',
      description: 'Sign up as a Company with a trade license no., or as an Individual with an NID no. An admin approves your account.',
    },
    {
      number: '2',
      title: 'List surplus',
      description: 'Upload a photo. AI suggests the material type, color, pattern and surface. You confirm and publish.',
    },
    {
      number: '3',
      title: 'Find or request',
      description: 'Search the listings, or post what you need and see the best matches ranked by Match Score.',
    },
    {
      number: '4',
      title: 'Order and pay advance',
      description: 'Pay an advance online. Your order is confirmed when the advance payment succeeds.',
    },
    {
      number: '5',
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
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <span className="text-3xl font-bold text-[#c24e00] block mb-2">{step.number}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{step.description}</p>
            </div>
            
          ))}
        </div>
        </div>
        </section>
      
  );
};

export default HowItWorksSection;