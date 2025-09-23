import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { t } from "@/lib/translations";

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
  mapUrl?: string;
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
  contact?: string;
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

// Animation variants moved outside component for performance
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
};

// Memoized helper functions
const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${price}`;
};

const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  const numStr = priceString.replace(/[^0-9.]/g, "");
  return parseFloat(numStr) || 0;
};

const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  const firstNumber = phone.split(/[\s/]/)[0].trim();
  const cleaned = firstNumber.replace(/[\s\-+]/g, "");
  return /^\d{7,15}$/.test(cleaned);
};

const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return "";
  const firstNumber = phone.split(/[\s/]/)[0].trim();
  return firstNumber.replace(/[^\d+]/g, "");
};



const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currency,
  isRTL,
  language = "en",
}) => {
  // Check if this is a clinic item (has location)
  const isClinic = !!item.location;

  // Calculate discount percentage from beforePrice and afterPrice strings
  let discountPercentage = 0;
  let savingsAmount = 0;

  if (
    isClinic &&
    item.beforePrice &&
    item.afterPrice &&
    !item.isFree &&
    !item.isSpecial
  ) {
    const beforeNum = parsePrice(item.beforePrice);
    const afterNum = parsePrice(item.afterPrice);

    if (beforeNum > 0 && afterNum > 0 && beforeNum > afterNum) {
      discountPercentage = Math.round(
        ((beforeNum - afterNum) / beforeNum) * 100
      );
      savingsAmount = beforeNum - afterNum;
    }
  }



  const getFontClass = () => {
    if (language === "ar") return "font-arabic";
    if (language === "ku") return "font-kurdish";
    return "";
  };

  return (
    <motion.div variants={itemVariants} whileHover="hover" className="h-full">
      <Card className={`overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-br from-pink-50 to-blue-50 flex flex-col min-h-fit border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 ${getFontClass()}`}>
        <CardContent className="p-0">
          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6 gap-3 items-center text-center relative">
            {/* Free or Discount badge */}
            {item.isFree ? (
              <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} max-w-[45%] z-10`}>
                <Badge className={`bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-md whitespace-nowrap overflow-hidden text-xs sm:text-sm ${language === "ar" ? "leading-loose" : ""}`}>
                  💎 {t("free", language as "en" | "ar" | "ku")}
                </Badge>
              </div>
            ) : (
              discountPercentage > 0 && (
                <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} max-w-[45%] z-10`}>
                  <Badge className={`bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-md whitespace-nowrap overflow-hidden text-xs sm:text-sm ${language === "ar" ? "leading-loose" : ""}`}>
                    -{discountPercentage}%
                  </Badge>
                </div>
              )
            )}
            <div className="flex flex-col items-center gap-1 mb-1 w-full">
              <h3 className={`text-lg sm:text-xl font-bold text-pink-900 text-center break-words hyphens-auto w-full px-2 ${language === "ar" ? "leading-loose" : language === "ku" ? "leading-relaxed" : "leading-tight"}`} id={`title-${item.id}`}>
                {item.name}
              </h3>
              {/* Location for clinics */}
              {isClinic && item.location && (
                <a
                  href={item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs sm:text-sm text-blue-700 hover:text-blue-800 hover:underline mt-1 flex items-center max-w-full truncate font-medium transition-colors ${language === "ku" ? "gap-2" : ""}`}
                  aria-label={`Open ${item.location} in maps`}
                >
                  <span className={isRTL ? "ml-1" : "mr-1"}>📍</span>
                  <span className="truncate">{item.location}</span>
                </a>
              )}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
              {item.popular && (
                <Badge className="bg-secondary text-[hsl(0_0%_15%)] truncate max-w-full">
                  {t("popular", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.spicy && (
                <Badge className="bg-primary text-[hsl(42_73%_94%)] truncate max-w-full">
                  {t("hot", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.vegetarian && (
                <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)] truncate max-w-full">
                  {t("vegetarian", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.vegan && (
                <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)] truncate max-w-full">
                  {t("vegan", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.glutenFree && (
                <Badge className="bg-secondary text-[hsl(0_0%_15%)] truncate max-w-full">
                  {t("glutenFree", language as "en" | "ar" | "ku")}
                </Badge>
              )}
            </div>
            <p className={`text-gray-900 text-xs sm:text-sm mb-4 text-center ${language === "ar" ? "leading-loose px-1" : language === "ku" ? "leading-relaxed px-2" : "leading-relaxed"}`} role="text" aria-describedby={`desc-${item.id}`}>
              {item.description}
            </p>
            {/* Price Section */}
            <div className="flex flex-col items-center mt-auto w-full gap-3">
              <div className="flex flex-col items-center w-full">
                {/* Free or regular pricing display */}
                {item.isFree ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-red-500 mb-1 font-semibold whitespace-nowrap">
                          {t("before", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-sm sm:text-lg text-red-500 line-through font-bold whitespace-nowrap text-center">
                          {item.beforePrice ||
                            formatPrice(
                              item.originalPrice || item.price,
                              currency
                            )}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-pink-600 flex-shrink-0" aria-hidden="true">
                        {isRTL ? "←" : "→"}
                      </div>
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-green-600 mb-1 font-semibold whitespace-nowrap">
                          {t("after", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-green-600" role="text" aria-label={`Current price: ${t("free", language as "en" | "ar" | "ku")}`}>
                          {t("free", language as "en" | "ar" | "ku")}
                        </span>
                      </div>
                    </div>
                    <div className={`bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-green-300 ${language === "ku" ? "px-2 py-1" : "px-4 py-2"} ${language === "ar" ? "leading-loose" : ""}`}>
                      💎 {t("freeWithCard", language as "en" | "ar" | "ku")}
                    </div>
                  </div>
                ) : isClinic && item.originalPrice ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-red-500 mb-1 font-semibold whitespace-nowrap">
                          {t("before", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-sm sm:text-lg text-red-500 line-through font-bold whitespace-nowrap text-center">
                          {item.beforePrice ||
                            (typeof item.originalPrice === "number"
                              ? formatPrice(item.originalPrice, currency)
                              : item.originalPrice)}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-pink-600 flex-shrink-0" aria-hidden="true">
                        {isRTL ? "←" : "→"}
                      </div>
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-green-600 mb-1 font-semibold whitespace-nowrap">
                          {t("after", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-lg sm:text-2xl font-bold text-green-600 whitespace-nowrap text-center">
                          {item.afterPrice ||
                            (typeof item.price === "number"
                              ? formatPrice(item.price, currency)
                              : item.price)}
                        </span>
                      </div>
                    </div>
                    {discountPercentage > 0 && savingsAmount > 0 && (
                      <div className={`bg-gradient-to-r from-pink-100 to-blue-100 text-pink-800 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-pink-300 max-w-full truncate ${language === "ku" ? "px-2 py-1" : "px-4 py-2"} ${language === "ar" ? "leading-loose" : ""}`}>
                        💰 {t("save", language as "en" | "ar" | "ku")}{" "}
                        {item.beforePrice?.includes("IQD")
                          ? `${savingsAmount.toLocaleString()} IQD`
                          : `$${savingsAmount}`}{" "}
                        ({discountPercentage}% {t("off", language as "en" | "ar" | "ku")})
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-lg sm:text-2xl font-bold px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-blue-100 text-pink-900 shadow-sm border border-pink-200 max-w-full">
                    {item.beforePrice && item.afterPrice ? (
                      <div className="flex items-center gap-1 sm:gap-2 justify-center">
                        <span className="text-xs sm:text-sm text-red-500 line-through truncate">
                          {item.beforePrice}
                        </span>
                        <span className="flex-shrink-0">{isRTL ? "←" : "→"}</span>
                        <span className="text-green-600 whitespace-nowrap">
                          {item.afterPrice}
                        </span>
                      </div>
                    ) : typeof item.price === "number" ? (
                      <span className="whitespace-nowrap block text-center">{formatPrice(item.price, currency)}</span>
                    ) : (
                      <span className="whitespace-nowrap block text-center">
                        {item.afterPrice ||
                        item.beforePrice ||
                        t("contactForPricing", language as "en" | "ar" | "ku")}
                      </span>
                    )}
                  </span>
                )}
                {item.isSpecial && (
                  <Badge className="bg-primary text-[hsl(42_73%_94%)] truncate max-w-full">
                    {t("new", language as "en" | "ar" | "ku")}
                  </Badge>
                )}
              </div>
              
              {/* Contact Buttons */}
              {isClinic && item.contact && validatePhoneNumber(item.contact) && (
                <div className="flex gap-3 justify-center w-full mt-2">
                  <a
                    href={`tel:${sanitizePhoneNumber(item.contact)}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-800 hover:bg-pink-900 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 min-h-[44px]"
                    aria-label={`Call ${item.name} at ${item.contact}`}
                    role="button"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{t("call", language as "en" | "ar" | "ku") || "Call"}</span>
                  </a>
                  <a
                    href={`https://wa.me/${sanitizePhoneNumber(item.contact).replace("+", "")}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-800 hover:bg-green-900 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 min-h-[44px]"
                    aria-label={`Send WhatsApp message to ${item.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">WhatsApp</span>
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
