import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";
import ImageOptimized from "@/components/ImageOptimized";
import MenuItemCard from "@/components/MenuItemCard";
import BreadcrumbNav from "@/components/BreadcrumbNav";
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
  const [selectedFilters] = useState<string[]>([]);

  const [favorites] = useState<string[]>([]);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  useScrollCategory({
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
  }, [currentLanguage, urlClinic, toast, lang]);



  // Build list of items filtered by selected category
  const allItems = useMemo(() => {
    if (!selectedClinic)
      return [] as Array<{
        categoryId: string;
        categoryName: string;
        item: ClinicItem & { price: number; originalPrice: number; location?: string; contact?: string; };
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
    if (!selectedClinic) {
      return [] as Array<{
        categoryId: string;
        categoryName: string;
        item: ClinicItem & { price: number; originalPrice: number; location?: string; contact?: string; };
      }>;
    }

    let base =
      selectedCategoryId === "all"
        ? allItems
        : allItems.filter((entry) => entry.categoryId === selectedCategoryId);

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
  useMemo(() => {
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
      <div className="min-h-screen bg-background flex items-center justify-center" role="main" aria-live="polite">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-lg" aria-live="assertive">
            {t("loading", lang as "en" | "ar" | "ku") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!clinicsData || !selectedClinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-700 font-semibold">
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
      {/* Consolidated Sticky Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg">
        {/* Main Header Row */}
        <div className="px-3 py-2 border-b border-pink-500">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={() => navigate(`/categories/${lang}`)}
              className="flex items-center gap-1 px-2 py-2 rounded bg-pink-700 hover:bg-pink-600 min-h-[44px]"
              aria-label="Back to clinics"
            >
              <span className="text-xl">←</span>
              <span className="hidden sm:inline text-sm">{t("backToClinics", lang as "en" | "ar" | "ku")}</span>
            </button>
            
            <ImageOptimized
              src={logo}
              alt="Beauty Land Card"
              className="h-8 w-auto mx-auto"
              width={200}
              priority={true}
            />
            
            <div className="relative justify-self-end">
              <button
                className="flex items-center gap-1 px-2 py-2 rounded bg-pink-700 hover:bg-pink-600 text-sm min-h-[44px]"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-label="Language menu"
              >
                <span>{languages.find((l) => l.code === selectedLang)?.label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langMenuOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-1 w-32 bg-pink-700 rounded shadow-xl py-1 z-50 border border-pink-600`}>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        handleLanguageSwitch(language.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-pink-600 text-sm min-h-[44px] text-white transition-colors ${selectedLang === language.code ? 'bg-pink-600 font-semibold' : ''}`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Collapsible Content */}
        <div className={`transition-all duration-300 ${headerCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-96'}`}>
          <div className="px-3 py-2 bg-pink-600/80">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold truncate">{selectedClinic.name}</h2>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClinic.location)}`, '_blank')}
                  className="text-xs text-pink-100 hover:text-white hover:underline transition-colors flex items-center gap-1 truncate focus:outline-none focus:ring-2 focus:ring-pink-300 rounded px-1 py-0.5"
                  aria-label={`Open ${selectedClinic.location} in Google Maps`}
                >
                  📍 {selectedClinic.location}
                </button>
              </div>
              <button
                onClick={() => setHeaderCollapsed(!headerCollapsed)}
                className="ml-2 p-2 rounded hover:bg-pink-500 min-h-[44px] min-w-[44px]"
                aria-label={headerCollapsed ? 'Expand' : 'Collapse'}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${headerCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="px-3 py-2 bg-pink-50 text-gray-800">
            <div className="overflow-x-auto mb-2">
              <div className="flex gap-1 whitespace-nowrap">
                {[{ id: "all", name: t("all", lang as "en" | "ar" | "ku") }, ...selectedClinic.categories.map((c) => ({ id: c.id, name: c.name }))].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-4 py-3 rounded-full text-sm font-medium min-h-[44px] min-w-[44px] ${selectedCategoryId === cat.id ? "bg-pink-500 text-white" : "bg-white text-gray-700 hover:bg-pink-100"}`}
                    aria-pressed={selectedCategoryId === cat.id}
                    aria-label={`Filter by ${cat.name} category`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <input
              type="search"
              placeholder={t("searchServices", lang as "en" | "ar" | "ku")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-none px-4 py-3 text-sm rounded-lg border border-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 min-h-[44px]"
              role="searchbox"
              aria-label={t("searchServices", lang as "en" | "ar" | "ku")}
              aria-describedby="search-help"
              autoComplete="off"
            />
            <div id="search-help" className="sr-only">
              {t("searchHelpText", lang as "en" | "ar" | "ku") || "Search through available services and treatments"}
            </div>
          </div>
        </div>
      </header>
      
      <BreadcrumbNav 
        language={lang || "en"} 
        isRTL={isRTL} 
        clinicName={selectedClinic?.name}
      />

      {/* Clinic and Category navigation */}
      <div className="w-full sticky top-[56px] sm:top-[64px] z-40 bg-pink-50/95 backdrop-blur supports-[backdrop-filter]:bg-pink-50/90 border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-2 py-2 sm:py-3">
          {/* Clinic selector */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-2">
              {selectedClinic.name}
            </h2>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClinic.location)}`, '_blank')}
              className="text-sm text-blue-700 hover:text-blue-800 hover:underline mb-2 font-medium transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 py-0.5"
              aria-label={`Open ${selectedClinic.location} in Google Maps`}
            >
              📍 {selectedClinic.location}
            </button>
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
                  className={`px-4 py-3 rounded-full text-sm font-medium border-2 transition-colors min-h-[44px] min-w-[44px] ${selectedCategoryId === cat.id ? "bg-gradient-to-r from-pink-700 to-blue-700 text-white border-pink-700 shadow-md" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-pink-300"}`}
                  aria-pressed={selectedCategoryId === cat.id}
                  aria-label={`View ${cat.name} services`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main ref={mainRef} className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {visibleItems.length > 0 ? (
          <div
            className={`grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isRTL ? "rtl font-arabic" : currentLanguage === "ku" ? "font-kurdish" : ""}`}
          >
            {visibleItems.map(({ item }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency="$"
                isRTL={isRTL}
                isFavorite={favorites.includes(item.id)}
                onFavoriteToggle={() => {}}
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
            className="px-6 bg-gradient-to-r from-pink-700 to-blue-700 hover:from-pink-800 hover:to-blue-800 text-white border-0 shadow-md"
          >
            {t("backToClinics", lang as "en" | "ar" | "ku")}
          </Button>
        </div>
      </main>
    </div>
  );
}
