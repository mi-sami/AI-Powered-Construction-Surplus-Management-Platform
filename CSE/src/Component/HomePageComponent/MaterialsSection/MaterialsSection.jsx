import React from 'react';
import { useTranslation } from 'react-i18next';

const MaterialsSection = () => {
  const { t } = useTranslation();

  const categories = t('homePage.materials.list', { returnObjects: true }) || [];

  return (
    <section className="py-12 px-6 bg-[#f7f6f2] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          {t('homePage.materials.heading')}
        </h2>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {Array.isArray(categories) &&
            categories.map((category, idx) => (
              <span
                key={idx}
                className="px-4 py-1.5 bg-[#dddbd3] border border-gray-400/70 text-gray-800 text-xs sm:text-sm font-medium rounded-full"
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