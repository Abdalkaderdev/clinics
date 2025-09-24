import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import ImageOptimized from "@/components/ImageOptimized";
import { trackPageView, trackLanguageSelect } from "@/lib/analytics";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/translations";
// Beauty Land Card logo
const logo = "/images/beauty-final.webp";

// Animation variants moved outside component for performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const Index = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState("en");
  const isRTL = ["ar", "ku"].includes(currentLang);

  // Track page view on mount and get current language
  useEffect(() => {
    trackPageView("home");
    const savedLang = localStorage.getItem("selectedLanguage") || "en";
    setCurrentLang(savedLang);
    const rtl = ["ar", "ku"].includes(savedLang);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, []);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "ku", name: "Kurdish", flag: "🇮🇶", nativeName: "کوردی" },
    { code: "ar", name: "العربية", flag: "🇸🇾", nativeName: "العربية" },
  ];

  const handleLanguageSelect = (langCode: string) => {
    try {
      localStorage.setItem("selectedLanguage", langCode);
      trackLanguageSelect(langCode);
    } catch (error) {
      console.warn('Analytics failed:', error);
    }
    navigate(`/categories/${langCode}`);
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      <div
        id="main-content"
        className={`min-h-screen relative flex items-center justify-center bg-background ${isRTL ? "rtl font-arabic" : currentLang === "ku" ? "font-kurdish" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
        role="main"
      >
      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand */}
        <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
          <ImageOptimized
            src={logo}
            alt="Beauty Land Card Logo"
            className="mx-auto mb-6 w-32 sm:w-40 md:w-48 lg:w-56 h-auto max-w-full object-contain"
            priority={true}
            width={400}
            sizes="(min-width:1024px) 480px, 40vw"
            srcSet={"/images/beauty-final.webp 800w"}
          />
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4 drop-shadow-lg font-display tracking-wide"
            style={{
              background: "linear-gradient(135deg, #EC4899 0%, #3B82F6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            variants={itemVariants}
          >
            Beauty Land Card
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t("tagline", currentLang as "en" | "ar" | "ku")}
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-6 text-sm sm:text-base"
            variants={itemVariants}
          >
            <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full font-medium border border-pink-200">
              {t("beautyTreatments", currentLang as "en" | "ar" | "ku")}
            </span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
              {t("medicalServices", currentLang as "en" | "ar" | "ku")}
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium border border-emerald-200">
              {t("freeItemsAvailable", currentLang as "en" | "ar" | "ku")}
            </span>
          </motion.div>
        </motion.div>

        {/* Language Selection */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white backdrop-blur-sm shadow-lg border border-slate-200">
            <CardContent className="p-4 sm:p-8">
              <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                variants={itemVariants}
              >
                <Stethoscope className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {t("chooseLanguage", currentLang as "en" | "ar" | "ku")}
                </h2>
              </motion.div>

              <div className="grid gap-4 sm:gap-5">
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.code}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-base sm:text-lg py-4 sm:py-6 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300 ${lang.code === currentLang ? "bg-gradient-to-r from-pink-700 to-blue-700 ring-2 ring-pink-300 ring-offset-2" : "bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700"} ${lang.code === "ar" ? "font-arabic" : ""}`}
                      aria-label={`Select ${lang.name} language${lang.code === currentLang ? ' (currently selected)' : ''}`}
                      aria-describedby={`lang-desc-${lang.code}`}
                      role="button"
                      aria-pressed={lang.code === currentLang}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold" id={`lang-desc-${lang.code}`}>{lang.nativeName}</span>
                        {lang.code === currentLang && (
                          <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full" aria-label="Current language">
                            ✓
                          </span>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div className="mt-8" variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100">
              <div className="text-3xl mb-2">🏥</div>
              <h3 className="font-semibold text-pink-900 mb-1">8 Premium Clinics</h3>
              <p className="text-sm text-gray-600">Beauty & medical centers in Erbil</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-blue-900 mb-1">Up to 50% Off</h3>
              <p className="text-sm text-gray-600">Exclusive discounts on treatments</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-semibold text-emerald-900 mb-1">Free Services</h3>
              <p className="text-sm text-gray-600">Complimentary consultations</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
};

export default Index;
