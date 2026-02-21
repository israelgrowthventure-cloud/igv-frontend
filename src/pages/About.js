import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language?.startsWith('he') ? 'he' : i18n.language?.startsWith('en') ? 'en' : 'fr';

  const bio = {
    fr: [
      "Avec plus de 20 ans d'expérience en tant qu'agent immobilier professionnel à Paris et trois nominations comme meilleur agent du réseau Procomm, Mickael a acquis une expertise reconnue dans le domaine.",
      "Passionné par l'aide aux entreprises à réussir dans ce pays dynamique, il comprend profondément les besoins de ses clients et développe des stratégies personnalisées pour maximiser leur succès.",
    ],
    en: [
      'With over 20 years of experience as a professional real estate agent in Paris and three nominations as best agent in the Procomm network, Mickael has built widely recognized expertise in the field.',
      "Passionate about helping businesses succeed in this dynamic country, he deeply understands his clients' needs and develops personalized strategies to maximize their success.",
    ],
    he: [
      'עם ניסיון של למעלה מ-20 שנה כסוכן נדל"ן מקצועי בפריז ושלוש מינויים כסוכן הטוב ביותר ברשת Procomm, מיקאל רכש מומחיות מוכרת בתחום.',
      'בעל תשוקה לסייע לעסקים להצליח במדינה הדינמית הזו, הוא מבין לעומק את צרכי לקוחותיו ומפתח אסטרטגיות מותאמות אישית למיצוי הצלחתם.',
    ],
  };

  const founderTitle = { fr: 'Fondateur & CEO', en: 'Founder & CEO', he: 'מייסד ומנכ"ל' };
  const yearsLabel = { fr: "Ans d'exp.", en: "Years' exp.", he: 'שנות ניסיון' };
  const ctaLabel = { fr: 'Travaillons ensemble', en: "Let's work together", he: 'בואו נעבוד ביחד' };
  const ctaSub = {
    fr: "Contactez-nous pour discuter de votre projet d'expansion en Israël",
    en: 'Contact us to discuss your expansion project in Israel',
    he: 'צרו איתנו קשר לדיון בפרויקט ההתרחבות שלכם בישראל',
  };

  const values = [
    {
      icon: Award,
      title: { fr: 'Expertise', en: 'Expertise', he: 'מומחיות' },
      desc: {
        fr: "Plus de 20 ans d'expérience dans l'immobilier commercial et l'expansion de marques",
        en: 'Over 20 years of experience in commercial real estate and brand expansion',
        he: 'למעלה מ-20 שנות ניסיון בנדל"ן מסחרי והרחבת מותגים',
      },
    },
    {
      icon: Target,
      title: { fr: 'Résultats', en: 'Results', he: 'תוצאות' },
      desc: {
        fr: 'Approche orientée résultats avec un taux de réussite élevé pour nos clients',
        en: 'Results-oriented approach with a high success rate for our clients',
        he: 'גישה ממוקדת תוצאות עם שיעור הצלחה גבוה ללקוחותינו',
      },
    },
    {
      icon: Users,
      title: { fr: 'Accompagnement', en: 'Support', he: 'ליווי' },
      desc: {
        fr: "Support complet de A à Z, de l'analyse initiale au suivi post-ouverture",
        en: 'Complete support from A to Z, from initial analysis to post-opening follow-up',
        he: 'תמיכה מלאה מא׳ עד ת׳, מניתוח ראשוני ועד מעקב לאחר הפתיחה',
      },
    },
    {
      icon: TrendingUp,
      title: { fr: 'Réseau', en: 'Network', he: 'רשת' },
      desc: {
        fr: 'Réseau étendu de partenaires locaux et connexions avec les autorités',
        en: 'Extensive network of local partners and connections with authorities',
        he: 'רשת נרחבת של שותפים מקומיים וקשרים עם הרשויות',
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('about.title')} | Israel Growth Venture</title>
        <meta name="description" content={t('about.description')} />
        <link rel="canonical" href="https://israelgrowthventure.com/about" />
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* ── HERO ── */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('about.description')}
            </p>
          </div>
        </section>

        {/* ── PORTRAIT MICKAEL ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src="/images/mickael-benmoussa.png"
                      alt="Mickael Benmoussa — Fondateur Israel Growth Venture"
                      className="w-52 h-52 rounded-full object-cover shadow-xl mx-auto"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-[#00318D] text-white px-4 py-2 rounded-xl shadow-lg text-center">
                      <div className="text-2xl font-bold">20+</div>
                      <div className="text-xs">{yearsLabel[lang]}</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-1">Mickael Benmoussa</h2>
                  <p className="text-[#00318D] font-semibold">{founderTitle[lang]}</p>
                </div>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  {bio[lang].map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEXTES MISSION ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>{t('about.collaboration')}</p>
            <p>{t('about.support')}</p>
            <p className="text-xl font-semibold text-[#00318D]">{t('about.service')}</p>
          </div>
        </section>

        {/* ── VALEURS ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center text-[#00318D]">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title[lang]}</h3>
                    <p className="text-sm text-gray-600">{value.desc[lang]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#00318D] to-blue-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{ctaLabel[lang]}</h2>
            <p className="text-blue-100 mb-8 text-lg">{ctaSub[lang]}</p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#00318D] rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              {t('nav.contact')}
            </a>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;
