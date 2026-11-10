import React from 'react';

const WhatItDoesSection = () => {
  const cards = [
    {
      title: 'Recover investment',
      description: 'Sellers turn unused material back into money instead of letting it sit on site.',
    },
    {
      title: 'Reduce waste',
      description: 'Material that is still good gets used again by another project.',
    },
    {
      title: 'Buy only what you need',
      description: 'Buyers find the exact material and quantity they need, often without buying new.',
    },
  ];

  return (
   
<section className="py-16 px-6 bg-[#e9e8e6]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What the system does</h2>
        <p className="text-gray-600 max-w-3xl mb-10 text-sm md:text-base leading-relaxed">
          Construction projects often buy more material than they use. After the work is done, extra tiles, bricks, cement, steel, pipes, paint, doors, electrical and sanitary items are left behind. Our system connects the project that has them with the project that needs them.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
        </div>
        </section>
      
  );
};

export default WhatItDoesSection;