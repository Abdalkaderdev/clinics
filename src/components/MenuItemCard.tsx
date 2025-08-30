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

const formatPrice = (price: number, currency: string, locale: string = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currency, isRTL, isFavorite, onFavoriteToggle }) => {
  // Check if this is a clinic item (has location and originalPrice)
  const isClinic = item.location && item.originalPrice;
  const discountPercentage = isClinic && item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className="h-full"
    >
      <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-50 to-white flex flex-col h-full border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
        <CardContent className="p-0">
          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6 gap-3 items-center text-center relative">
            {/* Free or Discount badge */}
            {item.isFree ? (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-3 py-1 shadow-md">
                  FREE
                </Badge>
              </div>
            ) : isClinic && discountPercentage > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-3 py-1 shadow-md">
                  -{discountPercentage}%
                </Badge>
              </div>
            )}
              <div className="flex flex-col items-center gap-1 mb-1">
                <h3 className="text-xl font-bold text-blue-900 leading-tight">{item.name}</h3>
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
              <p className="text-blue-700 text-sm mb-4 min-h-[2.5em] leading-relaxed text-center">{item.description}</p>
              {/* Price and Contact Row */}
              <div className="flex items-center justify-center mt-auto flex-row gap-3 w-full">
                <div className="flex flex-col flex-1 items-center">
                  {/* Free or regular pricing display */}
                  {item.isFree ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-red-500 mb-1 font-semibold">Before</span>
                          <span className="text-lg text-red-500 line-through font-bold">
                            {formatPrice(item.originalPrice || item.price, currency)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary">→</div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 mb-1 font-semibold">After</span>
                          <span className="text-2xl font-bold text-green-600">
                            FREE
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                        100% FREE!
                      </div>
                    </div>
                  ) : isClinic && item.originalPrice ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-red-500 mb-1 font-semibold">Before</span>
                          <span className="text-lg text-red-500 line-through font-bold">
                            {formatPrice(item.originalPrice, currency)}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary">→</div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-600 mb-1 font-semibold">After</span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(item.price, currency)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                        Save {formatPrice(item.originalPrice - item.price, currency)} ({discountPercentage}% OFF)
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold px-4 py-2 rounded-lg bg-blue-100 text-blue-900 shadow-sm">
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
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                      aria-label={`Call ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://wa.me/${item.contact.replace('+', '')}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
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