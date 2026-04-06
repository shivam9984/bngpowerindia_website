# Getting Started Checklist

Complete this checklist to launch your FuelHub website in no time!

## Phase 1: Installation & Setup (5 minutes)

- [ ] **Install dependencies**
  ```bash
  npm install
  # or
  pnpm install
  ```
  
- [ ] **Start development server**
  ```bash
  npm run dev
  ```
  
- [ ] **Verify site runs**
  - Open http://localhost:3000
  - You should see the homepage
  - Navigation works

## Phase 2: Customize Company Info (10 minutes)

- [ ] **Edit site constants** (`/lib/constants.ts`)
  - [ ] Change `SITE_NAME` to your company name
  - [ ] Update `CONTACT_EMAIL`
  - [ ] Update `CONTACT_PHONE`
  - [ ] Update `CONTACT_ADDRESS`
  - [ ] Update `SOCIAL_LINKS` (or remove if not needed)

- [ ] **Edit layout metadata** (`/app/layout.tsx`)
  - [ ] Change page `title` in metadata
  - [ ] Update `description`
  - [ ] Update `keywords`

## Phase 3: Customize Homepage (15 minutes)

- [ ] **Edit hero section** (`/app/page.tsx`)
  - [ ] Update main heading text
  - [ ] Update subheading/description
  - [ ] Update call-to-action button text

- [ ] **Update features section**
  - [ ] Customize the 6 feature cards text (or reduce to 3-4)
  - [ ] Update feature descriptions
  - [ ] Change feature icons if desired

- [ ] **Update products showcase**
  - [ ] Edit the 3 featured products
  - [ ] Update product names and descriptions
  - [ ] Update prices

- [ ] **Test homepage changes**
  - [ ] Refresh page in browser
  - [ ] Verify all text updates show correctly
  - [ ] Check all buttons work

## Phase 4: Add Products (10 minutes)

- [ ] **Edit products page** (`/app/products/page.tsx`)
  - [ ] Update `allProducts` array with your products
  - [ ] Add/remove product categories
  - [ ] Set correct pricing
  - [ ] Update descriptions

- [ ] **Update services page** (`/app/services/page.tsx`)
  - [ ] Customize service offerings
  - [ ] Update benefits list
  - [ ] Update service descriptions

## Phase 5: Update Pages (15 minutes)

- [ ] **About page** (`/app/about/page.tsx`)
  - [ ] Update company story text
  - [ ] Update mission statement
  - [ ] Update vision statement
  - [ ] Update team member names/roles
  - [ ] Update certifications

- [ ] **Contact page** (`/app/contact/page.tsx`)
  - [ ] Verify contact email is correct
  - [ ] Verify phone number is correct
  - [ ] Update office address
  - [ ] Update FAQ questions/answers

- [ ] **Quote page** (`/app/quote/page.tsx`)
  - [ ] Verify form fields are correct
  - [ ] Update fuel type options if needed
  - [ ] Verify delivery frequency options

## Phase 6: Customize Theme (Optional, 10 minutes)

- [ ] **Review current theme**
  - Green-based (Warm & Accessible)
  - Check if it matches your brand

- [ ] **If changing colors** (`/app/globals.css`)
  - [ ] Choose new color palette (see THEME_CUSTOMIZATION.md)
  - [ ] Update `:root` section colors
  - [ ] Update `.dark` section colors
  - [ ] Test in both light and dark mode

- [ ] **If keeping current theme**
  - [ ] Skip this section
  - [ ] Current colors are professional and proven

## Phase 7: Add Logo & Images (15 minutes)

- [ ] **Add company logo** (`/public/`)
  - [ ] Add logo file to `/public/` folder
  - [ ] Update Header component to use your logo

- [ ] **Add product images** (`/public/images/`)
  - [ ] Create `/public/images/` folder
  - [ ] Add product images
  - [ ] Update ProductCard components with image paths

- [ ] **Add hero/feature images** (optional)
  - [ ] Add any additional images
  - [ ] Update page components

## Phase 8: Test All Features (10 minutes)

### Navigation
- [ ] All links in header work
- [ ] All links in footer work
- [ ] Mobile menu opens/closes
- [ ] Navigation works on mobile

### Forms
- [ ] Contact form submits (even if not yet integrated)
- [ ] Quote form submits
- [ ] All form fields visible and accessible

### Responsiveness
- [ ] Homepage looks good on phone (375px)
- [ ] Homepage looks good on tablet (768px)
- [ ] Homepage looks good on desktop (1024px+)
- [ ] All buttons clickable on mobile

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Images load properly

### Accessibility
- [ ] Can tab through page with keyboard
- [ ] Buttons have visible focus state
- [ ] Text has good contrast
- [ ] Links are clearly underlined

## Phase 9: Setup for Deployment (5 minutes)

- [ ] **Create GitHub repository**
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```

- [ ] **Connect to GitHub** (if not done)
  - [ ] Push code to GitHub repository

- [ ] **Sign up for Vercel** (if not done)
  - [ ] Go to https://vercel.com
  - [ ] Sign up with GitHub

- [ ] **Create `.env.local`** (if using external services)
  - [ ] Add environment variables if needed
  - [ ] Don't commit sensitive data

## Phase 10: Deploy! (5 minutes)

- [ ] **Deploy to Vercel**
  - [ ] Go to Vercel.com
  - [ ] Click "New Project"
  - [ ] Select your GitHub repository
  - [ ] Click "Deploy"
  - [ ] Wait for deployment to complete

- [ ] **Verify live site**
  - [ ] Visit your Vercel URL
  - [ ] Test all pages and functionality
  - [ ] Check responsive design on mobile

- [ ] **Setup custom domain** (optional)
  - [ ] In Vercel dashboard → Domains
  - [ ] Add your custom domain
  - [ ] Configure DNS settings

## Phase 11: Post-Launch (Optional)

- [ ] **Setup analytics**
  - [ ] Add Google Analytics (GA4)
  - [ ] Add tracking code to layout.tsx

- [ ] **Setup email notifications**
  - [ ] Connect contact form to email service
  - [ ] Connect quote form to email service

- [ ] **Add database** (optional)
  - [ ] Choose database: Supabase, Neon, or Firebase
  - [ ] Create tables for quotes and messages
  - [ ] Add database integration code

- [ ] **Add payment processing** (if selling products)
  - [ ] Integrate Stripe or PayPal
  - [ ] Setup product checkout

- [ ] **Optimize SEO**
  - [ ] Add meta descriptions
  - [ ] Add keywords
  - [ ] Submit to Google Search Console
  - [ ] Submit to Bing Webmaster Tools

- [ ] **Set up monitoring**
  - [ ] Enable Vercel Analytics
  - [ ] Setup error tracking (Sentry, etc.)

- [ ] **Add blog** (optional)
  - [ ] Create `/app/blog/` folder
  - [ ] Add blog post pages

## Quick Reference

### Important Files
| Task | File | Section |
|------|------|---------|
| Company info | `/lib/constants.ts` | All exports |
| Homepage | `/app/page.tsx` | Home component |
| Products | `/app/products/page.tsx` | allProducts array |
| Services | `/app/services/page.tsx` | services array |
| About | `/app/about/page.tsx` | Page content |
| Contact | `/app/contact/page.tsx` | Page content |
| Colors | `/app/globals.css` | :root and .dark |

### Commands
```bash
npm install          # Install dependencies
npm run dev         # Start dev server (port 3000)
npm run build       # Build for production
npm run lint        # Check code quality
npm start           # Start production server
```

### Verification Points
- [ ] `npm run dev` works without errors
- [ ] Site loads at http://localhost:3000
- [ ] All pages accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Forms submit (even if not integrated)

## Time Estimates

- **Phase 1-2**: ~15 minutes (installation + basic setup)
- **Phase 3-5**: ~40 minutes (customize content)
- **Phase 6**: ~10 minutes (optional theme change)
- **Phase 7**: ~15 minutes (add images)
- **Phase 8**: ~10 minutes (test everything)
- **Phase 9-10**: ~10 minutes (deploy)
- **TOTAL**: ~100 minutes (~1.5 hours) to fully launch

## Common Issues & Solutions

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "Changes not showing"
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Restart dev server

### "Module not found"
- Clear cache: `rm -rf .next`
- Reinstall: `npm install`

### "TypeScript errors"
- Check spelling in imports
- Ensure file paths are correct
- Run `npm run build` to see all errors

## Success Indicators

✅ Site runs locally without errors  
✅ All pages are accessible  
✅ Company info is customized  
✅ Content is updated  
✅ Site is responsive on mobile  
✅ Site is deployed to Vercel  
✅ Custom domain is set up (optional)  

## Next Steps After Launch

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor page speeds
   - Check for errors

2. **Gather Feedback**
   - Ask users for feedback
   - Test on real devices
   - Get beta tester feedback

3. **Iterate**
   - Fix any issues found
   - Optimize performance
   - Add requested features

4. **Scale**
   - Add database for forms
   - Integrate payment processing
   - Add more features

## Support

- **Documentation**: Read README.md and other guides
- **Questions**: Check SETUP.md for common tasks
- **Issues**: See FOLDER_STRUCTURE.md for project layout
- **Design**: See THEME_CUSTOMIZATION.md for colors

---

## 🎉 You're Ready!

Follow this checklist and you'll have a professional fuel business website launched in about 1.5 hours!

**Start with Phase 1** → `npm install` → `npm run dev` → Customize → Deploy! 🚀

**Happy launching!**
