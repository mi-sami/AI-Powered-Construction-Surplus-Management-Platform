import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineBanknotes } from "react-icons/hi2";
import { FaRecycle } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";

const WhatItDoesSection = () => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: HiOutlineBanknotes,
      gradient: 'from-[#008ba9] to-emerald-500',
      title: t('homePage.whatItDoes.cards.recoverTitle'),
      description: t('homePage.whatItDoes.cards.recoverDesc'),
    },
    {
      icon: FaRecycle,
      gradient: 'from-emerald-500 to-teal-600',
      title: t('homePage.whatItDoes.cards.reduceTitle'),
      description: t('homePage.whatItDoes.cards.reduceDesc'),
    },
    {
      icon: TbTargetArrow,
      gradient: 'from-[#c24e00] to-amber-500',
      title: t('homePage.whatItDoes.cards.buyTitle'),
      description: t('homePage.whatItDoes.cards.buyDesc'),
    },
  ];

  return (
    <section className="py-16 px-6 bg-[#e9e8e6]">
      <svg width="0" height="0" className="hidden">
        <defs>
          <linearGradient id="brand-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#008ba9" />
            <stop offset="100%" stopColor="#c24e00" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('homePage.whatItDoes.heading')}
        </h2>
        <p className="text-gray-600 max-w-3xl mb-10 text-sm md:text-base leading-relaxed">
          {t('homePage.whatItDoes.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-4 shadow-sm`}
                >
                  <IconComponent className="text-2xl" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatItDoesSection;