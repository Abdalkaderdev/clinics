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

  const clinics = useMemo(() => data?.clinics ?? [], [data]);

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
        <p className="text-muted-foreground mb-8">Choose a clinic to browse services.</p>
        


        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => {
            const totalServices = clinic.categories.reduce((sum, cat) => sum + cat.items.length, 0);
            return (
              <motion.button
                key={clinic.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/menu/${lang}?clinic=${clinic.id}`)}
                className="text-left"
                aria-label={`Open ${clinic.name}`}
              >
                <Card className="relative border border-border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🏥</div>
                    <h2 className="text-foreground text-lg sm:text-xl md:text-2xl font-extrabold mb-2">
                      {clinic.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-1">
                      📍 {clinic.location}
                    </p>
                    <p className="text-primary text-xs sm:text-sm font-semibold">
                      {totalServices} services available
                    </p>
                  </div>
                </Card>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;


