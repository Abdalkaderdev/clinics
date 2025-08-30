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
import WorkingHours from "@/components/WorkingHours";
// Using a medical-themed placeholder logo - replace with actual clinic logo
const logo = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop";

interface ClinicItem {
  id: string;
  name: string;
  description: string;
  beforePrice: string;
  afterPrice: string;
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
  const urlClinic = new URLSearchParams(window.location.search).get('clinic');
  const urlCategory = new URLSearchParams(window.location.search).get('category');
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
    categories: selectedClinic?.categories.map(cat => cat.id) || []
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(urlCategory || "all");

  const mainRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('menuFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
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
    localStorage.setItem("selectedLanguage", newLang);
    navigate(`/menu/${newLang}`);
    setTimeout(() => {
      if (mainRef.current) {
        // Adjust offset for sticky headers (header + search/filters + nav)
        const y = mainRef.current.getBoundingClientRect().top + window.scrollY - 24; // tweak offset as needed
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // Load clinics data based on lang param
  useEffect(() => {
    if (!currentLanguage) return;
    localStorage.setItem("selectedLanguage", currentLanguage);
    setIsRTL(currentLanguage === "ar");
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    setLoading(true);
    const loadClinicsData = async () => {
      try {
        const response = await fetch(`/clinics_${currentLanguage}.json`);
        if (!response.ok) {
          throw new Error('Failed to load clinics');
        }
        const data = await response.json();
        setClinicsData(data);
        
        // Set selected clinic if specified in URL
        if (urlClinic) {
          const clinic = data.clinics.find((c: Clinic) => c.id.toString() === urlClinic);
          setSelectedClinic(clinic || data.clinics[0]);
        } else {
          setSelectedClinic(data.clinics[0]);
        }
      } catch (error) {
        toast({
          title: "Error loading clinics",
          description: "Please try refreshing the page",
          variant: "destructive"
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
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem('menuFavorites', JSON.stringify(newFavorites));
  };

  // Build list of items filtered by selected category
  const allItems = useMemo(() => {
    if (!selectedClinic) return [] as Array<{categoryId: string; categoryName: string; item: any}>;
    return selectedClinic.categories.flatMap(cat =>
      cat.items.map(item => ({
        categoryId: cat.id,
        categoryName: cat.name,
        item: {
          ...item,
          price: parseFloat(item.afterPrice.replace('$', '')),
          originalPrice: parseFloat(item.beforePrice.replace('$', '')),
          beforePrice: item.beforePrice,
          afterPrice: item.afterPrice,
          location: selectedClinic.location,
          contact: selectedClinic.contact
        }
      }))
    );
  }, [selectedClinic]);

  const visibleItems = useMemo(() => {
    if (!selectedClinic) return [] as Array<{categoryId: string; categoryName: string; item: any}>;
    let base = selectedCategoryId === 'all'
      ? allItems
      : allItems.filter(entry => entry.categoryId === selectedCategoryId);
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      base = base.filter(({ item }) => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.location && item.location.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected filters
    if (selectedFilters.length > 0) {
      base = base.filter(({ item }) => {
        return selectedFilters.every(filter => {
          switch (filter) {
            case 'discount':
              return item.originalPrice && item.originalPrice > item.price;
            case 'favorites':
              return favorites.includes(item.id);
            default:
              return true;
          }
        });
      });
    }
    
    return base;
  }, [allItems, selectedClinic, selectedCategoryId, searchQuery, selectedFilters, favorites]);

  // Available filter options for clinics
  const filterOptions = useMemo(() => [
    { id: 'discount', label: '💰 Discount', count: 0 },
    { id: 'favorites', label: '❤️ Favorites', count: favorites.length },
  ], [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!clinicsData || !selectedClinic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load clinics</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? 'rtl font-arabic' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sticky Header with centered logo and language menu */}
      <header className="sticky top-0 z-50 bg-[hsl(0_0%_17%)] text-[hsl(42_73%_94%)] py-3 sm:py-4 px-3 sm:px-4 shadow-md border-b border-border">
        <div className="grid grid-cols-3 items-center">
          <div />
          <div className="flex justify-center">
            <ImageOptimized src={logo} alt="Medical Clinics" className="h-10 sm:h-12 md:h-14 w-auto" width={400} priority={true} sizes="200px" srcSet={`${logo} 400w, ${logo} 800w`} />
          </div>
          {/* Language Menu Button shows current language */}
          <div className="relative justify-self-end">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(0_0%_24%)] hover:bg-[hsl(1_69%_49%)] hover:text-[hsl(42_73%_94%)] focus:outline-none focus:ring-2 focus:ring-[hsl(39_92%_53%)] text-[hsl(42_73%_94%)] font-semibold border border-border"
            onClick={() => setLangMenuOpen(v => !v)}
            aria-label="Open language menu"
          >
            <span>{languages.find(l => l.code === selectedLang)?.label}</span>
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[hsl(0_0%_24%)] text-[hsl(42_73%_94%)] rounded-lg shadow-lg py-2 z-50 border border-border animate-fade-in" onClick={() => setLangMenuOpen(false)}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={e => { e.stopPropagation(); handleLanguageSwitch(lang.code); }}
                  className={`flex items-center w-full px-4 py-2 text-left hover:bg-[hsl(39_92%_53%)] hover:text-[hsl(0_0%_15%)] focus:bg-[hsl(39_92%_53%)] focus:text-[hsl(0_0%_15%)] transition-colors relative ${selectedLang === lang.code ? 'font-bold text-[hsl(39_92%_53%)]' : ''}`}
                  aria-current={selectedLang === lang.code ? 'page' : undefined}
                >
                  <span className="flex-1">{lang.label}</span>
                  {selectedLang === lang.code && (
                    <span className="ml-2 w-2 h-2 bg-[hsl(39_92%_53%)] rounded-full inline-block" aria-label="Current language" />
                  )}
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      </header>

      {/* Clinic and Category navigation */}
      <div className="w-full sticky top-[56px] sm:top-[64px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
        <div className="container mx-auto px-2 py-3">
          {/* Clinic selector */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-2">{selectedClinic.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">��� {selectedClinic.location}</p>
            {clinicsData.clinics.length > 1 && (
              <select
                value={selectedClinic.id}
                onChange={(e) => {
                  const clinic = clinicsData.clinics.find(c => c.id.toString() === e.target.value);
                  if (clinic) setSelectedClinic(clinic);
                }}
                className="px-3 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                {clinicsData.clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            )}
          </div>
          {/* Category navigation */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              {[
                { id: 'all', name: isRTL ? 'الكل' : 'All' },
                ...selectedClinic.categories.map(c => ({ id: c.id, name: c.name }))
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategoryId === cat.id ? 'bg-[hsl(39_92%_53%)] text-[hsl(0_0%_15%)] border-[hsl(39_92%_53%)]' : 'bg-card text-foreground border-border hover:bg-muted'}`}
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
      <div className="w-full sticky top-[104px] sm:top-[112px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
        <div className="container mx-auto px-2 py-3">
          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder={isRTL ? "البحث عن الخدمات..." : "Search services..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Filter Toggle and Filters */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              <span>{isRTL ? "المرشحات" : "Filters"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isRTL ? "مسح الكل" : "Clear all"}
              </button>
            )}
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilters(prev => 
                      prev.includes(filter.id)
                        ? prev.filter(f => f !== filter.id)
                        : [...prev, filter.id]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Working Hours Info */}
      <div className="container mx-auto px-2 py-4">
        <div className="flex justify-center">
          <WorkingHours 
            language={currentLanguage as 'en' | 'ku' | 'ar'} 
            variant="compact" 
            className="text-center"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <main ref={mainRef} className="container mx-auto px-2 py-6 mt-4">
        {visibleItems.length > 0 ? (
          <div className={`grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isRTL ? 'rtl font-arabic' : ''}`}>
            {visibleItems.map(({ item, categoryId }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency="$"
                isRTL={isRTL}
                isFavorite={favorites.includes(item.id)}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <motion.div className="text-center py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-lg text-foreground">{isRTL ? "لا توجد خدمات" : "No services found."}</p>
          </motion.div>
        )}

        {/* Back to main menu (category cards) */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/categories/${lang}`)}
            className="px-6"
          >
            {isRTL ? 'الرجوع إلى العيادات' : 'Back to clinics'}
          </Button>
        </div>
      </main>
    </div>
  );
}