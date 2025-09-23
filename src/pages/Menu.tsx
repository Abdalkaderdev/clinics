import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";
import ImageOptimized from "@/components/ImageOptimized";
import { Separator } from "@/components/ui/separator";
import MenuItemCard from "@/components/MenuItemCard";
import { t } from "@/lib/translations";
// Beauty Land Card logo
const logo = "/images/beauty-final.png";

// Safe localStorage operations
const safeGetItem = (key: string, fallback: string = ""): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

const safeParseJSON = <T,>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

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

export default function Menu() {
  const { lang } = useParams();
  const urlClinic = new URLSearchParams(window.location.search).get("clinic");
  const urlCategory = new URLSearchParams(window.location.search).get(
    "category"
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clinicsData, setClinicsData] = useState<ClinicsData | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { activeCategory } = useScrollCategory({
    categories: selectedClinic?.categories.map((cat) => cat.id) || [],
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    urlCategory || "all"
  );

  const mainRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = safeGetItem("menuFavorites");
    if (savedFavorites) {
      setFavorites(safeParseJSON(savedFavorites, []));
    }
  }, []);

  // Language switcher logic
  const languages = [
    { code: "en", label: "English" },
    { code: "ku", label: "كوردي" },
    { code: "ar", label: "العربيه" },
  ];
  const currentLanguage = lang || "en";
  const selectedLang = currentLanguage;
  const handleLanguageSwitch = (newLang: string) => {
    if (newLang === currentLanguage) return;
    safeSetItem("selectedLanguage", newLang);
    // Preserve clinic parameter when switching languages
    const clinicParam = urlClinic ? `?clinic=${urlClinic}` : '';
    navigate(`/menu/${newLang}${clinicParam}`);
    setTimeout(() => {
      if (mainRef.current) {
        // Adjust offset for sticky headers (header + search/filters + nav)
        const y =
          mainRef.current.getBoundingClientRect().top + window.scrollY - 24; // tweak offset as needed
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  // Load clinics data based on lang param
  useEffect(() => {
    if (!currentLanguage) return;
    safeSetItem("selectedLanguage", currentLanguage);
    setIsRTL(currentLanguage === "ar");
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    setLoading(true);
    const loadClinicsData = async () => {
      try {
        const response = await fetch(`/clinics_${currentLanguage}.json`, {
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error(`Failed to load clinics: ${response.status}`);
        }
        const data = await response.json();

        setClinicsData(data);

        // Set selected clinic if specified in URL
        if (urlClinic) {
          const clinic = data.clinics.find(
            (c: Clinic) => c.id.toString() === urlClinic
          );
          setSelectedClinic(clinic || data.clinics[0]);
        } else {
          setSelectedClinic(data.clinics[0]);
        }

      } catch (error) {
        console.error("Error loading clinics:", error);
        toast({
          title: t("errorLoadingClinics", lang as "en" | "ar" | "ku"),
          description: t("refreshPage", lang as "en" | "ar" | "ku"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadClinicsData();
  }, [currentLanguage, urlClinic, toast]);

  // Toggle favorite item
  const toggleFavorite = (itemId: string) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    safeSetItem("menuFavorites", JSON.stringify(newFavorites));
  };

  // Build list of items filtered by selected category
  const allItems = useMemo(() => {
    if (!selectedClinic)
      return [] as Array<{
        categoryId: string;
        categoryName: string;
        item: any;
      }>;
    return selectedClinic.categories.flatMap((cat) =>
      cat.items.map((item) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        item: {
          ...item,
          price: item.isFree ? 0 : parseFloat(item.afterPrice.replace("$", "")),
          originalPrice: parseFloat(item.beforePrice.replace("$", "")),
          beforePrice: item.beforePrice,
          afterPrice: item.afterPrice,
          isFree: item.isFree,
          location: selectedClinic.location,
          contact: selectedClinic.contact,
        },
      }))
    );
  }, [selectedClinic]);

  const visibleItems = useMemo(() => {
    console.log("Calculating visible items...");
    console.log("selectedClinic:", selectedClinic);
    console.log("allItems:", allItems);
    console.log("selectedCategoryId:", selectedCategoryId);

    if (!selectedClinic) {
      console.log("No selected clinic, returning empty array");
      return [] as Array<{
        categoryId: string;
        categoryName: string;
        item: any;
      }>;
    }

    let base =
      selectedCategoryId === "all"
        ? allItems
        : allItems.filter((entry) => entry.categoryId === selectedCategoryId);

    console.log("Base items after category filter:", base);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      base = base.filter(
        ({ item }) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.location && item.location.toLowerCase().includes(query))
      );
    }

    // Filter by selected filters
    if (selectedFilters.length > 0) {
      base = base.filter(({ item }) => {
        return selectedFilters.every((filter) => {
          switch (filter) {
            case "discount":
              return (
                !item.isFree &&
                item.originalPrice &&
                item.originalPrice > item.price
              );
            case "free":
              return item.isFree === true;
            case "favorites":
              return favorites.includes(item.id);
            default:
              return true;
          }
        });
      });
    }

    console.log("Final visible items:", base);
    return base;
  }, [
    allItems,
    selectedClinic,
    selectedCategoryId,
    searchQuery,
    selectedFilters,
    favorites,
  ]);

  // Available filter options for clinics
  const filterOptions = useMemo(() => {
    const currentLanguage = lang || "en";
    return [
      {
        id: "free",
        label: t("freeServices", currentLanguage as "en" | "ar" | "ku"),
        count: 0,
      },
      {
        id: "discount",
        label: t("discount", currentLanguage as "en" | "ar" | "ku"),
        count: 0,
      },
      {
        id: "favorites",
        label: t("favorites", currentLanguage as "en" | "ar" | "ku"),
        count: favorites.length,
      },
    ];
  }, [favorites, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!clinicsData || !selectedClinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">
          {t("failedToLoadClinics", lang as "en" | "ar" | "ku")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "rtl font-arabic" : currentLanguage === "ku" ? "font-kurdish" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Sticky Header with centered logo and language menu */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 sm:py-4 px-3 sm:px-4 shadow-lg border-b border-pink-500">
        <div className="grid grid-cols-3 items-center">
          <div />
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
          {/* Language Menu Button shows current language */}
          <div className="relative justify-self-end">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-700 hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-white font-semibold border border-pink-600"
              onClick={() => setLangMenuOpen((v) => !v)}
              aria-label="Open language menu"
            >
              <span>
                {languages.find((l) => l.code === selectedLang)?.label}
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
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSwitch(lang.code);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-left hover:bg-pink-600 hover:text-white focus:bg-pink-600 focus:text-white transition-colors relative ${selectedLang === lang.code ? "font-bold text-pink-300" : ""}`}
                    aria-current={
                      selectedLang === lang.code ? "page" : undefined
                    }
                  >
                    <span className="flex-1">{lang.label}</span>
                    {selectedLang === lang.code && (
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

      {/* Clinic and Category navigation */}
      <div className="w-full sticky top-[56px] sm:top-[64px] z-40 bg-pink-50/95 backdrop-blur supports-[backdrop-filter]:bg-pink-50/90 border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-2 py-2 sm:py-3">
          {/* Clinic selector */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-2">
              {selectedClinic.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              ��� {selectedClinic.location}
            </p>
            {clinicsData.clinics.length > 1 && (
              <select
                value={selectedClinic.id}
                onChange={(e) => {
                  const clinic = clinicsData.clinics.find(
                    (c) => c.id.toString() === e.target.value
                  );
                  if (clinic) setSelectedClinic(clinic);
                }}
                className="px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-sm"
              >
                {clinicsData.clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Category navigation */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              {[
                { id: "all", name: t("all", lang as "en" | "ar" | "ku") },
                ...selectedClinic.categories.map((c) => ({
                  id: c.id,
                  name: c.name,
                })),
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-3 rounded-full text-sm font-medium border-2 transition-colors ${selectedCategoryId === cat.id ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white border-pink-500 shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-pink-300"}`}
                  aria-pressed={selectedCategoryId === cat.id}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="w-full sticky top-[104px] sm:top-[112px] z-30 bg-blue-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/90 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-2 py-2 sm:py-3">
          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder={t("searchServices", lang as "en" | "ar" | "ku")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm"
            />
          </div>

          {/* Filter Toggle and Filters */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-pink-200 bg-white text-pink-700 hover:bg-pink-50 transition-colors shadow-sm"
            >
              <span>
                {t("filters", lang as "en" | "ar" | "ku")}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                {t("clearAll", lang as "en" | "ar" | "ku")}
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilters((prev) =>
                      prev.includes(filter.id)
                        ? prev.filter((f) => f !== filter.id)
                        : [...prev, filter.id]
                    );
                  }}
                  className={`px-3 py-2 rounded-full text-sm border-2 transition-colors shadow-sm ${
                    selectedFilters.includes(filter.id)
                      ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white border-pink-500"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-pink-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <main ref={mainRef} className="container mx-auto px-2 py-6 mt-4">
        {visibleItems.length > 0 ? (
          <div
            className={`grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isRTL ? "rtl font-arabic" : currentLanguage === "ku" ? "font-kurdish" : ""}`}
          >
            {visibleItems.map(({ item, categoryId }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency="$"
                isRTL={isRTL}
                isFavorite={favorites.includes(item.id)}
                onFavoriteToggle={toggleFavorite}
                language={lang}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-foreground">
              {t("noServicesFound", lang as "en" | "ar" | "ku")}
            </p>
          </motion.div>
        )}

        {/* Back to main menu (category cards) */}
        <div className="mt-10 flex justify-center">
          <Button
            onClick={() => navigate(`/categories/${lang}`)}
            className="px-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white border-0 shadow-md"
          >
            {t("backToClinics", lang as "en" | "ar" | "ku")}
          </Button>
        </div>
      </main>
    </div>
  );
}
