# Beauty Land Card

A modern web application offering exclusive discounts and free services across partner beauty and medical clinics in Erbil, Kurdistan Region of Iraq.

## Features

- 🏥 **8 Partner Clinics** - Premium beauty and medical centers
- 💰 **Exclusive Discounts** - Up to 50% off on treatments and services
- 🎁 **Free Services** - Complimentary consultations and treatments
- 🌍 **Multi-language Support** - English, Kurdish (Sorani), and Arabic
- 📱 **Responsive Design** - Optimized for all devices
- ♿ **Accessibility** - WCAG AA compliant with RTL support
- 🔒 **Security** - HTTPS, CSP, and security headers
- 📊 **Analytics** - Track user interactions and clinic visits
- 📞 **Direct Contact** - Call integration

## Partner Clinics

### 1. Dr. Ala Ismail Shakur Clinic
**Location:** Bakhtiary 20m Street, in front of Holland Bazaar, Erbil  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- Injectable Treatments (Botox, Dermal Fillers)
- Regenerative Treatments (PRP, Mesotherapy)
- Device Treatments (Morpheus RF, HydraFacial)
- Laser Treatments (Full Body Hair Removal)
- 10% Surgery Discount

### 2. Queen Art Center
**Location:** Koya Road, in front of Majidi Mall, Erbil  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- Premium HydraFacial (VIP & VVIP)
- International Fillers (Korean, French, German, Swiss)
- Botox Treatments (Regular & British)
- Microneedling & Chemical Peeling
- Tattoo Removal (20% discount)
- **FREE Services:** Face Analysis, Normal Plasma, Carbon Laser, Doctor Consultation

### 3. Sozy MN Center
**Location:** Erbil, Shorsh Street, in front of Shorsh Medical Hospital, Floor 5, opposite Mega Mall  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- 43 Beauty Services with IQD and USD pricing
- Comprehensive beauty treatments

### 4. Luminos Beauty Center
**Location:** Italy  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- Korean, French, Russian, Swiss Fillers
- Hitox & Dysport Botox
- Baby Face & CO2 Laser Sessions
- Bikini Filler
- Laser Full Body Candela 2025
- **FREE Services:** Consultation, Face Sonar, Carbon Laser, Laser for Face

### 5. Dr. Farhad Jaff Clinic
**Location:** Erbil, Havalan  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- 13 Medical Services (IQD & USD pricing)
- **FREE Services:** 2 complimentary treatments

### 6. Dr. Honar Beauty Center
**Location:** Erbil, Dream Villa, Number 1151  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- Premium beauty treatments ($15-$1500 range)
- Botox, Fillers, Plasma treatments
- Full Body Laser
- **FREE Services:** Consultation, HydraFacial, Laser for Face, PRP Session, CO2 Laser, Carbon Peeling

### 7. Salon by Mostafa
**Location:** 40m Street  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- 28 Beauty Services (IQD & USD pricing)
- Korean Peeling (50% discount)
- **FREE Services:** Free Design, Free Hairstyle

### 8. Florencia Beauty Center
**Location:** Erbil, Saydin Bakhtiary Waziran  
**Contact:** +9647761897258 / +9647501430705  
**Services:**
- 34 Beauty Services (IQD & USD pricing)
- Comprehensive laser treatments and HydraFacial services
- **FREE Services:** Medical Examination, CO2, Plasma

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn/ui, Lucide React
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **Image Optimization**: WebP, Sharp
- **Internationalization**: Multi-language JSON files

## Project Structure

```
src/
├── components/
│   ├── MenuItemCard.tsx    # Service card component
│   ├── ui/                 # Reusable UI components
│   └── ...
├── pages/
├── hooks/
└── utils/

public/
├── clinics_en.json        # English clinic data
├── clinics_ar.json        # Arabic clinic data
└── clinics_ku.json        # Kurdish clinic data
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Project Architecture
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized builds
- **Routing:** React Router v6 with future flags enabled
- **Styling:** Tailwind CSS with custom gradients and animations
- **UI Components:** Shadcn/ui component library
- **State Management:** React hooks and localStorage
- **Analytics:** Vercel Analytics with custom tracking
- **Internationalization:** Custom translation system

### Adding New Clinics
1. Update clinic data in `public/clinics_*.json` files
2. Ensure all three language files are synchronized
3. Test discount calculations and contact integration
4. Verify phone number validation and call integration
5. Update README clinic count and descriptions

### Supported Currencies
- **USD ($)** - For premium services
- **IQD (Iraqi Dinar)** - For local pricing

### RTL Support
The application automatically adjusts layout and text direction for Arabic language, including:
- Arrow directions in price displays
- Text alignment and spacing
- Component positioning
- Language switcher positioning

### Translation System
- Located in `src/lib/translations.ts`
- Supports English (en), Arabic (ar), Kurdish (ku)
- Used throughout all components with `t()` function
- Covers UI text, clinic services, and user messages

### Analytics & Tracking
- Page views, language selection, clinic interactions
- Contact method tracking (phone calls)
- Error tracking and performance monitoring
- Non-blocking implementation to prevent navigation issues

## Deployment

This project is automatically deployed on Vercel when changes are pushed to the main branch.

**Live URL:** [https://beautylandcard.vip](https://beautylandcard.vip)

## Brand Colors

- **Beauty Pink**: #EC4899
- **Land Card Blue**: #3B82F6
- **Accent Purple**: #8B5CF6
- **Success Green**: #059669

## Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement proper error boundaries and loading states
- Ensure accessibility compliance (WCAG AA)
- Maintain responsive design for all screen sizes

### Testing
- Run `npm run build` before deployment
- Test language switching functionality
- Verify clinic data loading in all languages
- Check phone contact integration
- Validate discount calculations and free service displays

### Performance Optimization
- Images optimized with WebP format
- Code splitting with lazy loading
- Efficient bundle sizes with Vite
- Lighthouse score targets: 90+ across all metrics

### Contributing
When adding new services or clinics:
1. Update all three language files simultaneously
2. Test discount percentage calculations
3. Verify contact integration (phone calls)
4. Ensure RTL layout compatibility
5. Update README documentation
6. Test analytics tracking functionality

## Deployment

### Automatic Deployment
- Connected to Vercel for automatic deployments
- Builds triggered on git push to main branch
- Environment variables configured in Vercel dashboard
- Custom domain: https://beautylandcard.vip

### Manual Deployment
```bash
# Build and preview locally
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

### Environment Setup
- Node.js 22+ required
- All dependencies managed via npm
- No additional environment variables needed
- Analytics automatically configured for production

## License

MIT License
