import React from "react";
import { motion } from "framer-motion";
import MenuItemCard from "./MenuItemCard";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
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
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  category: MenuCategory;
  currency: string;
  isRTL: boolean;
  onFavoriteToggle?: (itemId: string) => void;
  favorites?: Set<string>;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  currency,
  isRTL,
  favorites = new Set(),
  onFavoriteToggle,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 18 }}
      id={`category-${category.id}`}
      className="mb-12 bg-background rounded-xl p-2 sm:p-4 scroll-mt-[88px] sm:scroll-mt-[112px]"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6 px-4"
        style={{
          borderLeft: isRTL ? undefined : "6px solid hsl(39 92% 53%)",
          borderRight: isRTL ? "6px solid hsl(39 92% 53%)" : undefined,
        }}
      >
        {category.name}
      </motion.h2>
      <div
        className={
          `grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-6` +
          (isRTL ? " direction-rtl" : "")
        }
      >
        {category.items.map((item: MenuItem) => (
          <MenuItemCard
            key={item.id}
            item={item}
            currency={currency}
            isRTL={isRTL}
            isFavorite={favorites.has(item.id)}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MenuSection;
