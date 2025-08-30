import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";


interface ClinicItem { id: string; name: string; description: string; beforePrice: string; afterPrice: string }
interface ClinicCategory { id: string; name: string; items: ClinicItem[] }
interface Clinic { id: number; name: string; location: string; contact: string; categories: ClinicCategory[] }
interface ClinicsData { clinics: Clinic[] }

const Categories = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClinicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/clinics_${lang}.json`);
        const json = await res.json();
        setData(json);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Medical Clinics</h1>
        <p className="text-muted-foreground mb-6">Choose a clinic to browse services.</p>
        
        {/* Search Input */}
        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            placeholder={lang === 'ar' ? "البحث عن العيادات أو الخدمات..." : lang === 'ku' ? "گەڕان بۆ کلینیک یان خزمەتگوزاری..." : "Search clinics or services..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm sm:max-w-md mx-auto px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center"
          />
        </div>

        {filteredClinics.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClinics.map((clinic) => {
              const totalServices = clinic.categories.reduce((sum, cat) => sum + cat.items.length, 0);
              return (
                <motion.button
                  key={clinic.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/menu/${lang}?clinic=${clinic.id}`)}
                  className="text-left w-full"
                  aria-label={`Open ${clinic.name}`}
                >
                  <Card className="relative border border-border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/10 to-primary/5 h-full">
                    <div className="p-4 sm:p-5 md:p-6 text-center flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
                      <div className="flex-1">
                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏥</div>
                        <h2 className="text-foreground text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold mb-2 leading-tight break-words hyphens-auto">
                          {clinic.name}
                        </h2>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-2 leading-relaxed break-words">
                          📍 {clinic.location}
                        </p>
                      </div>
                      <p className="text-primary text-xs sm:text-sm font-semibold mt-auto">
                        {totalServices} services available
                      </p>
                    </div>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {lang === 'ar' ? "لم يتم العثور على عيادات" : lang === 'ku' ? "هیچ کلینیکێک نەدۆزرایەوە" : "No clinics found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

