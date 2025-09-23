export const fallbackLogo = "/images/logo.webp";

// Known local images mapped by item id - now using optimized versions
export const localImageByItemId: Record<string, string> = {
  // Pizzas
  "pepperoni-pizza": "/images/optimized/IMG_1144_TIF.webp",
  "salmon-pizza": "/images/optimized/IMG_2864.webp",
  "turkey-beef-salami-pizza": "/images/optimized/IMG_1168_TIF.webp",
  "salami-pizza": "/images/optimized/IMG_3781.PNG.webp",
  "pizza-mix": "/images/upload/IMG_4138.JPG",
  "diavolo-pizza": "/images/optimized/IMG_1169_TIF.webp",
  "four-cheese-pizza": "/images/optimized/IMG_3779.PNG.webp",
  "four-season-pizza": "/images/optimized/IMG_3777.PNG.webp",
  "calzone-pizza": "/images/optimized/IMG_3782.PNG.webp",
  "tuna-pizza": "/images/optimized/IMG_3780.PNG.webp",
  "turkey-pizza": "/images/optimized/IMG_3778.PNG.webp",
  "margherita-pizza": "/images/upload/IMG_4121.JPG",
  "mushroom-pizza": "/images/upload/IMG_4122.JPG",
  "spinach-pizza": "/new/IMG_3903.JPG",
  "vegetarian-pizza": "/images/optimized/IMG_2878.JPG.webp",

  // Pide
  "sucuk-pide": "/images/optimized/IMG_1158_TIF.webp",
  "cheese-pide": "/images/optimized/IMG_3772.PNG.webp",
  "doner-pide": "/new/IMG_4192.JPG",
  "spinach-pide": "/images/optimized/IMG_2885.webp",
  "minced-meat-pide": "/images/optimized/minced.webp",
  lahmacun: "/images/optimized/IMG_3773.PNG.webp",
  "lahmacun-plate": "/images/optimized/IMG_3775.PNG.webp",
  "special-pide": "/images/optimized/IMG_3770.PNG.webp",

  // Doner/Yufka
  "doner-kebap-chicken": "/images/optimized/IMG_1098_TIF.webp",
  "doner-kebap-beef": "/images/optimized/IMG_1098_TIF.webp",
  "doner-kebap-mix": "/images/optimized/IMG_1098_TIF.webp",
  "yufka-kebap-chicken": "/images/optimized/IMG_3774.PNG.webp",
  "yufka-kebap-beef": "/images/optimized/IMG_3774.PNG.webp",
  "yufka-kebap-mix": "/images/optimized/IMG_3774.PNG.webp",
  "doner-pizza": "/images/optimized/IMG_3778.PNG.webp",
  "doner-chicken-pizza": "/images/upload/IMG_4124.JPG",
  "doner-box": "/images/optimized/IMG_3899.webp",
  "chicken-doner-box": "/images/optimized/IMG_3898.JPG-medium.webp",
  "mixed-doner-box": "/images/optimized/IMG_3898.JPG-medium.webp",
  "kapsalon-plate": "/new/IMG_4190.JPG",
  // yufka kebap items intentionally unmapped to use logo fallback
  "kebap-plate-chicken": "/images/optimized/IMG_1100_TIF.webp",
  "kebap-plate-beef": "/images/optimized/IMG_1093_TIF.webp",

  // Beverages (use a representative image for all)
  cola: "/images/optimized/assorted-beverages.webp",
  fanta: "/images/optimized/assorted-beverages.webp",
  water: "/images/optimized/assorted-beverages.webp",
  sprite: "/images/optimized/assorted-beverages.webp",
  "cola-diet": "/images/optimized/assorted-beverages.webp",
  yogurt: "/images/optimized/assorted-beverages.webp",
  soda: "/images/optimized/assorted-beverages.webp",
  tea: "/images/optimized/assorted-beverages.webp",

  // Kids Meals
  "kids-nugget": "/images/optimized/IMG_3900.JPG.webp",
  "kids-fries": "/images/optimized/IMG_3904.JPG.webp",

  // Special Pizzas
  "german-pizza": "/images/optimized/IMG_2865.webp",
  "kurdish-pizza": "/images/optimized/IMG_3902.JPG-medium.webp",

  // Rizzo
  "rizzo-item": "/images/upload/IMG_4123.JPG",
};

export function resolveItemImage(item: {
  id?: string;
  image?: string;
}): string {
  // Always prioritize curated local images over JSON image field
  if (item?.id && localImageByItemId[item.id])
    return localImageByItemId[item.id];
  // Fall back to JSON image field if no local mapping exists
  if (item?.image) return item.image;
  return fallbackLogo;
}
