# FuelHub Visual Guide

## Project Structure Tree

```
fuelhub/ (root)
│
├── 📁 app/
│   ├── 📄 layout.tsx ........................ Root layout (Header, Footer, metadata)
│   ├── 📄 page.tsx ......................... Homepage
│   ├── 📄 globals.css ....................... Design tokens & global styles
│   │
│   ├── 📁 products/
│   │   └── 📄 page.tsx ..................... Products page with filters
│   │
│   ├── 📁 services/
│   │   └── 📄 page.tsx ..................... Services page
│   │
│   ├── 📁 about/
│   │   └── 📄 page.tsx ..................... About company page
│   │
│   ├── 📁 contact/
│   │   └── 📄 page.tsx ..................... Contact & forms page
│   │
│   └── 📁 quote/
│       └── 📄 page.tsx ..................... Quote request page
│
├── 📁 components/
│   ├── 📁 layout/
│   │   ├── 📄 header.tsx ................... Navigation bar
│   │   ├── 📄 footer.tsx ................... Footer section
│   │   └── 📄 section.tsx .................. Section wrapper
│   │
│   ├── 📁 cards/
│   │   ├── 📄 product-card.tsx ............ Product display card
│   │   └── 📄 feature-card.tsx ............ Feature highlight card
│   │
│   └── 📁 ui/
│       ├── 📄 button.tsx .................. Button component
│       ├── 📄 card.tsx .................... Card component
│       └── ... (other shadcn/ui components)
│
├── 📁 lib/
│   ├── 📄 constants.ts ..................... Site constants & config
│   ├── 📄 types.ts ......................... TypeScript interfaces
│   └── 📄 utils.ts ......................... Utility functions
│
├── 📁 public/
│   ├── 📄 favicon.ico ...................... Website icon
│   ├── 📄 apple-icon.png ................... Apple touch icon
│   └── ... (static assets & images)
│
├── 📁 hooks/
│   ├── 📄 use-mobile.tsx ................... Mobile detection hook
│   └── 📄 use-toast.ts ..................... Toast notification hook
│
├── 📋 Configuration Files
│   ├── 📄 tailwind.config.ts ............... Tailwind config
│   ├── 📄 tsconfig.json .................... TypeScript config
│   ├── 📄 next.config.mjs .................. Next.js config
│   ├── 📄 package.json ..................... Dependencies
│   └── 📄 package-lock.json ................ Lock file
│
└── 📚 Documentation
    ├── 📄 README.md ........................ Project overview
    ├── 📄 SETUP.md ......................... Quick start guide
    ├── 📄 FOLDER_STRUCTURE.md .............. Detailed structure
    ├── 📄 THEME_CUSTOMIZATION.md ........... Color guide
    ├── 📄 BOILERPLATE_SUMMARY.md ........... What's included
    └── 📄 VISUAL_GUIDE.md .................. This file
```

## Component Dependency Map

```
App Root (layout.tsx)
│
├── Header (navigation)
├── Main Content
│   ├── Homepage
│   │   ├── Section (hero)
│   │   ├── Section (features)
│   │   │   └── FeatureCard (x6)
│   │   ├── Section (products)
│   │   │   └── ProductCard (x3)
│   │   └── Section (CTA)
│   │
│   ├── Products Page
│   │   ├── Section (header)
│   │   ├── Category Filters
│   │   ├── ProductCard Grid (x8)
│   │   └── Section (bulk orders)
│   │
│   ├── Services Page
│   │   ├── Section (header)
│   │   ├── FeatureCard Grid (x4)
│   │   ├── Detailed Services
│   │   └── Benefits List
│   │
│   ├── About Page
│   │   ├── Section (story)
│   │   ├── Statistics Grid
│   │   ├── Mission/Vision Cards
│   │   ├── Team Grid
│   │   └── Certifications
│   │
│   ├── Contact Page
│   │   ├── Contact Info Cards (x3)
│   │   ├── Contact Form
│   │   ├── Map Section
│   │   └── FAQ Grid
│   │
│   └── Quote Page
│       ├── Quote Form
│       │   ├── Company Info Section
│       │   ├── Fuel Requirements
│       │   ├── Delivery Info
│       │   └── Additional Notes
│       └── Info Cards
│
└── Footer
    ├── Company Info
    ├── Quick Links
    ├── Services Links
    └── Contact & Social
```

## Color Usage Map

```
┌─────────────────────────────────────────────┐
│  FuelHub Color System - Warm & Accessible   │
├─────────────────────────────────────────────┤
│                                             │
│  PRIMARY: #1f4d2a (Deep Forest Green)       │
│  ├─ Buttons                                 │
│  ├─ Headers                                 │
│  ├─ Hero Section                            │
│  └─ Link Hover                              │
│                                             │
│  ACCENT: #2d7a3a (Vibrant Green)           │
│  ├─ Button Hover State                      │
│  ├─ Focus States                            │
│  ├─ Highlights                              │
│  └─ Secondary CTA                           │
│                                             │
│  BACKGROUND: #faf6f1 (Warm Cream/Beige)    │
│  ├─ Page Background                         │
│  ├─ Main Content Area                       │
│  └─ Default Surface                         │
│                                             │
│  SECONDARY: #e8dcc8 (Warm Beige)           │
│  ├─ Alternative Backgrounds                 │
│  ├─ Feature Sections                        │
│  └─ Alternating Sections                    │
│                                             │
│  CARD: #ffffff (White)                     │
│  ├─ Card Components                         │
│  ├─ Pop-ups & Modals                        │
│  └─ Input Fields                            │
│                                             │
│  FOREGROUND: #2d3b2d (Dark Green Text)     │
│  ├─ Body Text                               │
│  ├─ Headings                                │
│  └─ Default Text Color                      │
│                                             │
└─────────────────────────────────────────────┘
```

## Page Layout Structure

### Homepage Structure
```
┌─────────────────────────────────────────┐
│            HEADER (Sticky)              │  ← Navigation
├─────────────────────────────────────────┤
│                                         │
│        Hero Section                     │  ← Big heading + CTA
│    (Green background, call-to-action)   │
│                                         │
├─────────────────────────────────────────┤
│        Why Choose FuelHub?              │  ← Features (6 cards)
│   (Beige background, 6 feature cards)   │
│                                         │
├─────────────────────────────────────────┤
│        Our Fuel Products                │  ← Product showcase (3)
│    (White background, 3 product cards)  │
│                                         │
├─────────────────────────────────────────┤
│      Ready to Partner With Us?          │  ← CTA section
│    (Beige background, button)           │
│                                         │
├─────────────────────────────────────────┤
│            FOOTER                       │  ← Contact, links, social
└─────────────────────────────────────────┘
```

## Component Props Reference

### ProductCard Props
```typescript
{
  id: string              // Unique identifier
  name: string            // Product name
  description: string     // Short description
  price: string           // Pricing (e.g., "$3.49/gal")
  category: string        // Product category
  image?: string          // Optional product image
  onLearnMore?: ()=>void  // Callback for button click
}
```

### FeatureCard Props
```typescript
{
  icon: LucideIcon    // Icon from lucide-react
  title: string       // Feature title
  description: string // Feature description
}
```

### Section Props
```typescript
{
  children: ReactNode           // Page content
  variant?: 'default'|'secondary' // Background style
  className?: string            // Additional classes
}
```

## File Size Overview

```
Components
├── layout/header.tsx ............ ~3.5 KB
├── layout/footer.tsx ............ ~3.8 KB
├── layout/section.tsx ........... ~0.6 KB
├── cards/product-card.tsx ....... ~1.8 KB
└── cards/feature-card.tsx ....... ~0.8 KB

Pages
├── page.tsx (homepage) .......... ~6.2 KB
├── products/page.tsx ............ ~4.5 KB
├── services/page.tsx ............ ~7.8 KB
├── about/page.tsx ............... ~7.2 KB
├── contact/page.tsx ............. ~8.1 KB
└── quote/page.tsx ............... ~9.5 KB

Library
├── constants.ts ................. ~1.8 KB
└── types.ts ..................... ~1.9 KB

Total Code Size (minified): ~60 KB
Total Bundle Size (gzipped): ~45 KB
```

## Data Flow Diagram

```
User Request
    ↓
Next.js Router → Page Component
    ↓
├── Header Component
│   └── Navigation Links
├── Main Content
│   └── Section Components
│       └── Child Components
│           ├── ProductCard
│           ├── FeatureCard
│           └── Other UI Components
└── Footer Component
    └── Links & Contact Info
    ↓
HTML Rendered → Browser
```

## Customization Flow

```
START
  ↓
[1] Edit /lib/constants.ts
  ├─ Company name
  ├─ Contact info
  └─ Navigation items
  ↓
[2] Update /app/layout.tsx
  ├─ Page titles
  ├─ Metadata
  └─ Description
  ↓
[3] Customize /app/globals.css
  ├─ Theme colors
  ├─ Typography
  └─ Design tokens
  ↓
[4] Update Page Content
  ├─ Homepage text
  ├─ Products/Services
  └─ Team information
  ↓
[5] Add Assets
  ├─ Logo
  ├─ Images
  └─ Icons
  ↓
[6] Deploy
  └─ Push to GitHub → Vercel
  ↓
END - Live Website! 🚀
```

## Responsive Breakpoints

```
Mobile       Tablet       Desktop      Wide
< 640px      640-1024px   1024-1280px  > 1280px

xs           sm           md           lg           xl           2xl
                          ↓            ↓            ↓            ↓
             │ mobile     │ tablet    │ desktop  │ large
             │ first      │ layout    │ layout   │ layout
             │ design     │           │          │
                          
Header Layout
Mobile:  Hamburger menu
Tablet:  Menu items + button
Desktop: Full navigation + button

Grid Layouts
Mobile:  grid-cols-1 (1 column)
Tablet:  md:grid-cols-2 (2 columns)
Desktop: lg:grid-cols-3 (3 columns)
```

## Feature Cards Layout

```
6 Features on Homepage
┌──────────────┬──────────────┬──────────────┐
│ Premium Fuel │ Reliable Del.│ Safety First │
│ Quality      │              │              │
└──────────────┴──────────────┴──────────────┘
┌──────────────┬──────────────┬──────────────┐
│ Competitive  │ 24/7 Support │ Industry     │
│ Pricing      │              │ Certified    │
└──────────────┴──────────────┴──────────────┘
```

## Product Catalog Organization

```
All Products (8)
├─ Gasoline (2)
│  ├─ Premium (92 Octane)
│  └─ Premium (95 Octane)
├─ Diesel (2)
│  ├─ Standard
│  └─ Premium
├─ Eco-Friendly (2)
│  ├─ B10 Blend
│  └─ B20 Blend
├─ Heating (1)
│  └─ Heating Oil
└─ Specialty (1)
   └─ Kerosene
```

## Navigation Structure

```
Header Navigation Menu
├─ Home (/)
├─ Products (/products)
├─ Services (/services)
├─ About (/about)
├─ Contact (/contact)
└─ Get Quote (/quote) ← CTA Button

Mobile Menu (Hamburger)
├─ Home
├─ Products
├─ Services
├─ About
├─ Contact
└─ Get Quote ← Full width button
```

## Form Layouts

### Contact Form
```
Name          Email
│             │
Phone         Company
│             │
Message (wide)
│
[Send] Button
```

### Quote Form
```
Company Name  Contact Name
Email         Phone
Fuel Type     Quantity
Delivery Frequency (4 radio buttons)
Delivery Address
Additional Notes
[Request Quote] Button
```

## Technology Stack Visualization

```
┌─────────────────────────────────────────┐
│         FuelHub Tech Stack              │
├─────────────────────────────────────────┤
│  Frontend                               │
│  ├─ React 19 (UI Library)              │
│  ├─ Next.js 16 (Framework)             │
│  ├─ TypeScript (Type Safety)           │
│  └─ Tailwind CSS (Styling)             │
│                                         │
│  Components                             │
│  ├─ shadcn/ui (UI Components)          │
│  ├─ Lucide React (Icons)               │
│  └─ Geist (Typography)                 │
│                                         │
│  Development                            │
│  ├─ Node.js (Runtime)                  │
│  ├─ npm/pnpm (Package Manager)         │
│  └─ ESLint (Linting)                   │
│                                         │
│  Deployment                             │
│  └─ Vercel (Recommended)               │
│                                         │
└─────────────────────────────────────────┘
```

---

**This visual guide helps you understand the project structure at a glance!**
For more details, see the other documentation files.
