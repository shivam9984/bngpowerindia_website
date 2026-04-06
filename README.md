# FuelHub - Fuel Business Website

A modern, responsive website for a fuel distribution business built with Next.js 16, React 19, and Tailwind CSS.

## Theme: Warm & Accessible

**Color Palette:**
- **Primary**: Deep Forest Green (#1f4d2a) - Trust and stability
- **Accent**: Vibrant Green (#2d7a3a) - Energy and growth
- **Background**: Warm Cream/Beige (#faf6f1) - Approachable and welcoming
- **Neutrals**: White, grays, and dark greens - Professional and clean

## Project Structure

```
fuelhub/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── globals.css                # Global styles with design tokens
│   ├── page.tsx                   # Homepage
│   ├── products/
│   │   └── page.tsx               # Products showcase page
│   ├── services/
│   │   └── page.tsx               # Services page
│   ├── about/
│   │   └── page.tsx               # About company page
│   ├── contact/
│   │   └── page.tsx               # Contact page
│   └── quote/
│       └── page.tsx               # Quote request page
│
├── components/
│   ├── layout/
│   │   ├── header.tsx             # Navigation header
│   │   ├── footer.tsx             # Footer with links and info
│   │   └── section.tsx            # Reusable section container
│   │
│   ├── cards/
│   │   ├── product-card.tsx       # Product display card
│   │   └── feature-card.tsx       # Feature highlight card
│   │
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/
│   ├── constants.ts               # Site-wide constants
│   ├── types.ts                   # TypeScript type definitions
│   └── utils.ts                   # Utility functions
│
├── public/
│   └── ...                        # Static assets
│
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Key Features

### Pages Included

1. **Homepage** (`/`)
   - Hero section with call-to-action
   - Feature highlights (6 key benefits)
   - Product showcase (3 featured products)
   - Call-to-action section

2. **Products** (`/products`)
   - Full product catalog (8 products)
   - Category filtering
   - Product cards with pricing
   - Bulk order CTA

3. **Services** (`/services`)
   - Service offerings overview
   - Detailed service descriptions
   - Benefits list
   - Integration showcase

4. **About** (`/about`)
   - Company story and mission
   - Key statistics
   - Leadership team (4 members)
   - Industry certifications

5. **Contact** (`/contact`)
   - Contact form
   - Multiple contact methods
   - Location map placeholder
   - FAQ section

6. **Quote** (`/quote`)
   - Comprehensive quote request form
   - Fuel type selection
   - Delivery frequency options
   - Company information collection

### Reusable Components

- **Header**: Sticky navigation with mobile menu
- **Footer**: Multi-column footer with links and social media
- **Section**: Responsive section container with variant support
- **ProductCard**: Reusable product display component
- **FeatureCard**: Icon-based feature highlight component

### Design Tokens

All colors are defined as CSS custom properties in `globals.css`:
- Background & foreground colors
- Card colors
- Primary, secondary, and accent colors
- Border and input colors
- Chart colors for data visualization
- Sidebar colors

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fuelhub
```

2. (If using Supabase Auth) Set environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase Dashboard → Project Settings → API.

3. Install dependencies
```bash
npm install
# or
pnpm install
```

4. Run the development server
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Update Company Information

Edit `/lib/constants.ts`:
```typescript
export const SITE_NAME = 'Your Company Name'
export const CONTACT_EMAIL = 'your-email@example.com'
export const CONTACT_PHONE = 'Your Phone'
export const CONTACT_ADDRESS = 'Your Address'
```

### Change Theme Colors

Edit design tokens in `/app/globals.css`:
```css
:root {
  --primary: #your-color;
  --accent: #your-color;
  --background: #your-color;
  /* ... more colors ... */
}
```

### Modify Navigation

Update `/lib/constants.ts` in the `NAVIGATION_ITEMS` array or edit the `Header` component directly.

### Add New Products

Edit the `allProducts` array in `/app/products/page.tsx` or create a database integration.

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **React**: Version 19 with latest features
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Geist (via Google Fonts)
- **Type Safety**: TypeScript

## Performance Optimizations

- Server-side rendering (SSR) where appropriate
- Responsive images and lazy loading
- CSS-in-JS optimization with Tailwind
- Semantic HTML structure
- Accessibility (WCAG 2.1 compliant)

## SEO Optimization

- Semantic HTML elements
- Meta tags and Open Graph
- Mobile-responsive design
- Structured content
- Fast page load times
- Alt text for images

## Accessibility Features

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly
- Mobile-friendly design

## Future Enhancements

Consider adding:
- Database integration (Supabase, Neon)
- User authentication
- Blog/news section
- Customer testimonials
- Fleet management dashboard
- Real-time price updates
- Payment integration
- API endpoints for quote requests
- Email notifications
- Admin dashboard

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel automatically detects Next.js
4. Click Deploy

```bash
npm run build
npm start
```

### Environment Variables

Add `.env.local` for environment-specific variables:
```
NEXT_PUBLIC_API_URL=your-api-url
DATABASE_URL=your-database-url
```

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For questions or issues, contact: info@fuelhub.com or +1 (555) 123-4567

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with Next.js and Tailwind CSS | FuelHub 2024
