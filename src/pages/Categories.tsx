import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/translations";


interface ClinicItem { id: string; name: string; description: string; beforePrice: string; afterPrice: string }
interface ClinicCategory { id: string; name: string; items: ClinicItem[] }
interface Clinic { id: number; name: string; location: string; contact: string; categories: ClinicCategory[] }
interface ClinicsData { clinics: Clinic[] }

const Categories = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClinicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/clinics_${lang}.json`);
        
        if (!res.ok) {
          throw new Error(`Failed to load clinics: ${res.status}`);
        }
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(t('loadError', lang as 'en' | 'ar' | 'ku'));
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
    return allClinics.filter(clinic => 
      clinic.name.toLowerCase().includes(query) ||
      clinic.location.toLowerCase().includes(query) ||
      clinic.categories.some(cat => 
        cat.name.toLowerCase().includes(query) ||
        cat.items.some(item => 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      )
    );
  }, [allClinics, searchQuery]);

  const clinicsWithServices = useMemo(() => 
    filteredClinics.map(clinic => ({
      ...clinic,
      totalServices: clinic.categories.reduce((sum, cat) => sum + cat.items.length, 0)
    })), [filteredClinics]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            {t('tryAgain', lang as 'en' | 'ar' | 'ku')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
          {t('partnersTitle', lang as 'en' | 'ar' | 'ku')}
        </h1>
        <p className="text-muted-foreground mb-2">
          {t('clinicsCount', lang as 'en' | 'ar' | 'ku')}
        </p>
          <p className="text-sm text-muted-foreground">
          {t('exclusiveDiscounts', lang as 'en' | 'ar' | 'ku')}
        </p>
        </div>
        
        {/* Search Input */}
        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            placeholder={t('searchPlaceholder', lang as 'en' | 'ar' | 'ku')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm sm:max-w-md mx-auto px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center shadow-sm"
          />
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
                  className="text-left w-full"
                  aria-label={`Open ${clinic.name}`}
                >
                  <Card className="relative border-2 border-slate-200 hover:border-pink-300 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full group">
                    <div className="p-6 text-center flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                      <div className="flex-1">
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏥</div>
                        <h2 className="text-slate-800 text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 leading-tight break-words hyphens-auto">
                          {clinic.name}
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mb-3 leading-relaxed break-words">
                          📍 {clinic.location}
                        </p>
                      </div>
                                  <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-semibold mt-auto shadow-sm">
              {clinic.totalServices} {t('services', lang as 'en' | 'ar' | 'ku')} • {t('discountsAvailable', lang as 'en' | 'ar' | 'ku')}
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
              {t('noClinicsFound', lang as 'en' | 'ar' | 'ku')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

