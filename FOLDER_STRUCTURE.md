# FuelHub - Complete Folder Structure Guide

## Directory Hierarchy

```
fuelhub/
│
├── app/                                    # Next.js App Router Directory
│   ├── layout.tsx                         # Root layout (navbar, metadata, fonts)
│   ├── page.tsx                           # Homepage
│   ├── globals.css                        # Global styles & design tokens
│   │
│   ├── products/                          # Products page route
│   │   └── page.tsx                       # Products listing with filters
│   │
│   ├── services/                          # Services page route
│   │   └── page.tsx                       # Service offerings
│   │
│   ├── about/                             # About page route
│   │   └── page.tsx                       # Company information
│   │
│   ├── contact/                           # Contact page route
│   │   └── page.tsx                       # Contact form & info
│   │
│   └── quote/                             # Quote page route
│       └── page.tsx                       # Quote request form
│
├── components/                             # Reusable React Components
│   │
│   ├── layout/                            # Layout Components
│   │   ├── header.tsx                     # Navigation bar (sticky)
│   │   ├── footer.tsx                     # Footer with links & social
│   │   └── section.tsx                    # Reusable section container
│   │
│   ├── cards/                             # Card Components
│   │   ├── product-card.tsx               # Product showcase card
│   │   └── feature-card.tsx               # Feature/benefit card
│   │
│   └── ui/                                # UI Components (shadcn/ui)
│       ├── button.tsx                     # Button component
│       ├── card.tsx                       # Card component
│       ├── input.tsx                      # Input component
│       └── [other-components]/            # Additional shadcn/ui components
│
├── lib/                                    # Utility & Configuration Files
│   ├── constants.ts                       # Site-wide constants
│   ├── types.ts                           # TypeScript interfaces
│   ├── utils.ts                           # Helper functions (cn utility)
│   └── validators.ts                      # (Optional) Form validation
│
├── public/                                 # Static Assets
│   ├── favicon.ico                        # Website favicon
│   ├── apple-icon.png                     # Apple touch icon
│   ├── icon-light-32x32.png              # Light theme icon
│   ├── icon-dark-32x32.png               # Dark theme icon
│   ├── icon.svg                           # SVG icon
│   └── [images]/                          # Product/brand images
│
├── styles/                                 # (Optional) Additional Styles
│   └── [additional-stylesheets]/
│
├── hooks/                                  # Custom React Hooks
│   ├── use-mobile.tsx                     # Mobile detection hook
│   └── use-toast.ts                       # Toast notification hook
│
├── config/                                 # (Optional) Configuration Files
│   └── site.ts                            # Site configuration
│
├── Root Configuration Files
│   ├── tailwind.config.ts                 # Tailwind CSS configuration
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── next.config.mjs                    # Next.js configuration
│   ├── package.json                       # Dependencies & scripts
│   ├── package-lock.json                  # Lock file
│   ├── .gitignore                         # Git ignore rules
│   ├── .env.example                       # Environment variables template
│   └── .env.local                         # (Local only) Environment secrets
│
├── Documentation Files
│   ├── README.md                          # Project overview & setup
│   ├── FOLDER_STRUCTURE.md               # This file
│   ├── CONTRIBUTING.md                    # (Optional) Contribution guidelines
│   └── DEPLOYMENT.md                      # (Optional) Deployment guide
```

## File Descriptions

### App Directory (`/app`)

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout wrapper, sets up metadata, fonts, and structure for all pages |
| `page.tsx` | Homepage - hero section, features, products showcase, CTA |
| `globals.css` | Global styles, design tokens (colors), typography |
| `products/page.tsx` | Product catalog with filtering by category |
| `services/page.tsx` | Service offerings with detailed descriptions |
| `about/page.tsx` | Company story, stats, team, certifications |
| `contact/page.tsx` | Contact form, contact info, FAQ |
| `quote/page.tsx` | Quote request form for customers |

### Components Directory (`/components`)

#### Layout Components (`/components/layout`)
| File | Props | Usage |
|------|-------|-------|
| `header.tsx` | None | Navigation with mobile menu - import once in root layout |
| `footer.tsx` | None | Footer with links, contact info, social - import once in root layout |
| `section.tsx` | `variant?: 'default' \| 'secondary'`, `className?` | Wrapper for page sections with consistent padding |

#### Card Components (`/components/cards`)
| File | Props | Usage |
|------|-------|-------|
| `product-card.tsx` | `id`, `name`, `description`, `price`, `category`, `image?`, `onLearnMore?` | Display individual products |
| `feature-card.tsx` | `icon`, `title`, `description` | Display feature/benefit highlights |

#### UI Components (`/components/ui`)
- Standard shadcn/ui components
- Pre-built with design system integration
- Ready to use throughout the app

### Library Files (`/lib`)

| File | Content |
|------|---------|
| `constants.ts` | Site name, contact info, navigation items, business hours, theme colors |
| `types.ts` | TypeScript interfaces for Products, Services, Quotes, Messages |
| `utils.ts` | Helper functions (mainly `cn` utility for class merging) |

### Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Tailwind CSS theme configuration |
| `tsconfig.json` | TypeScript compiler options |
| `next.config.mjs` | Next.js build and runtime configuration |
| `package.json` | Dependencies, scripts, project metadata |

## How to Use This Structure

### Adding a New Page

1. Create a folder in `/app` (e.g., `/app/blog`)
2. Add `page.tsx` inside it
3. Use the Header and Footer components
4. Wrap content with the Section component

```typescript
// /app/blog/page.tsx
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Section>
          {/* Your content here */}
        </Section>
      </main>
      <Footer />
    </div>
  )
}
```

### Adding a New Component

1. Create file in appropriate subfolder under `/components`
2. Export as default or named export
3. Add TypeScript types/interfaces
4. Use design tokens for styling

```typescript
// /components/cards/new-card.tsx
import { Card } from '@/components/ui/card'

interface NewCardProps {
  title: string
  description: string
}

export function NewCard({ title, description }: NewCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}
```

### Using Theme Colors

Colors are defined as CSS custom properties in `globals.css`:

```tsx
// In your component:
<div className="bg-primary text-primary-foreground">
  {/* Uses design tokens */}
</div>

// Available color classes:
// bg/text: background, foreground, card, card-foreground, primary, primary-foreground
//          secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground
//          destructive, destructive-foreground, border, input, ring
```

### Adding New Constants

Edit `/lib/constants.ts`:

```typescript
// Add to existing or create new constant
export const NEW_CONSTANT = {
  key: 'value',
  // ...
}
```

### Adding New Types

Edit `/lib/types.ts`:

```typescript
export interface NewType {
  id: string
  name: string
  // ...
}
```

## Best Practices

1. **Keep components focused** - One responsibility per component
2. **Use TypeScript** - Define interfaces for all props
3. **Follow naming conventions** - Components use PascalCase, utilities use camelCase
4. **Use design tokens** - Refer to `/lib/constants.ts` for colors/text
5. **Group related files** - Keep related components in the same folder
6. **Keep pages lean** - Move logic to components or utils
7. **Use the Section component** - For consistent spacing and styling
8. **Mobile-first** - Design for mobile, enhance for larger screens

## Scaling the Project

### When to Add Folders

- **`/api`** - When adding API routes (Next.js API Routes)
- **`/hooks`** - When you have 3+ custom hooks
- **`/contexts`** - When you need global state management
- **`/services`** - When you have API client logic
- **`/validators`** - When you have form validation logic
- **`/styles`** - When you have shared style utilities

### Database Integration

When adding a database:
1. Add environment variables to `.env.local`
2. Create database functions in `/lib/db.ts`
3. Create API routes in `/app/api`
4. Update types in `/lib/types.ts`

### Authentication

When adding authentication:
1. Set up auth provider (Supabase, Auth0, etc.)
2. Create auth context in `/contexts/auth.tsx`
3. Create useAuth hook in `/hooks/use-auth.ts`
4. Add protected routes logic

## Module Aliases

The project uses path aliases defined in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This allows imports like:
```typescript
import { Button } from '@/components/ui/button'
import { SITE_NAME } from '@/lib/constants'
```

---

**Version**: 1.0  
**Last Updated**: 2024  
**Framework**: Next.js 16  
**Status**: Ready for Development
