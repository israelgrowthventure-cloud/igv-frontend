import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

/**
 * DecisionBanner - Homepage priority banner for audit conversion
 * Position: Above all existing content
 * Style: Premium, non-intrusive, strategic cabinet aesthetic
 */
const DecisionBanner = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          {/* Text content */}
          <div className={`flex-1 text-center sm:text-left ${isRTL ? 'sm:text-right' : ''}`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-1 tracking-tight">
              {t('home_banner.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              {t('home_banner.subtitle')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Link
              to="/audit"
              className={`
                inline-flex items-center gap-2
                px-6 py-3 
                bg-white text-gray-900 
                text-sm sm:text-base font-semibold
                rounded-lg
                hover:bg-gray-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900
              `}
            >
              <span>{t('home_banner.cta')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionBanner;
