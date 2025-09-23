import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Animation variants moved outside component for performance
const buttonVariants = {
  active: { scale: 1.08 },
  inactive: { scale: 1 },
};

const transition = { type: "spring", stiffness: 300, damping: 20 };

interface Category {
  id: string;
  name: string;
  count: number;
}

interface DynamicCategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
  isRTL?: boolean;
}

// Placeholder for smokey cursor effect (to be implemented)
const SmokeyCursor: React.FC = () => null;

const DynamicCategoryNav: React.FC<DynamicCategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  isRTL,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll active button into center when activeCategory changes
  useEffect(() => {
    const btn = btnRefs.current[activeCategory];
    if (btn && navRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategory]);

  return (
    <div
      ref={navRef}
      className="sticky top-[56px] sm:top-[72px] w-full bg-[hsl(0_0%_17%)] text-[hsl(42_73%_94%)] border-b border-border z-40"
    >
      {/* Smokey Cursor Effect */}
      <SmokeyCursor />
      <nav
        className="flex gap-2 py-4 overflow-x-auto scrollbar-hide w-full px-2"
        style={{
          WebkitOverflowScrolling: "touch",
          direction: isRTL ? "rtl" : "ltr",
          scrollSnapType: "x mandatory",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            ref={(el) => (btnRefs.current[cat.id] = el)}
            onClick={() => onCategoryClick(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[hsl(39_92%_53%)] scroll-snap-align-center ${
              activeCategory === cat.id
                ? "text-[hsl(0_0%_15%)] font-bold border-b-2 border-[hsl(39_92%_53%)] bg-[hsl(39_92%_53%)] shadow"
                : "bg-transparent text-[hsl(42_73%_94%)] hover:bg-[hsl(1_69%_49%)] hover:text-[hsl(42_73%_94%)]"
            }`}
            aria-current={activeCategory === cat.id ? "page" : undefined}
            initial={false}
            animate={activeCategory === cat.id ? "active" : "inactive"}
            variants={buttonVariants}
            transition={transition}
          >
            {cat.name} <span className="opacity-70">({cat.count})</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default DynamicCategoryNav;
