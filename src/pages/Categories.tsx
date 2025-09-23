import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

import { ChevronDown } from "lucide-react";
import { t } from "@/lib/translations";
import ImageOptimized from "@/components/ImageOptimized";
import BreadcrumbNav from "@/components/BreadcrumbNav";

const logo = "/images/beauty-final.png";

interface ClinicItem {
  id: string;
  name: string;
  description: string;
  beforePrice: string;
  afterPrice: string;
  isFree?: boolean;
}
interface ClinicCategory {
  id: string;
  name: string;
  items: ClinicItem[];
}
interface Clinic {
  id: number;
  name: string;
  location: string;
  contact: string;
  categories: ClinicCategory[];
}
interface ClinicsData {
  clinics: Clinic[];
}

const Categories = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClinicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "ku", label: "كوردي" },
    { code: "ar", label: "العربيه" },
  ];

  const handleLanguageSwitch = (newLang: string) => {
    if (newLang === lang) return;
    localStorage.setItem("selectedLanguage", newLang);
    navigate(`/categories/${newLang}`);
  };

  useEffect(() => {
    if (lang) {
      localStorage.setItem("selectedLanguage", lang);
      setIsRTL(lang === "ar");
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
    
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const allowedLangs = ['en', 'ar', 'ku'];
        const safeLang = allowedLangs.includes(lang as string) ? lang : 'en';
        const res = await fetch(`/clinics_${safeLang}.json`);

        if (!res.ok) {
          throw new Error(`Failed to load clinics: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load clinic data:', err instanceof Error ? err.message : 'Unknown error');
        setError(t("loadError", lang as "en" | "ar" | "ku"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  const allClinics = useMemo(() => data?.clinics ?? [], [data]);

  const filteredClinics = useMemo(() => {
    if (!searchQuery.trim()) return allClinics;

    const query = searchQuery.toLowerCase();
    return allClinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(query) ||
        clinic.location.toLowerCase().includes(query) ||
        clinic.categories.some(
          (cat) =>
            cat.name.toLowerCase().includes(query) ||
            cat.items.some(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            )
        )
    );
  }, [allClinics, searchQuery]);

  const clinicsWithServices = useMemo(
    () =>
      filteredClinics.map((clinic) => ({
        ...clinic,
        totalServices: clinic.categories.reduce(
          (sum, cat) => sum + cat.items.length,
          0
        ),
      })),
    [filteredClinics]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="main" aria-live="polite">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-lg" aria-live="assertive">
            {t("loading", lang as "en" | "ar" | "ku") || "Loading clinics..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="main" aria-live="assertive">
        <div className="text-center p-8">
          <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
          <h1 className="text-lg text-red-700 mb-4" role="alert">{error}</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300 min-h-[44px]"
            aria-label="Reload page to try again"
          >
            {t("tryAgain", lang as "en" | "ar" | "ku")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl font-arabic" : lang === "ku" ? "font-kurdish" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with logo and language switcher */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 sm:py-4 px-3 sm:px-4 shadow-lg border-b border-pink-500">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-700 hover:bg-pink-600 transition-colors"
              aria-label="Back to home"
            >
              <span className="text-lg">←</span>
              <span className="hidden sm:inline">{t("home", lang as "en" | "ar" | "ku") || "Home"}</span>
            </button>
          </div>
          <div className="flex justify-center">
            <ImageOptimized
              src={logo}
              alt="Beauty Land Card"
              className="h-10 sm:h-12 md:h-14 w-auto"
              width={400}
              priority={true}
              sizes="200px"
              srcSet={"/images/beauty-final.png 400w"}
            />
          </div>
          <div className="relative justify-self-end">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-700 hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-white font-semibold border border-pink-600"
              onClick={() => setLangMenuOpen((v) => !v)}
              aria-label="Open language menu"
            >
              <span>
                {languages.find((l) => l.code === lang)?.label}
              </span>
              <ChevronDown
                className={`${isRTL ? 'mr-1' : 'ml-1'} h-4 w-4 transition-transform ${langMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {langMenuOpen && (
              <div
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-pink-700 text-white rounded-lg shadow-xl py-2 z-50 border border-pink-600 animate-fade-in`}
                onClick={() => setLangMenuOpen(false)}
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSwitch(language.code);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-left hover:bg-pink-600 hover:text-white focus:bg-pink-600 focus:text-white transition-colors relative ${lang === language.code ? "font-bold text-pink-300" : ""}`}
                    aria-current={lang === language.code ? "page" : undefined}
                  >
                    <span className="flex-1">{language.label}</span>
                    {lang === language.code && (
                      <span
                        className={`${isRTL ? 'mr-2' : 'ml-2'} w-2 h-2 bg-pink-300 rounded-full inline-block`}
                        aria-label="Current language"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      <BreadcrumbNav language={lang || "en"} isRTL={isRTL} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t("partnersTitle", lang as "en" | "ar" | "ku")}
          </h1>
          <p className="text-muted-foreground mb-2">
            {t("clinicsCount", lang as "en" | "ar" | "ku")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("exclusiveDiscounts", lang as "en" | "ar" | "ku")}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="search"
              placeholder={t("searchPlaceholder", lang as "en" | "ar" | "ku")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 text-sm sm:text-base rounded-lg border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 shadow-sm min-h-[44px] ${isRTL ? 'text-right' : 'text-left'}`}
              role="searchbox"
              aria-label={t("searchPlaceholder", lang as "en" | "ar" | "ku")}
            />
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-slate-400`}>
              🔍
            </div>
          </div>
        </div>

        {clinicsWithServices.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clinicsWithServices.map((clinic) => {
              return (
                <motion.button
                  key={clinic.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/menu/${lang}?clinic=${clinic.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/menu/${lang}?clinic=${clinic.id}`);
                    }
                  }}
                  className="text-left w-full focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 rounded-2xl"
                  aria-label={`Open ${clinic.name} services menu. ${clinic.totalServices} services available with discounts and free treatments.`}
                  tabIndex={0}
                  role="button"
                >
                  <Card className="relative border-2 border-slate-200 hover:border-pink-300 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-200 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full group">
                    <div className="p-6 text-center flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                      <div className="flex-1">
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          🏥
                        </div>
                        <h2 className="text-gray-900 text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 leading-tight break-words hyphens-auto">
                          {clinic.name}
                        </h2>
                        <p className="text-gray-800 text-xs sm:text-sm mb-3 leading-relaxed break-words">
                          📍 {clinic.location}
                        </p>
                      </div>
                      <div className="space-y-2 mt-auto">
                        <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
                          {clinic.totalServices}{" "}
                          {t("services", lang as "en" | "ar" | "ku")} •{" "}
                          {t("discountsAvailable", lang as "en" | "ar" | "ku")}
                        </div>
                        <div className="flex justify-center gap-1 flex-wrap">
                          {(() => {
                            const freeCount = clinic.categories.reduce((sum, cat) => 
                              sum + cat.items.filter(item => item.isFree).length, 0
                            );
                            const discountCount = clinic.categories.reduce((sum, cat) => 
                              sum + cat.items.filter(item => !item.isFree && item.beforePrice && item.afterPrice).length, 0
                            );
                            return (
                              <>
                                {freeCount > 0 && (
                                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                                    🎁 {freeCount} {t("freeItems", lang as "en" | "ar" | "ku")}
                                  </span>
                                )}
                                {discountCount > 0 && (
                                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                    💰 {discountCount} {t("discountItems", lang as "en" | "ar" | "ku")}
                                  </span>
                                )}
                              </>
                            );
                          })()} 
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {t("noClinicsFound", lang as "en" | "ar" | "ku")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
