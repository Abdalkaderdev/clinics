import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Phone, MessageCircle } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  beforePrice?: string;
  afterPrice?: string;
  isFree?: boolean;
  location?: string;
  image?: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  available?: boolean;
  stock?: number;
  isSpecial?: boolean;
  specialPrice?: number;
  vegan?: boolean;
  glutenFree?: boolean;
  allergens?: string[];
  contact?: string; // Added for contact number
}

// Props for MenuItemCard
interface MenuItemCardProps {
  item: MenuItem;
  currency: string;
  isRTL: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  language?: string; // Add language prop
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 120, damping: 12 }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, type: "spring" as const, stiffness: 400, damping: 10 }
  }
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${(price / 1000).toFixed(2)}`;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currency, isRTL, isFavorite, onFavoriteToggle, language = 'en' }) => {
  // Check if this is a clinic item (has location and originalPrice)
  const isClinic = item.location && item.originalPrice;
  const discountPercentage = isClinic && item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

  // Translation functions
  const t = (key: string) => {
    const translations = {
      before: {
        en: 'Before',
        ar: 'قبل',
        ku: 'پێش'
      },
      after: {
        en: 'After',
        ar: 'بعد',
        ku: 'دوای'
      },
      free: {
        en: 'FREE',
        ar: 'مجاني',
        ku: 'بێ بەرامبەر'
      },
      save: {
        en: 'Save',
        ar: 'وفر',
        ku: 'پاشەکەوت'
      },
      off: {
        en: 'OFF',
        ar: 'خصم',
        ku: 'خەڵات'
      },
      freeWithCard: {
        en: '100% FREE with Beauty Land Card!',
        ar: '100% مجاني مع بطاقة بيوتي لاند!',
        ku: '100% بێ بەرامبەر لەگەڵ کارتی بیوتی لاند!'
      }
    };
    return translations[key as keyof typeof translations]?.[language as keyof typeof translations.before] || translations[key as keyof typeof translations]?.en || key;
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className="h-full"
    >
      <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-br from-pink-50 to-blue-50 flex flex-col h-full border-2 border-pink-100 hover:border-pink-300 transition-all duration-300">
        <CardContent className="p-0">
          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6 gap-3 items-center text-center relative">
            {/* Free or Discount badge */}
            {item.isFree ? (
              <div className="absolute top-3 right-3">
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm px-3 py-1 shadow-md">
                  💎 {t('free')}
                </Badge>
              </div>
            ) : isClinic && discountPercentage > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold text-sm px-3 py-1 shadow-md">
                  -{discountPercentage}%
                </Badge>
              </div>
            )}
              <div className="flex flex-col items-center gap-1 mb-1">
                <h3 className="text-xl font-bold text-pink-900 leading-tight">{item.name}</h3>
                {/* Location for clinics */}
                {isClinic && item.location && (
                  <p className="text-sm text-blue-700 mt-1">
                    📍 {item.location}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
                {item.popular && <Badge className="bg-secondary text-[hsl(0_0%_15%)]">Popular</Badge>}
                {item.spicy && <Badge className="bg-primary text-[hsl(42_73%_94%)]">🌶️ Hot</Badge>}
                {item.vegetarian && <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)]">🌱 Vegetarian</Badge>}
                {item.vegan && <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)]">🌿 Vegan</Badge>}
                {item.glutenFree && <Badge className="bg-secondary text-[hsl(0_0%_15%)]">🌾 Gluten Free</Badge>}
              </div>
              <p className="text-gray-700 text-sm mb-4 min-h-[2.5em] leading-relaxed text-center">{item.description}</p>
              {/* Price and Contact Row */}
              <div className="flex items-center justify-center mt-auto flex-row gap-3 w-full">
                <div className="flex flex-col flex-1 items-center">
                  {/* Free or regular pricing display */}
                  {item.isFree ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-red-500 mb-1 font-semibold">{t('before')}</span>
                          <span className="text-lg text-red-500 line-through font-bold">
                            {item.beforePrice || formatPrice(item.originalPrice || item.price, currency)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-pink-600">→</div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 mb-1 font-semibold">{t('after')}</span>
                          <span className="text-2xl font-bold text-green-600">
                            {t('free')}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-green-300">
                        💎 {t('freeWithCard')}
                      </div>
                    </div>
                  ) : isClinic && item.originalPrice ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-red-500 mb-1 font-semibold">{t('before')}</span>
                          <span className="text-lg text-red-500 line-through font-bold">
                            {item.beforePrice || formatPrice(item.originalPrice, currency)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-pink-600">→</div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 mb-1 font-semibold">{t('after')}</span>
                          <span className="text-2xl font-bold text-green-600">
                            {item.afterPrice || formatPrice(item.price, currency)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-100 to-blue-100 text-pink-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-pink-300">
                        💰 {t('save')} {formatPrice(item.originalPrice - item.price, currency)} ({discountPercentage}% {t('off')})
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-blue-100 text-pink-900 shadow-sm border border-pink-200">
                      {formatPrice(item.price, currency)}
                    </span>
                  )}
                  {item.isSpecial && (
                    <Badge className="bg-primary text-[hsl(42_73%_94%)]">New</Badge>
                  )}
                </div>
                {/* Contact Button */}
                {isClinic && item.contact && (
                  <div className="flex flex-col items-end gap-2">
                    <a
                      href={`tel:${item.contact}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-colors"
                      aria-label={`Call ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://wa.me/${item.contact.replace('+', '')}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                      aria-label={`WhatsApp ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard; 