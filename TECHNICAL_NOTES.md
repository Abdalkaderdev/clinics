# Technical Implementation Notes

## Price Calculation System

### parsePrice Function
```typescript
const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  const numStr = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numStr) || 0;
};
```
Extracts numeric values from price strings like "$100", "50,000 IQD", etc.

### Discount Calculation
```typescript
if (isClinic && item.beforePrice && item.afterPrice && !item.isFree && !item.isSpecial) {
  const beforeNum = parsePrice(item.beforePrice);
  const afterNum = parsePrice(item.afterPrice);
  
  if (beforeNum > 0 && afterNum > 0 && beforeNum > afterNum) {
    discountPercentage = Math.round(((beforeNum - afterNum) / beforeNum) * 100);
    savingsAmount = beforeNum - afterNum;
  }
}
```

### Currency Formatting
```typescript
const formatPrice = (price: number, currency: string) => {
  if (currency === "IQD") {
    return `${price.toLocaleString()} ${currency}`;
  }
  return `${currency}${price}`;
};
```

## RTL Support Implementation

### Arrow Direction
```typescript
<div className="text-2xl font-bold text-pink-600">
  {isRTL ? '←' : '→'}
</div>
```
- LTR (English/Kurdish): → (U+2192)
- RTL (Arabic): ← (U+2190)

### Language Detection
The `isRTL` prop is passed down from parent components based on selected language.

## Component Architecture

### MenuItemCard Props
```typescript
interface MenuItemCardProps {
  item: MenuItem;
  currency: string;
  isRTL: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  language?: string;
}
```

### MenuItem Interface
```typescript
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
  contact?: string;
  isSpecial?: boolean;
  // ... other properties
}
```

## Data Flow

1. **JSON Loading**: Clinic data loaded from `public/clinics_*.json`
2. **Language Selection**: Determines which JSON file to use
3. **Component Rendering**: MenuItemCard receives clinic/service data
4. **Price Calculation**: parsePrice extracts numbers, calculates discounts
5. **Display**: Formatted prices and percentages shown to user

## Contact Integration

### Phone Links
```typescript
<a href={`tel:${item.contact}`}>
  <Phone className="w-5 h-5" />
</a>
```

### WhatsApp Links
```typescript
<a href={`https://wa.me/${item.contact.replace('+', '')}`}>
  <MessageCircle className="w-5 h-5" />
</a>
```

## Styling System

### Tailwind Classes
- **Cards**: `rounded-xl shadow-lg bg-gradient-to-br from-pink-50 to-blue-50`
- **Badges**: `bg-gradient-to-r from-pink-500 to-blue-500`
- **Free Services**: `from-green-500 to-green-600`

### Responsive Design
- Mobile-first approach
- Flexible layouts with `flex` and `grid`
- Responsive text sizing

## Performance Considerations

### Image Optimization
- WebP format support
- Sharp for image processing
- Lazy loading implemented

### Bundle Optimization
- Vite for fast builds
- Tree shaking enabled
- Code splitting by routes

## Deployment Pipeline

1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Preview**: `npm run preview`
4. **Deploy**: Automatic Vercel deployment on git push

## Error Handling

### Price Parsing
- Returns 0 for invalid prices
- Handles missing currency symbols
- Graceful fallback for malformed data

### Contact Links
- Validates phone number format
- Handles multiple contact numbers
- Fallback for missing contact info

## Testing Checklist

- [ ] All 3 language files synchronized
- [ ] Discount calculations accurate
- [ ] Contact links functional
- [ ] RTL layout correct in Arabic
- [ ] Currency formatting proper
- [ ] Free services display correctly
- [ ] Special discounts show properly