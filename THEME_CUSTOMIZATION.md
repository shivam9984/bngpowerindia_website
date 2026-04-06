# Theme Customization Guide

## Current Theme: Warm & Accessible

This website uses a carefully selected color palette designed for the fuel business industry.

### Current Color Palette

```
Primary:      #1f4d2a (Deep Forest Green)
Accent:       #2d7a3a (Vibrant Green)
Background:   #faf6f1 (Warm Cream/Beige)
Foreground:   #2d3b2d (Dark Green Text)
Secondary:    #e8dcc8 (Warm Beige)
Card:         #ffffff (White)
```

## How to Change the Theme

### Step 1: Choose Your Colors

Pick 3-5 colors for your theme:
1. **Primary** - Main brand color (buttons, headers)
2. **Accent** - Highlight color (hover states, accents)
3. **Background** - Page background
4. **Text** - Main text color
5. **Secondary** - Alternative background

**Color Picker Tools:**
- https://color-hex.com/
- https://www.colorhexa.com/
- https://coolors.co/
- https://chir.mn/projects/TailwindCSS/

### Step 2: Update CSS Variables

Edit `/app/globals.css` and replace the hex colors in two sections:

#### Light Mode (`:root` section)
```css
:root {
  /* Primary Colors */
  --background: #faf6f1;        ← Change background color
  --foreground: #2d3b2d;        ← Change text color
  
  /* Card & Surface */
  --card: #ffffff;              ← Card background (usually white)
  --card-foreground: #2d3b2d;   ← Card text
  
  /* Primary - Main Brand Color */
  --primary: #1f4d2a;           ← Your main color
  --primary-foreground: #faf6f1; ← Text on primary
  
  /* Secondary - Alternative */
  --secondary: #e8dcc8;         ← Secondary color
  --secondary-foreground: #2d3b2d;
  
  /* Accent - Highlight Color */
  --accent: #2d7a3a;            ← Your accent color
  --accent-foreground: #faf6f1;
  
  /* ... other colors ... */
}
```

#### Dark Mode (`.dark` section)
Also update the `.dark` section for dark theme users:
```css
.dark {
  --background: #1a2a1a;        ← Dark background
  --foreground: #f0ebe4;        ← Light text
  --primary: #4db856;           ← Lighter version of primary
  --accent: #5fd163;            ← Lighter version of accent
  /* ... etc ... */
}
```

## Pre-made Theme Templates

### Theme 1: Professional Blue
Great for corporate/enterprise fuel companies
```css
--primary: #0d47a1;           /* Deep Blue */
--accent: #1976d2;            /* Bright Blue */
--background: #f5f5f5;        /* Light Gray */
--foreground: #212121;        /* Dark Gray */
--secondary: #e3f2fd;         /* Very Light Blue */
--card: #ffffff;              /* White */
```

### Theme 2: Warm Orange
Great for energy/petroleum companies
```css
--primary: #d97706;           /* Amber/Orange */
--accent: #f59e0b;            /* Bright Amber */
--background: #fffbf0;        /* Warm White */
--foreground: #351c15;        /* Dark Brown */
--secondary: #fed7aa;         /* Light Amber */
--card: #ffffff;              /* White */
```

### Theme 3: Modern Teal
Great for eco-friendly/sustainable fuel
```css
--primary: #0891b2;           /* Teal */
--accent: #06b6d4;            /* Cyan */
--background: #f0fdfa;        /* Very Light Teal */
--foreground: #0f766e;        /* Dark Teal */
--secondary: #ccfbf1;         /* Light Teal */
--card: #ffffff;              /* White */
```

### Theme 4: Classic Dark Green (Current)
Professional, trustworthy, stable
```css
--primary: #1f4d2a;           /* Deep Green */
--accent: #2d7a3a;            /* Vibrant Green */
--background: #faf6f1;        /* Cream Beige */
--foreground: #2d3b2d;        /* Dark Green */
--secondary: #e8dcc8;         /* Warm Beige */
--card: #ffffff;              /* White */
```

### Theme 5: Modern Black & Red
Bold, energetic, modern
```css
--primary: #1f2937;           /* Dark Gray-Black */
--accent: #dc2626;            /* Red */
--background: #f9fafb;        /* Off-White */
--foreground: #111827;        /* Almost Black */
--secondary: #fee2e2;         /* Light Red */
--card: #ffffff;              /* White */
```

## Understanding Color Usage

### Where Each Color is Used

**Primary** (`bg-primary text-primary-foreground`)
- Main buttons
- Call-to-action buttons
- Primary links
- Headers
- Hero section

**Accent** (`bg-accent text-accent-foreground`)
- Button hover states
- Secondary buttons
- Focus states
- Highlight elements
- Important accents

**Background** (`bg-background`)
- Page background
- Main content area
- Default surface color

**Foreground** (`text-foreground`)
- Body text
- Headings
- Main text color

**Secondary** (`bg-secondary`)
- Alternative backgrounds
- Card backgrounds (alternating)
- Section backgrounds
- Muted backgrounds

**Card** (`bg-card text-card-foreground`)
- Card components
- Pop-ups
- Modals
- Information boxes

**Muted** (`text-muted-foreground`)
- Secondary text
- Placeholder text
- Disabled states
- Fine print

## Color Naming Convention

The colors follow semantic naming:
- `--primary` + `--primary-foreground` = A matched pair
- `--secondary` + `--secondary-foreground` = Another matched pair
- `--card` + `--card-foreground` = Card surface pair

This ensures good contrast and readability.

## Testing Your Colors

### Contrast Checker
Make sure text is readable on background colors:
- https://www.tpgi.com/color-contrast-checker/
- https://webaim.org/resources/contrastchecker/

### WCAG Compliance
- AA standard: 4.5:1 contrast ratio (recommended)
- AAA standard: 7:1 contrast ratio (preferred)

## Tailwind Color Classes

All colors are available as Tailwind classes:

```tsx
// Background
className="bg-primary"           // Primary color
className="bg-secondary"         // Secondary color
className="bg-accent"            // Accent color
className="bg-background"        // Page background
className="bg-card"              // Card background

// Text
className="text-foreground"      // Main text
className="text-primary"         // Primary color text
className="text-muted-foreground" // Secondary text

// Combinations
className="bg-primary text-primary-foreground"  // Button style
className="bg-card text-card-foreground"        // Card style
```

## Dark Mode Support

The project automatically supports dark mode. When a user enables dark mode:

1. CSS variables switch to `.dark` values
2. All `bg-primary`, `text-foreground`, etc. use dark values
3. No component changes needed

To test dark mode:
1. Browser DevTools → Console
2. `document.documentElement.classList.toggle('dark')`
3. Refresh page

## Advanced: Custom Colors

If you need more colors, add them to `/app/globals.css`:

```css
:root {
  --success: #10b981;           /* Green for success */
  --warning: #f59e0b;           /* Amber for warnings */
  --error: #ef4444;             /* Red for errors */
  --info: #3b82f6;              /* Blue for info */
}

.dark {
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;
  --info: #60a5fa;
}
```

Then add to `@theme inline`:
```css
@theme inline {
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --color-info: var(--info);
}
```

Use in components:
```tsx
className="bg-success text-success-foreground"
```

## Typography Colors

You can also customize heading and text colors:

Edit `/app/globals.css` `@layer base` section:
```css
@layer base {
  h1 {
    @apply text-4xl font-bold text-primary;  /* Change from text-foreground to text-primary */
  }
  
  h2 {
    @apply text-3xl font-bold text-accent;   /* Use accent color */
  }
}
```

## Brand Guidelines

When choosing colors, consider:

1. **Industry Association**
   - Green = Growth, eco-friendly, sustainability
   - Blue = Trust, corporate, stability
   - Orange = Energy, warmth, progress
   - Red = Energy, urgency, power

2. **Competitor Analysis**
   - Avoid colors competitors use heavily
   - Stand out from the crowd

3. **Target Audience**
   - Enterprise: Blues, grays, blacks
   - Eco-conscious: Greens, teals
   - Modern startup: Bold colors, contrasts

4. **Accessibility**
   - Sufficient contrast for readability
   - Color-blind friendly (don't rely on red/green only)
   - WCAG AA compliance minimum

## Exporting Colors to Other Tools

### For Figma/Design Tools
Copy and paste your colors:
```
Primary: #1f4d2a
Accent: #2d7a3a
Background: #faf6f1
Foreground: #2d3b2d
Secondary: #e8dcc8
Card: #ffffff
```

### For Brand Guidelines
Document your palette:
```
Color Name    | Hex Code | Usage
Primary       | #1f4d2a  | Buttons, headers
Accent        | #2d7a3a  | Highlights, hover
Background    | #faf6f1  | Page background
Foreground    | #2d3b2d  | Body text
Secondary     | #e8dcc8  | Section backgrounds
Card          | #ffffff  | Cards, modals
```

## Troubleshooting

### Colors Not Changing
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R`
3. Restart dev server: Stop and run `npm run dev` again

### Dark Mode Not Working
1. Check `.dark` class variables are defined
2. Test in DevTools console: `document.documentElement.classList.toggle('dark')`

### Poor Contrast
1. Use contrast checker: https://webaim.org/resources/contrastchecker/
2. Increase saturation of darker colors
3. Decrease saturation of lighter colors

### Colors Look Different Across Browsers
- Normal behavior (color management differences)
- Use consistent viewing environment
- Test on Windows, Mac, and Linux if possible

## Resources

- **Color Tools**: https://coolors.co/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Web Color Standards**: https://www.w3.org/TR/css-color-3/

---

**Tip**: Start with the pre-made templates above, then tweak colors to match your brand perfectly!
