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
    en: "7 Premium Clinics in Erbil",
    ar: "7 عيادات متميزة في أربيل",
    ku: "7 کلینیکی پڕیمیۆم لە هەولێر",
  },
  exclusiveDiscounts: {
    en: "Exclusive discounts & free services with your Beauty Land Card",
    ar: "خصومات حصرية وخدمات مجانية مع بطاقة بيوتي لاند",
    ku: "خەڵات و خزمەتگوزاری بێ بەرامبەر لەگەڵ کارتی بیوتی لاند",
  },
  searchPlaceholder: {
    en: "Search clinics or services...",
    ar: "البحث عن العيادات أو الخدمات...",
    ku: "گەڕان بۆ کلینیک یان خزمەتگوزارییەکان...",
  },
  services: {
    en: "services",
    ar: "خدمات",
    ku: "خزمەتگوزارییەکان",
  },
  discountsAvailable: {
    en: "Discounts Available",
    ar: "الخصومات المتاحة",
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
    en: "Discounts & freebies at 7 partner clinics",
    ar: "خصومات وعناصر مجانية في 7 عيادات شريكة",
    ku: "خەڵات و بەخشین لە 7 کلینیک هاوپەیمان",
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
    ar: "العناصر المجانية المتاحة",
    ku: "بەخشین بەردەستە",
  },
  chooseLanguage: {
    en: "Choose Your Language",
    ar: "اختر لغتك",
    ku: "زمانت هەڵبژێرە",
  },
  // Menu.tsx translations
  all: {
    en: "All",
    ar: "الكل",
    ku: "هەموو",
  },
  searchServices: {
    en: "Search services...",
    ar: "البحث عن الخدمات...",
    ku: "گەڕان بۆ خزمەتگوزارییەکان...",
  },
  filters: {
    en: "Filters",
    ar: "المرشحات",
    ku: "فلتەر",
  },
  clearAll: {
    en: "Clear All",
    ar: "مسح الكل",
    ku: "سڕینەوەی هەموو",
  },
  freeServices: {
    en: "🆓 Free Services",
    ar: "🆓 الخدمات المجانية",
    ku: "🆓 خزمەتگوزاری بێ بەرامبەر",
  },
  discount: {
    en: "💰 Discount",
    ar: "💰 الخصم",
    ku: "💰 خەڵات",
  },
  favorites: {
    en: "❤️ Favorites",
    ar: "❤️ المفضلة",
    ku: "❤️ دڵخواز",
  },
  noServicesFound: {
    en: "No services found.",
    ar: "لا توجد خدمات",
    ku: "هیچ خزمەتگوزاریەک نەدۆزرایەوە",
  },
  backToClinics: {
    en: "Back to clinics",
    ar: "الرجوع إلى العيادات",
    ku: "گەڕانەوە بۆ کلینیک",
  },
  errorLoadingClinics: {
    en: "Error loading clinics",
    ar: "خطأ في تحميل العيادات",
    ku: "هەڵە لە بارکردنی کلینیک",
  },
  refreshPage: {
    en: "Please try refreshing the page",
    ar: "يرجى تحديث الصفحة",
    ku: "تکایە پەڕەکە نوێ بکەرەوە",
  },
  failedToLoadClinics: {
    en: "Failed to load clinics",
    ar: "فشل في تحميل العيادات",
    ku: "هەڵە لە بارکردنی کلینیک",
  },
  // MenuItemCard.tsx badge translations
  popular: {
    en: "Popular",
    ar: "شائع",
    ku: "بەناوبانگ",
  },
  hot: {
    en: "🌶️ Hot",
    ar: "🌶️ حار",
    ku: "🌶️ گەرم",
  },
  vegetarian: {
    en: "🌱 Vegetarian",
    ar: "🌱 نباتي",
    ku: "🌱 ڕووەکیخوار",
  },
  vegan: {
    en: "🌿 Vegan",
    ar: "🌿 نباتي صرف",
    ku: "🌿 ڕووەکیخواری تەواو",
  },
  glutenFree: {
    en: "🌾 Gluten Free",
    ar: "🌾 خالي من الگلوتين",
    ku: "🌾 بێ گلوتین",
  },
  new: {
    en: "New",
    ar: "جديد",
    ku: "نوێ",
  },
  contactForPricing: {
    en: "Contact for pricing",
    ar: "اتصل للحصول على السعر",
    ku: "پەیوەندی بکە بۆ نرخ",
  },
  before: {
    en: "Before",
    ar: "قبل",
    ku: "پێش",
  },
  after: {
    en: "After",
    ar: "بعد",
    ku: "دوای",
  },
  free: {
    en: "FREE",
    ar: "مجاني",
    ku: "بێ بەرامبەر",
  },
  save: {
    en: "Save",
    ar: "وفر",
    ku: "پاشەکەوت",
  },
  off: {
    en: "OFF",
    ar: "خصم",
    ku: "خەڵات",
  },
  freeWithCard: {
    en: "100% FREE with Beauty Land Card!",
    ar: "100% مجاني مع بطاقة بيوتي لاند!",
    ku: "100% بێ بەرامبەر لەگەڵ کارتی بیوتی لاند!",
  },
  // New translations for improved UX
  complimentaryService: {
    en: "Complimentary",
    ar: "مجاني",
    ku: "بێ بەرامبەر",
  },
  freeItems: {
    en: "free items",
    ar: "عناصر مجانية",
    ku: "بەخشین",
  },
  discountItems: {
    en: "discounts",
    ar: "خصومات",
    ku: "خەڵات",
  },
  home: {
    en: "Home",
    ar: "الرئيسية",
    ku: "سەرەتا",
  },
  loading: {
    en: "Loading...",
    ar: "جاري التحميل...",
    ku: "بارکردن...",
  },
  call: {
    en: "Call",
    ar: "اتصال",
    ku: "پەیوەندی",
  },
  searchHelpText: {
    en: "Search through available services and treatments",
    ar: "البحث في الخدمات والعلاجات المتاحة",
    ku: "گەڕان لە خزمەتگوزاری و چارەسەرییەکان",
  },
  searchServicesWithCount: {
    en: "Search among {count} services...",
    ar: "البحث بين {count} خدمة...",
    ku: "گەڕان لەنێو {count} خزمەتگوزاری...",
  },
  tooltipCollapseHeader: {
    en: "Click to collapse/expand clinic details and categories",
    ar: "انقر لطي/توسيع تفاصيل العيادة والفئات",
    ku: "کرتە بکە بۆ شاردنەوە/دەرخستنی وردەکاری کلینیک و پۆلەکان",
  },
  tooltipSearchShortcut: {
    en: "Press Ctrl+K to focus search quickly",
    ar: "اضغط Ctrl+K للتركيز على البحث بسرعة",
    ku: "Ctrl+K دابگرە بۆ گەڕان بە خێرایی",
  },
  tooltipLocationMap: {
    en: "Click to open location in Google Maps",
    ar: "انقر لفتح الموقع في خرائط جوجل",
    ku: "کرتە بکە بۆ کردنەوەی شوێن لە گووگڵ مەپ",
  },
};

export const t = (key: string, lang: Language = "en"): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};
