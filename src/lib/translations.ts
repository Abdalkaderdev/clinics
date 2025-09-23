type Language = "en" | "ar" | "ku";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    ku: string;
  };
}

const translations: Translations = {
  // Categories page
  partnersTitle: {
    en: "Beauty Land Card Partners",
    ar: "شركاء بطاقة بيوتي لاند",
    ku: "هاوپەیمانی کارتی بیوتی لاند",
  },
  clinicsCount: {
    en: "12 Premium Clinics in Erbil",
    ar: "12 عيادة متميزة في أربيل",
    ku: "12 کلینیکی پڕیمیۆم لە هەولێر",
  },
  exclusiveDiscounts: {
    en: "Exclusive discounts & free services with your Beauty Land Card",
    ar: "خصومات حصرية وخدمات مجانية مع بطاقة بيوتي لاند",
    ku: "خەڵات و خزمەتگوزاری بەردەست لەگەڵ کارتی بیوتی لاند",
  },
  searchPlaceholder: {
    en: "Search clinics or services...",
    ar: "البحث عن العيادات أو الخدمات...",
    ku: "گەڕان بۆ کلینیک یان خزمەتگوزاری...",
  },
  services: {
    en: "services",
    ar: "خدمة",
    ku: "خزمەتگوزاری",
  },
  discountsAvailable: {
    en: "Discounts Available",
    ar: "الخصومات متاحة",
    ku: "خەڵات بەردەستە",
  },
  noClinicsFound: {
    en: "No clinics found",
    ar: "لم يتم العثور على عيادات",
    ku: "هیچ کلینیکێک نەدۆزرایەوە",
  },
  tryAgain: {
    en: "Try Again",
    ar: "إعادة المحاولة",
    ku: "دووبارە هەوڵ بدەرەوە",
  },
  loadError: {
    en: "Failed to load clinics. Please try again.",
    ar: "فشل في تحميل العيادات. يرجى المحاولة مرة أخرى.",
    ku: "هەڵە لە بارکردنی کلینیک. تکایە دووبارە هەوڵ بدەرەوە.",
  },
  // Index page
  tagline: {
    en: "Discounts & freebies at 12 partner clinics",
    ar: "خصومات وعناصر مجانية في 12 عيادة شريكة",
    ku: "خەڵات و بەخشین لە 12 کلینیک هاوپەیمان",
  },
  beautyTreatments: {
    en: "Beauty Treatments",
    ar: "علاجات التجميل",
    ku: "چارەسەری جوانکاری",
  },
  medicalServices: {
    en: "Medical Services",
    ar: "الخدمات الطبية",
    ku: "خزمەتگوزاری پزیشکی",
  },
  freeItemsAvailable: {
    en: "Free Items Available",
    ar: "العناصر المجانية متاحة",
    ku: "بەخشین بەردەستە",
  },
  chooseLanguage: {
    en: "Choose Your Language",
    ar: "اختر لغتك",
    ku: "زمانت هەڵبژێرە",
  },
};

export const t = (key: string, lang: Language = "en"): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};
