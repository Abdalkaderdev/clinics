import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { t } from "@/lib/translations";
import ImageOptimized from "@/components/ImageOptimized";

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

// Service photo mapping function - returns appropriate photos for different service types
const getServicePhoto = (serviceName: string): string => {
  const name = serviceName.toLowerCase();
  
  // Injectable treatments (Botox, Fillers, etc.)
  if (name.includes('botox') || name.includes('بوتوكس') || name.includes('بۆتۆکس')) {
    return "/images/injectable1.webp";
  }
  if (name.includes('filler') || name.includes('فيلر') || name.includes('فیلەر') || 
      name.includes('korean') || name.includes('french') || name.includes('german') || 
      name.includes('swiss') || name.includes('russian') || name.includes('romanian')) {
    return "/images/injectable1.webp";
  }
  
  // Facial treatments (HydraFacial, CO2, etc.)
  if (name.includes('hydrafacial') || name.includes('هايدرافيشل') || name.includes('هایدرافیشڵ') ||
      name.includes('facial') || name.includes('face') || name.includes('ڕوو') || name.includes('وجه')) {
    return "/images/facial treatment.webp";
  }
  if (name.includes('co2') || name.includes('carbon') || name.includes('كربون') || name.includes('کاربۆن') ||
      name.includes('peeling') || name.includes('تقشير') || name.includes('پاککردنەوە')) {
    return "/images/facial treatment.webp";
  }
  
  // Laser treatments
  if (name.includes('laser') || name.includes('ليزر') || name.includes('لەیزەر') ||
      name.includes('hair removal') || name.includes('إزالة شعر') || name.includes('لابردنی موو')) {
    return "/images/laser treatment.webp";
  }
  if (name.includes('full body') || name.includes('كامل الجسم') || name.includes('تەواوی لەش') ||
      name.includes('half body') || name.includes('نصف الجسم') || name.includes('نیوەی لەش')) {
    return "/images/laser treatment.webp";
  }
  
  // Hair services
  if (name.includes('hair') || name.includes('شعر') || name.includes('پرچ') ||
      name.includes('haircut') || name.includes('قص') || name.includes('بڕین') ||
      name.includes('hairstyle') || name.includes('تسريحة') || name.includes('شێواز') ||
      name.includes('highlight') || name.includes('هايلايت') || name.includes('هایلایت') ||
      name.includes('dye') || name.includes('صبغة') || name.includes('ڕەنگکردن')) {
    return "/images/hair services.webp";
  }
  
  // Nail care services
  if (name.includes('nail') || name.includes('أظافر') || name.includes('نێخن') ||
      name.includes('manicure') || name.includes('مانيكير') || name.includes('مانیکیور') ||
      name.includes('pedicure') || name.includes('باديكير') || name.includes('پێدیکیور') ||
      name.includes('polish') || name.includes('طلاء') || name.includes('پۆلیش') ||
      name.includes('gel') || name.includes('جل')) {
    return "/images/nail care.webp";
  }
  
  // Eye and brow treatments
  if (name.includes('eye') || name.includes('عين') || name.includes('چاو') ||
      name.includes('eyelid') || name.includes('جفن') || name.includes('پڵک') ||
      name.includes('brow') || name.includes('حاجب') || name.includes('برۆ') ||
      name.includes('eyebrow') || name.includes('eyelash') || name.includes('رموش') || name.includes('برژانگ') ||
      name.includes('blepharoplasty') || name.includes('جراحة الجفون') || name.includes('نەشتەرگەری پڵک')) {
    return "/images/eye and brow treatment.webp";
  }
  
  // Skin care treatments
  if (name.includes('skin') || name.includes('بشرة') || name.includes('پێست') ||
      name.includes('mesotherapy') || name.includes('ميزوثيرابي') || name.includes('میزۆثیراپی') ||
      name.includes('plasma') || name.includes('بلازما') || name.includes('پلازما') ||
      name.includes('prp') || name.includes('microneedling') || name.includes('مايكرونيدلينج') ||
      name.includes('hifu') || name.includes('هايفو') || name.includes('هایفو') ||
      name.includes('rf') || name.includes('secret') || name.includes('سيكريت') || name.includes('نهێنی')) {
    return "/images/skin care.webp";
  }
  
  // Surgical treatments
  if (name.includes('surgery') || name.includes('جراحة') || name.includes('نەشتەرگەری') ||
      name.includes('surgical') || name.includes('جراحي') || name.includes('نەشتەرگەری') ||
      name.includes('rhinoplasty') || name.includes('تجميل الأنف') || name.includes('جوانکاری لوت') ||
      name.includes('otoplasty') || name.includes('تجميل الأذن') || name.includes('جوانکاری گوێ') ||
      name.includes('augmentation') || name.includes('تكبير') || name.includes('گەورەکردن') ||
      name.includes('implant') || name.includes('زرع') || name.includes('چاندن') ||
      name.includes('lift') || name.includes('رفع') || name.includes('برزکردنەوە')) {
    return "/images/surgical treatments.webp";
  }
  
  // Free services
  if (name.includes('free') || name.includes('مجاني') || name.includes('بێ بەرامبەر') ||
      name.includes('complimentary') || name.includes('مجاناً') || name.includes('بەخۆڕایی') ||
      name.includes('consultation') || name.includes('استشارة') || name.includes('راوێژکاری') ||
      name.includes('analysis') || name.includes('تحليل') || name.includes('شیکردنەوە')) {
    return "/images/free services.webp";
  }
  
  // Special discounts
  if (name.includes('discount') || name.includes('خصم') || name.includes('خەڵات') ||
      name.includes('off') || name.includes('تخفيض') || name.includes('خەڵات') ||
      name.includes('special') || name.includes('خاص') || name.includes('تایبەت') ||
      name.includes('sale') || name.includes('عرض') || name.includes('فرۆشتن')) {
    return "/images/special discount.webp";
  }
  
  // Default fallback - use the Beauty Land Card logo for unmatched services
  return "/images/beauty-final.webp";
};



const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({
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



  const fontClass = language === "ar" ? "font-arabic" : language === "ku" ? "font-kurdish" : "";

  return (
    <motion.div variants={itemVariants} whileHover="hover" className="h-full">
      <Card className={`overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-br from-pink-50 to-blue-50 flex flex-col min-h-fit border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 ${fontClass}`}>
        <CardContent className="p-0">
          {/* Service Photo Section */}
          <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
            <ImageOptimized
              src={getServicePhoto(item.name)}
              alt={`${item.name} service photo`}
              className="w-full h-full object-cover"
              width={400}
              height={200}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 items-center text-center relative">
            {/* Free or Discount badge */}
            {item.isFree ? (
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10`}>
                <Badge className={`bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-2 py-1 shadow-md whitespace-nowrap text-xs ${language === "ar" ? "leading-loose" : ""}`}>
                  💎 {t("free", language as "en" | "ar" | "ku")}
                </Badge>
              </div>
            ) : (
              discountPercentage > 0 && (
                <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10`}>
                  <Badge className={`bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold px-2 py-1 shadow-md whitespace-nowrap text-xs ${language === "ar" ? "leading-loose" : ""}`}>
                    -{discountPercentage}%
                  </Badge>
                </div>
              )
            )}
            <div className="flex flex-col items-center gap-1 mb-1 w-full">
              <h3 className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-pink-900 text-center break-words hyphens-auto w-full px-1 sm:px-2 ${language === "ar" ? "leading-loose" : language === "ku" ? "leading-relaxed" : "leading-tight"}`} id={`title-${item.id}`}>
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
                  title={t("tooltipLocationMap", language as "en" | "ar" | "ku")}
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
                  {t("trending", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.vegetarian && (
                <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)] truncate max-w-full">
                  {t("organic", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.vegan && (
                <Badge className="bg-[hsl(82_70%_38%)] text-[hsl(42_73%_94%)] truncate max-w-full">
                  {t("naturalIngredients", language as "en" | "ar" | "ku")}
                </Badge>
              )}
              {item.glutenFree && (
                <Badge className="bg-secondary text-[hsl(0_0%_15%)] truncate max-w-full">
                  {t("allergenFree", language as "en" | "ar" | "ku")}
                </Badge>
              )}
            </div>
            <p className={`text-gray-900 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-1 ${language === "ar" ? "leading-loose" : language === "ku" ? "leading-relaxed" : "leading-relaxed"}`} role="text" aria-describedby={`desc-${item.id}`}>
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
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-full bg-pink-800 hover:bg-pink-900 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 min-h-[40px] sm:min-h-[44px]"
                    aria-label={`Call ${item.name} at ${item.contact}`}
                    role="button"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{t("call", language as "en" | "ar" | "ku") || "Call"}</span>
                  </a>
                  <a
                    href={`https://wa.me/${sanitizePhoneNumber(item.contact).replace("+", "")}`}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-full bg-green-800 hover:bg-green-900 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 min-h-[40px] sm:min-h-[44px]"
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
});

MenuItemCard.displayName = 'MenuItemCard';

export default MenuItemCard;
