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

const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${price}`;
};

const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  // Remove currency symbols and commas, extract numbers
  const numStr = priceString.replace(/[^0-9.]/g, "");
  return parseFloat(numStr) || 0;
};

const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  // Extract first number if multiple numbers are provided
  const firstNumber = phone.split(/[\s\/]/)[0].trim();
  // Remove spaces, dashes, and plus signs for validation
  const cleaned = firstNumber.replace(/[\s\-+]/g, "");
  // Check if it contains only digits and is reasonable length
  return /^\d{7,15}$/.test(cleaned);
};

const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return "";
  // Extract first number if multiple numbers are provided (separated by / or space)
  const firstNumber = phone.split(/[\s\/]/)[0].trim();
  // Remove all non-digit characters except plus sign
  return firstNumber.replace(/[^\d+]/g, "");
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currency,
  isRTL,
  isFavorite,
  onFavoriteToggle,
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
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} max-w-[40%]`}>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm px-3 py-1 shadow-md truncate max-w-full">
                  💎 {t("free", language as "en" | "ar" | "ku")}
                </Badge>
              </div>
            ) : (
              discountPercentage > 0 && (
                <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} max-w-[40%]`}>
                  <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold text-sm px-3 py-1 shadow-md truncate max-w-full">
                    -{discountPercentage}%
                  </Badge>
                </div>
              )
            )}
            <div className="flex flex-col items-center gap-1 mb-1 w-full">
              <h3 className={`text-xl font-bold text-pink-900 text-center break-words hyphens-auto w-full px-2 ${language === "ar" ? "leading-loose" : "leading-tight"}`}>
                {item.name}
              </h3>
              {/* Location for clinics */}
              {isClinic && item.location && (
                <a
                  href={item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs sm:text-sm text-blue-600 hover:underline mt-1 flex items-center max-w-full truncate ${language === "ku" ? "gap-2" : ""}`}
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
            <p className={`text-gray-700 text-xs sm:text-sm mb-4 text-center line-clamp-2 ${language === "ar" ? "leading-loose" : language === "ku" ? "leading-relaxed px-2" : "leading-relaxed"}`}>
              {item.description}
            </p>
            {/* Price and Contact Row */}
            <div className="flex items-center justify-center mt-auto flex-row gap-3 w-full">
              <div className="flex flex-col flex-1 items-center">
                {/* Free or regular pricing display */}
                {item.isFree ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-red-500 mb-1 font-semibold whitespace-nowrap">
                          {t("before", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-sm sm:text-lg text-red-500 line-through font-bold truncate max-w-full">
                          {item.beforePrice ||
                            formatPrice(
                              item.originalPrice || item.price,
                              currency
                            )}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-pink-600 flex-shrink-0">
                        {isRTL ? "←" : "→"}
                      </div>
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-green-600 mb-1 font-semibold whitespace-nowrap">
                          {t("after", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
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
                        <span className="text-sm sm:text-lg text-red-500 line-through font-bold truncate max-w-full">
                          {item.beforePrice ||
                            (typeof item.originalPrice === "number"
                              ? formatPrice(item.originalPrice, currency)
                              : item.originalPrice)}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-pink-600 flex-shrink-0">
                        {isRTL ? "←" : "→"}
                      </div>
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <span className="text-xs text-green-600 mb-1 font-semibold whitespace-nowrap">
                          {t("after", language as "en" | "ar" | "ku")}
                        </span>
                        <span className="text-lg sm:text-2xl font-bold text-green-600 truncate max-w-full">
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
                        <span className="text-green-600 truncate">
                          {item.afterPrice}
                        </span>
                      </div>
                    ) : typeof item.price === "number" ? (
                      <span className="truncate block">{formatPrice(item.price, currency)}</span>
                    ) : (
                      <span className="truncate block text-center">
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
              {/* Contact Button */}
              {isClinic &&
                item.contact &&
                validatePhoneNumber(item.contact) && (
                  <div className={`flex flex-col gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
                    <a
                      href={`tel:${sanitizePhoneNumber(item.contact)}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-colors"
                      aria-label={`Call ${item.name}`}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://wa.me/${sanitizePhoneNumber(item.contact).replace("+", "")}`}
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
