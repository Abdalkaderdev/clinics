import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollCategory } from "@/hooks/useScrollCategory";
import ImageOptimized from "@/components/ImageOptimized";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemSkeleton from "@/components/MenuItemSkeleton";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { t } from "@/lib/translations";
import { parsePriceToNumber, sanitizeQuery } from "@/lib/utils";
import { useClinics, type SupportedLang } from "@/hooks/useClinics";
// Beauty Land Card logo
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  const { activeCategory, scrollToCategory, observeCategory } = useScrollCategory({
    categories: selectedClinic?.categories.map((cat) => cat.id) || [],
  });

  // Setup intersection observers for category sections
  useEffect(() => {
    if (!selectedClinic || selectedCategoryId !== "all") return;

    const observers: (() => void)[] = [];

    try {
      (selectedClinic.categories ?? []).forEach((category) => {
        const element = document.getElementById(`category-${category.id}`);
        if (element && observeCategory) {
          const cleanup = observeCategory(category.id, element);
          if (cleanup) observers.push(cleanup);
        }
      });
    } catch (error) {
      console.warn('Error setting up category observers:', error);
    }

    return () => {
      try {
        observers.forEach((cleanup) => cleanup());
      } catch (error) {
        console.warn('Error cleaning up observers:', error);
      }
    };
  }, [selectedClinic, selectedCategoryId, observeCategory]);

  // Update selected category when scrolling (only when viewing all categories)
  useEffect(() => {
    if (activeCategory && activeCategory !== selectedCategoryId && selectedCategoryId === "all") {
      setSelectedCategoryId(activeCategory);
    }
  }, [activeCategory, selectedCategoryId]);

  const mainRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset category when clinic changes to prevent empty states
  useEffect(() => {
    if (selectedClinic) {
      setSelectedCategoryId('all');
    }
  }, [selectedClinic?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Number keys 1-9 for category navigation
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const categoryIndex = parseInt(e.key) - 1;
        const categories = [{ id: "all" }, ...selectedClinic?.categories || []];
        if (categories[categoryIndex]) {
          setSelectedCategoryId(categories[categoryIndex].id);
          if (categories[categoryIndex].id !== 'all') {
            scrollToCategory(categories[categoryIndex].id);
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedClinic, scrollToCategory]);



  // Language switcher logic
  const languages = [
    { code: "en", label: "English" },
    { code: "ku", label: "كوردي" },
    { code: "ar", label: "العربيه" },
  ];
  const currentLanguage = lang || "en";
  const selectedLang = currentLanguage;
  const { data: rqClinicsData, isLoading, isError } = useClinics(currentLanguage as SupportedLang);

  // Memoized category list for navigation (must be declared before usage)
  const categoryList = useMemo(() => {
    return [{ id: "all", name: t("all", lang as "en" | "ar" | "ku") }, ...(selectedClinic?.categories.map((c) => ({ id: c.id, name: c.name })) || [])];
  }, [selectedClinic, lang]);

  const handleCategoryClick = useCallback((id: string) => {
    setSelectedCategoryId(id);
    if (id !== 'all') {
      const element = document.getElementById(`category-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
  }, []);

  const handleCategoriesKeyNav = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!categoryList.length) return;
    const currentIndex = Math.max(0, categoryList.findIndex(c => c.id === selectedCategoryId));
    if (e.key === 'ArrowRight') {
      const next = categoryList[Math.min(currentIndex + 1, categoryList.length - 1)];
      handleCategoryClick(next.id);
    } else if (e.key === 'ArrowLeft') {
      const prev = categoryList[Math.max(currentIndex - 1, 0)];
      handleCategoryClick(prev.id);
    } else if (e.key === 'Home') {
      handleCategoryClick(categoryList[0].id);
    } else if (e.key === 'End') {
      handleCategoryClick(categoryList[categoryList.length - 1].id);
    }
  }, [categoryList, selectedCategoryId, handleCategoryClick]);

  const handleLanguageSwitch = (newLang: string) => {
    if (newLang === currentLanguage) return;
    localStorage.setItem("selectedLanguage", newLang);
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

  // RTL and language setup + react-query data sync
  useEffect(() => {
    if (!currentLanguage) return;
    localStorage.setItem("selectedLanguage", currentLanguage);
    const rtl = ["ar"].includes(currentLanguage);
    setIsRTL(rtl);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (rqClinicsData) {
      setClinicsData(rqClinicsData as ClinicsData);
      const data = rqClinicsData as ClinicsData;
      if (urlClinic) {
        const clinic = data.clinics.find((c: Clinic) => c.id.toString() === urlClinic);
        setSelectedClinic(clinic || data.clinics[0]);
      } else {
        setSelectedClinic(data.clinics[0]);
      }
    }
  }, [rqClinicsData, urlClinic]);

  useEffect(() => {
    if (isError) {
      toast({
        title: t("errorLoadingClinics", lang as "en" | "ar" | "ku"),
        description: t("refreshPage", lang as "en" | "ar" | "ku"),
        variant: "destructive",
      });
    }
  }, [isError, toast, lang]);


  // Build list of all items from all categories
  const allItems = useMemo(() => {
    if (!selectedClinic)
      return [] as Array<{
        categoryId: string;
        categoryName: string;
        item: ClinicItem & { price: number; originalPrice: number; location?: string; contact?: string; };
      }>;
    return (selectedClinic.categories ?? []).flatMap((cat) =>
      cat.items.map((item) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        item: {
          ...item,
          price: item.isFree ? 0 : parsePriceToNumber(item.afterPrice),
          originalPrice: parsePriceToNumber(item.beforePrice),
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

    // Always show all items by default, but allow category filtering
    let base = selectedCategoryId === "all" 
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



  if (loading) {
    return (
      <div className={`min-h-screen bg-background ${isRTL ? "rtl font-arabic" : currentLanguage === "ku" ? "font-kurdish" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg h-20 animate-pulse"></header>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <MenuItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!clinicsData || !selectedClinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-2xl shadow-lg border border-pink-100">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-xl font-bold text-pink-900 mb-4">
            {t("failedToLoadClinics", lang as "en" | "ar" | "ku")}
          </h1>
          <p className="text-gray-700 mb-6">
            {t("refreshPage", lang as "en" | "ar" | "ku")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-pink-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md min-h-[44px]"
          >
            {t("tryAgain", lang as "en" | "ar" | "ku") || "Try Again"}
          </button>
        </div>
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
              className="flex items-center gap-1 px-2 py-2 rounded bg-pink-700 hover:bg-pink-600 focus:bg-pink-600 active:bg-pink-800 active:scale-95 transition-all duration-150 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label="Back to clinics"
            >
              <span className="text-lg">←</span>
              <span className="text-xs sm:text-sm">{t("backToClinics", lang as "en" | "ar" | "ku")}</span>
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
                className="flex items-center gap-1 px-2 py-2 rounded bg-pink-700 hover:bg-pink-600 focus:bg-pink-600 active:bg-pink-800 active:scale-95 transition-all duration-150 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-pink-300"
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
        
        {/* Always Visible Clinic Info */}
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
              {clinicsData && clinicsData.clinics.length > 1 && (
                <select
                  value={selectedClinic.id}
                  onChange={(e) => {
                    const clinic = clinicsData.clinics.find(
                      (c) => c.id.toString() === e.target.value
                    );
                    if (clinic) {
                      // Reset category first to prevent empty state
                      setSelectedCategoryId('all');
                      setSelectedClinic(clinic);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="mt-2 px-3 py-2 rounded-lg bg-pink-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 hover:bg-pink-600 transition-colors min-h-[44px]"
                >
                  {clinicsData.clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id} className="bg-pink-700 text-white">
                      {clinic.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={() => setHeaderCollapsed(!headerCollapsed)}
              className="ml-2 p-2 rounded hover:bg-pink-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={headerCollapsed ? 'Expand' : 'Collapse'}
              title={t("tooltipCollapseHeader", lang as "en" | "ar" | "ku")}
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${headerCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Collapsible Categories and Search */}
        <div className={`transition-all duration-300 ${headerCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-96'}`}>
          <div className="px-3 py-2 bg-pink-50 text-gray-800">
            <div className="overflow-x-auto mb-2">
              <div className="flex gap-1 whitespace-nowrap" role="tablist" aria-label="Categories" onKeyDown={handleCategoriesKeyNav}>
                {categoryList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-3 py-2 rounded-full text-xs font-medium min-h-[40px] min-w-[40px] ${selectedCategoryId === cat.id ? "bg-pink-500 text-white" : "bg-white text-gray-700 hover:bg-pink-100"}`}
                    aria-pressed={selectedCategoryId === cat.id}
                    aria-current={selectedCategoryId === cat.id ? 'true' : undefined}
                    role="tab"
                    aria-label={`Filter by ${cat.name} category`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <input
              ref={searchInputRef}
              type="search"
              placeholder={t("searchServicesWithCount", lang as "en" | "ar" | "ku").replace("{count}", allItems.length.toString())}
              value={searchQuery}
              onChange={(e) => setSearchQuery(sanitizeQuery(e.target.value))}
              className="w-full max-w-none px-4 py-3 text-sm rounded-lg border border-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 min-h-[44px] transition-all duration-150"
              role="searchbox"
              aria-label={t("searchServicesWithCount", lang as "en" | "ar" | "ku").replace("{count}", allItems.length.toString())}
              aria-describedby="search-help"
              title={t("tooltipSearchShortcut", lang as "en" | "ar" | "ku")}
              autoComplete="off"
            />
            <div id="search-help" className="sr-only">
              {t("searchHelpText", lang as "en" | "ar" | "ku") || "Search through available services and treatments. Press Ctrl+K to focus search, use number keys 1-9 for category navigation."}
            </div>
            <div className="sr-only" aria-live="polite">
              {t("searchResultsCount", lang as "en" | "ar" | "ku")}: {visibleItems.length}
            </div>
          </div>
        </div>
      </header>
      
      <BreadcrumbNav 
        language={lang || "en"} 
        isRTL={isRTL} 
        clinicName={selectedClinic?.name}
      />



      {/* Menu Grid */}
      <main ref={mainRef} className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {visibleItems.length > 0 ? (
          <div className={`space-y-8 ${isRTL ? "rtl font-arabic" : currentLanguage === "ku" ? "font-kurdish" : ""}`}>
            {/* All Services Summary */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {selectedClinic.name} - All Services
              </h2>
              <p className="text-gray-600">
                {allItems.length} services available • Use categories above to filter
              </p>
            </div>
            {selectedCategoryId === "all" ? (
              // Group by category when showing all
              (selectedClinic.categories ?? []).map((category) => {
                const categoryItems = allItems.filter(({ categoryId }) => categoryId === category.id);
                if (categoryItems.length === 0) return null;
                return (
                  <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                    <div className="bg-gradient-to-r from-pink-50 to-blue-50 border-l-4 border-pink-500 rounded-r-lg px-4 py-3 mb-6">
                      <h3 className="text-xl font-semibold text-pink-900 m-0">{category.name}</h3>
                    </div>
                    <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryItems.map(({ item }, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                        >
                          <MenuItemCard
                            item={item}
                            currency="$"
                            isRTL={isRTL}
                            isFavorite={favorites.includes(item.id)}
                            onFavoriteToggle={() => {}}
                            language={lang}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              // Single category view
              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map(({ item }, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <MenuItemCard
                      item={item}
                      currency="$"
                      isRTL={isRTL}
                      isFavorite={favorites.includes(item.id)}
                      onFavoriteToggle={() => {}}
                      language={lang}
                    />
                  </motion.div>
                ))}
              </div>
            )}
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
