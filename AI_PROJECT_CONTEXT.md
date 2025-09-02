# AI Project Context - Beauty Land Card

## Project Overview
Beauty Land Card is a React-based web application for beauty and medical clinic discounts in Erbil, Kurdistan Region of Iraq. The app supports 3 languages (English, Arabic, Kurdish) with RTL support for Arabic.

## Current State
- **2 Active Clinics**: Dr. Ala Ismail Shakur Clinic & Queen Art Center
- **18+ Services**: Various beauty treatments with discounts
- **Multi-currency**: USD and IQD support
- **Contact Integration**: Phone and WhatsApp links

## Key Components

### MenuItemCard.tsx
Main service display component with:
- Price calculation logic
- Discount percentage calculation
- RTL arrow direction handling
- Contact button integration
- Multi-language support

### Data Structure
Clinic data stored in JSON files:
- `public/clinics_en.json` - English
- `public/clinics_ar.json` - Arabic  
- `public/clinics_ku.json` - Kurdish

## Service Types
1. **Paid Services**: Before/after pricing with discounts
2. **Free Services**: Marked with `isFree: true`
3. **Special Discounts**: Marked with `isSpecial: true`

## Price Calculation Logic
```typescript
const parsePrice = (priceString: string): number => {
  const numStr = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numStr) || 0;
};

// Discount calculation
discountPercentage = Math.round(((beforeNum - afterNum) / beforeNum) * 100);
```

## Clinic Data Schema
```json
{
  "id": number,
  "name": string,
  "location": string,
  "contact": string,
  "categories": [
    {
      "id": string,
      "name": string,
      "items": [
        {
          "id": string,
          "name": string,
          "description": string,
          "beforePrice": string,
          "afterPrice": string,
          "isFree"?: boolean,
          "isSpecial"?: boolean
        }
      ]
    }
  ]
}
```

## Recent Changes
- Removed 12 demo clinics, kept only 2 real ones
- Fixed discount calculations for string prices
- Added RTL arrow direction support
- Integrated phone/WhatsApp contact buttons
- Added comprehensive service categories

## Development Notes
- Always update all 3 language files simultaneously
- Test discount calculations after price changes
- Verify contact links work properly
- Check RTL layout in Arabic mode
- Ensure currency formatting is correct (USD vs IQD)

## Common Tasks
1. **Add New Service**: Update all 3 JSON files with same structure
2. **Update Prices**: Modify beforePrice/afterPrice strings
3. **Add Clinic**: Create new clinic object in all language files
4. **Fix Calculations**: Check parsePrice function and discount logic