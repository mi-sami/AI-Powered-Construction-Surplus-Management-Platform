import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserPlus } from "react-icons/fa";
import { LuPackagePlus } from "react-icons/lu";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoWalletSharp } from "react-icons/io5";
import { BiReceipt } from "react-icons/bi";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FaUserPlus,
      gradient: 'from-[#008ba9] to-cyan-600',
      title: t('homePage.howItWorks.steps.registerTitle'),
      description: t('homePage.howItWorks.steps.registerDesc'),
    },
    {
      icon: LuPackagePlus,
      gradient: 'from-[#c24e00] to-amber-500',
      title: t('homePage.howItWorks.steps.listTitle'),
      description: t('homePage.howItWorks.steps.listDesc'),
    },
    {
      icon: AiOutlineFileSearch,
      gradient: 'from-[#008ba9] to-emerald-500',
      title: t('homePage.howItWorks.steps.findTitle'),
      description: t('homePage.howItWorks.steps.findDesc'),
    },
    {
      icon: IoWalletSharp,
      gradient: 'from-amber-600 to-[#c24e00]',
      title: t('homePage.howItWorks.steps.orderTitle'),
      description: t('homePage.howItWorks.steps.orderDesc'),
    },
    {
      icon: BiReceipt,
      gradient: 'from-teal-600 to-[#008ba9]',
      title: t('homePage.howItWorks.steps.receiptTitle'),
      description: t('homePage.howItWorks.steps.receiptDesc'),
    },
  ];

  return (
    <section className="py-16 px-6 bg-[#f7f6f2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('homePage.howItWorks.heading')}
        </h2>
        <p className="text-gray-600 text-sm mb-10">
          {t('homePage.howItWorks.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Top Row: Gradient Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[#c24e00]">
                    <div
                      className={`w-11 h-11 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-sm`}
                    >
                      <IconComponent className="text-xl" />
                    </div>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;