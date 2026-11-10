import React from 'react';

const MaterialsSection = () => {
  const categories = [
    'Tiles',
    'Bricks',
    'Cement',
    'Steel',
    'Pipes',
    'Paint',
    'Doors and windows',
    'Electrical materials',
    'Sanitary items',
  ];

  return (
    <section className="py-12 px-6 bg-[#f7f6f2] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Materials you can find
        </h2>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {categories.map((category, idx) => (
            <span
              key={idx}
              className="px-4 py-1.5 bg-[#dddbd3] border border-gray-400/70 text-gray-800 text-xs sm:text-sm font-medium rounded-full  "
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;