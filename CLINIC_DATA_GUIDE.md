# Clinic Data Management Guide

## Current Clinics

### Dr. Ala Ismail Shakur Clinic (ID: 1)
**Location:** Bakhtiary 20m Street, in front of Holland Bazaar, Erbil  
**Contact:** +9647506060611

**Categories:**
1. **General Medicine** - 10% Surgery Discount
2. **Injectable Treatments** - Botox ($100→$80, $250→$200), Fillers (4 types)
3. **Regenerative Treatments** - PRP ($120→$96, $250→$200), Mesotherapy ($80→$64)
4. **Device Treatments** - Morpheus ($240→$192), HydraFacial (3 types in IQD)
5. **Laser Treatments** - Full Body (150,000→120,000 IQD, 220,000→175,000 IQD)

### Queen Art Center (ID: 2)
**Location:** Koya Road, in front of Majidi Mall, Erbil  
**Contact:** +9647509232233 / +9647709232233

**Services:**
- Service 1: 150,000→100,000 IQD (name TBD)
- Service 2: 230,000→180,000 IQD (name TBD)
- HydraFacial VIP: 90,000→60,000 IQD
- HydraFacial VVIP: $150→$110
- Korean Filler: $90→$70
- French Filler: $150→$120
- German Filler: $180→$135
- Swiss Filler: $220→$170
- Botox: $130→$100
- British Botox: $220→$160
- Microneedling: $120→$70, $150→$115
- Tattoo Removal: 20% discount
- Chemical Peeling: $150→$115

**FREE Services:**
- Face Analysis (was $30)
- Normal Plasma (was $80)
- Carbon Laser (was $100)
- Doctor Consultation - One Time (was $40)

## Adding New Services

### Step 1: Determine Service Details
- Service name in all 3 languages
- Before/after prices with currency
- Category placement
- Special flags (isFree, isSpecial)

### Step 2: Update JSON Files
Update all three files simultaneously:
- `public/clinics_en.json`
- `public/clinics_ar.json`
- `public/clinics_ku.json`

### Step 3: Service Object Structure
```json
{
  "id": "unique-service-id",
  "name": "Service Name",
  "description": "Service description",
  "beforePrice": "$100" or "50,000 IQD",
  "afterPrice": "$80" or "40,000 IQD",
  "isFree": true, // Optional: for free services
  "isSpecial": true // Optional: for special discounts
}
```

## Price Format Guidelines

### USD Services
- Format: "$100", "$150", etc.
- Used for: Premium treatments, international products

### IQD Services  
- Format: "50,000 IQD", "100,000 دينار", "50,000 دینار"
- Used for: Local treatments, HydraFacial, laser treatments

### Free Services
- beforePrice: Original price
- afterPrice: "FREE", "مجاني", "بێ بەرامبەر"
- isFree: true

### Special Discounts
- beforePrice: "Regular Price", "السعر العادي", "نرخی ئاسایی"
- afterPrice: "20% OFF", "خصم 20%", "خەڵات 20%"
- isSpecial: true

## Language Translations

### Service Categories
- **English**: Injectable Treatments, Regenerative Treatments, Device Treatments, Laser Treatments
- **Arabic**: علاجات الحقن، العلاجات التجديدية، علاجات الأجهزة، علاجات الليزر
- **Kurdish**: چارەسەری دەرزیکردن، چارەسەری نوێکردنەوە، چارەسەری ئامێر، چارەسەری لەیزەر

### Common Terms
- **Before/After**: Before/After, قبل/بعد, پێش/دوای
- **Free**: FREE, مجاني, بێ بەرامبەر
- **Discount**: Discount, خصم, خەڵات

## Contact Integration
All clinics support:
- **Phone**: `tel:+964XXXXXXXXX`
- **WhatsApp**: `https://wa.me/964XXXXXXXXX`

Format: +9647XXXXXXXXX (remove + for WhatsApp links)