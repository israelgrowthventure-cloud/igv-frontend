import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import israelFlag from '../assets/israel-flag-icon-free-vector.png';

// IGV Brand Color
const IGV_BLUE = '#00318D';

/**
 * DecisionBanner - Homepage priority banner for audit conversion
 * Position: Just below header, above-the-fold
 * Style: IGV Blue background, white text, premium aesthetic
 */
const DecisionBanner = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  
  // Check if we're on the audit subdomain - if so, don't show banner
  const isAuditDomain = typeof window !== 'undefined' && 
    window.location.hostname === 'audit.israelgrowthventure.com';
  
  if (isAuditDomain) {
    return null;
  }

  return (
    <div 
      className="w-full shadow-md"
      style={{ backgroundColor: IGV_BLUE }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          {/* Text content */}
          <div className={`flex-1 text-center sm:text-left ${isRTL ? 'sm:text-right' : ''}`}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
              {t('home_banner.title')}
              <img
                src={israelFlag}
                alt="Drapeau Israël"
                style={{
                  height: '1em',
                  maxHeight: '24px',
                  width: 'auto',
                  marginLeft: '8px',
                  verticalAlign: 'middle',
                  transform: 'rotate(10deg)',
                  display: 'inline',
                  position: 'relative',
                  top: '-1px',
                  pointerEvents: 'none'
                }}
              />
            </h2>
            <p className="text-sm sm:text-base text-blue-100">
              {t('home_banner.subtitle')}
            </p>
          </div>

          {/* CTA Button - White with IGV Blue text */}
          <div className="flex-shrink-0">
            <Link
              to="/audit"
              className={`
                inline-flex items-center gap-2
                px-6 py-3 
                bg-white 
                text-sm sm:text-base font-bold
                rounded-lg
                hover:bg-blue-50 
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
                shadow-lg hover:shadow-xl
              `}
              style={{ 
                color: IGV_BLUE,
                '--tw-ring-offset-color': IGV_BLUE 
              }}
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
