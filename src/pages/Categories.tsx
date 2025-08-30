import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import ImageOptimized from "@/components/ImageOptimized";
import WorkingHours from "@/components/WorkingHours";
import { resolveItemImage } from "@/lib/imageMap";

interface MenuItem { id: string; name: string; description?: string; price: number; image?: string }
interface MenuCategory { id: string; name: string; items: MenuItem[] }
interface MenuData { shopName: string; currency: string; categories: MenuCategory[] }

const Categories = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/menu_${lang}.json`);
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  const categories = useMemo(() => data?.categories ?? [], [data]);

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
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{data?.shopName || "Medical Clinics"}</h1>
        <p className="text-muted-foreground mb-8">Choose a category to browse clinics.</p>
        
        {/* Working Hours */}
        <div className="flex justify-center mb-8">
          <WorkingHours 
            language={lang as 'en' | 'ku' | 'ar'} 
            variant="compact" 
            className="text-center"
          />
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            // Use medical-themed images for clinic categories
            const preview = cat.id === 'clinics'
              ? 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
              : resolveItemImage(cat.items?.[0] || {});
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/menu/${lang}?category=${encodeURIComponent(cat.id)}`)}
                className="text-left"
                aria-label={`Open ${cat.name}`}
              >
                <Card className="relative border border-border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <ImageOptimized
                      src={preview}
                      alt={`${cat.name} category preview`}
                      className="absolute inset-0 w-full h-full object-cover"
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 30vw, 45vw"
                      width={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                      <h2 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold drop-shadow">
                        {cat.name}
                      </h2>
                      <p className="text-white/85 text-xs sm:text-sm mt-1">
                        {cat.items.length} {cat.id === 'clinics' ? 'clinics' : 'items'}
                      </p>
                    </div>
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


