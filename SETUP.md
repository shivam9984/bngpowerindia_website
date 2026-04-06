# FuelHub - Quick Setup Guide

## Initial Setup (5 minutes)

### 0. (If using Supabase Auth) Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.example .env.local
```

You can find these in the Supabase Dashboard → Project Settings → API.

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Customize for Your Business

#### Step 1: Update Company Information
Edit `/lib/constants.ts`:
```typescript
export const SITE_NAME = 'Your Company Name'
export const CONTACT_EMAIL = 'your-email@company.com'
export const CONTACT_PHONE = '+1 (555) 999-9999'
export const CONTACT_ADDRESS = 'Your Address'
```

#### Step 2: Update Site Metadata
Edit `/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Company - Premium Fuel Solutions',
  description: 'Your company description here',
  // ...
}
```

#### Step 3: (Optional) Update Theme Colors
If you want to change the green theme to a different color, edit `/app/globals.css`:

**Replace these colors:**
```css
:root {
  --primary: #your-primary-color;        /* Main brand color */
  --accent: #your-accent-color;          /* Secondary brand color */
  --background: #your-background-color;  /* Page background */
  --foreground: #your-text-color;        /* Text color */
}
```

**Find websites to pick hex colors:**
- https://www.colorhexa.com/
- https://coolors.co/
- https://color-hex.com/

## Project Structure Overview

```
📁 fuelhub/
├── 📁 app/                    # Pages (routes)
│   ├── page.tsx              # Homepage
│   ├── products/page.tsx      # Products page
│   ├── services/page.tsx      # Services page
│   ├── about/page.tsx         # About page
│   ├── contact/page.tsx       # Contact page
│   └── quote/page.tsx         # Quote request page
│
├── 📁 components/             # Reusable components
│   ├── layout/               # Header, footer, sections
│   └── cards/                # Product cards, feature cards
│
├── 📁 lib/                    # Utilities & constants
│   ├── constants.ts          # Site-wide constants
│   └── types.ts              # TypeScript types
│
└── 📁 public/                 # Images & static files
```

See `FOLDER_STRUCTURE.md` for complete details.

## Key Files to Edit

| Task | File | What to Change |
|------|------|----------------|
| Company name & contact | `/lib/constants.ts` | SITE_NAME, emails, phone, address |
| Page titles & meta tags | `/app/layout.tsx` | metadata object |
| Theme colors | `/app/globals.css` | CSS variables in `:root` |
| Navigation menu | `/components/layout/header.tsx` | navigation links |
| Homepage content | `/app/page.tsx` | hero text, features, CTA |
| Products | `/app/products/page.tsx` | allProducts array |
| Footer info | `/components/layout/footer.tsx` | footer content |

## Common Tasks

### ✏️ Edit Homepage Text
Edit `/app/page.tsx`, find the `<h1>` and `<p>` tags, update the text.

### 🛍️ Add New Product
Edit `/app/products/page.tsx`, find `allProducts` array, add:
```typescript
{
  id: '9',
  name: 'Your Product Name',
  description: 'Product description here',
  price: '$X.XX/unit',
  category: 'Category Name',
}
```

### 🎨 Change Theme Colors
Edit `/app/globals.css`, find `:root` section, replace hex colors:
```css
--primary: #1f4d2a;     ← Change this to your color
--accent: #2d7a3a;      ← And this
```

### 📞 Update Contact Info
Edit `/lib/constants.ts`:
```typescript
export const CONTACT_EMAIL = 'new-email@company.com'
export const CONTACT_PHONE = '+1 (555) 999-9999'
export const CONTACT_ADDRESS = 'New Address, City, ST 12345'
```

### 📱 Add New Page
1. Create new folder: `/app/your-page/`
2. Create file: `/app/your-page/page.tsx`
3. Copy content from `/app/products/page.tsx` as template
4. Update Header and Footer components

### 🔗 Update Navigation Links
Edit `/components/layout/header.tsx`, find the `<Link>` elements in navigation section.

## Deployment

### Deploy to Vercel (Free & Easy)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! Your site is live

3. **Custom Domain**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

### Build for Production

```bash
npm run build
npm start
```

## Using Design System

### Colors
Use these Tailwind classes (they use design tokens):
```tsx
// Background & Text
className="bg-background text-foreground"

// Cards
className="bg-card text-card-foreground"

// Buttons & Links
className="bg-primary text-primary-foreground hover:bg-accent"

// Disabled/Secondary
className="bg-secondary text-secondary-foreground"
```

### Typography
```tsx
<h1>Large Heading</h1>        {/* 4xl, bold */}
<h2>Medium Heading</h2>        {/* 3xl, bold */}
<h3>Small Heading</h3>         {/* 2xl, semibold */}
<p>Body text</p>               {/* base, regular */}
<p className="small-text">Small</p>  {/* sm text, muted */}
```

### Spacing
Use Tailwind spacing utilities:
```tsx
className="p-4"        {/* Padding: 1rem */}
className="m-4"        {/* Margin: 1rem */}
className="gap-6"      {/* Gap between flex/grid items */}
className="mt-8"       {/* Margin-top: 2rem */}
```

## Database Integration (When Ready)

To add a database later:
1. Choose provider: Supabase, Neon, or Firebase
2. Set environment variables in `.env.local`
3. Create database functions in `/lib/db.ts`
4. Create API routes in `/app/api/`
5. Update components to use database

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=your-database-url
```

Variables starting with `NEXT_PUBLIC_` are exposed to the browser.

## TypeScript Tips

The project uses TypeScript. Benefits:
- Catch errors before runtime
- Better IDE autocomplete
- Self-documenting code

Example:
```typescript
interface Product {
  id: string
  name: string
  price: string
}

function ProductCard({ name, price }: Product) {
  return <div>{name} - {price}</div>
}
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Changes Not Showing
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear `.next` folder: `rm -rf .next`
3. Restart dev server

### Build Errors
1. Check Node.js version: `node --version` (need 18+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run build`

## Next Steps

1. ✅ Customize company info
2. ✅ Update homepage content
3. ✅ Add your products/services
4. ✅ Set up contact form backend (optional)
5. ✅ Deploy to Vercel
6. ✅ Set up custom domain

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **React**: https://react.dev

## Support

For questions:
- Check `README.md` for more details
- Review `FOLDER_STRUCTURE.md` for file organization
- Consult Next.js documentation for advanced features

---

**Ready to launch?** Follow the steps above and deploy to Vercel in minutes! 🚀
