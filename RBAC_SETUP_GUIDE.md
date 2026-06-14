# RBAC (Role-Based Access Control) & Authentication Setup Guide

## 🎯 Overview

Your FuelHub application now includes a complete RBAC system with Supabase authentication. This guide will help you set up and configure the system.

## 🗂️ What's Been Created

### 1. **Database Schema**
- `profiles` table with user roles (admin, manager, salesperson, customer)
- Row-level security (RLS) policies for data protection
- Automatic profile creation on user signup via triggers

### 2. **Authentication Pages**
- **Login** (`/auth/login`) - User login with email/password
- **Signup** (`/auth/signup`) - New user registration with role selection
- **Signup Success** (`/auth/signup-success`) - Email verification confirmation
- **Auth Error** (`/auth/error`) - Authentication error handling
- **Auth Callback** (`/auth/callback`) - Email verification callback

### 3. **Dashboard System**
- Protected dashboard layout with role-based access
- Role-specific dashboards:
  - **Admin Dashboard** - Full system control, user management, reports
  - **Manager Dashboard** - Team management, order monitoring, performance metrics
  - **Salesperson Dashboard** - Customer management, quote creation, sales tracking
  - **Customer Dashboard** - Order history, quotes, product browsing

### 4. **Theme Updates**
- Added light orange color (#F59E0B) for action buttons and interactive elements
- Updated both light and dark theme variants
- Buttons and links now use the new orange action color

### 5. **Auth Utilities**
- Supabase client setup (browser & server)
- Auth actions (sign up, sign in, sign out)
- useAuth hook for consuming auth state
- Auth middleware for route protection

## 🚀 Setup Instructions

### Step 1: Run Database Migrations

Execute these SQL scripts in your Supabase dashboard (SQL Editor):

```bash
# First, create the profiles table with RLS policies
-- Run: scripts/001_create_profiles.sql

# Then, create the trigger for automatic profile creation
-- Run: scripts/002_profile_trigger.sql
```

**Or use the v0 tool to execute:**

```bash
# In terminal/command line
supabase db push  # If using Supabase CLI
```

### Step 2: Set Environment Variables

Your Supabase integration should automatically set these. Verify in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Update Header Navigation

The header (`components/layout/header.tsx`) needs to be updated to show role-based menu items. It's already configured in the dashboard header.

### Step 4: Test the Flow

1. **Sign Up**: Go to `/auth/signup` and create a new account
2. **Select Role**: Choose your role (customer, salesperson, manager)
3. **Email Verification**: Check your email for the verification link
4. **Login**: Go to `/auth/login` with your credentials
5. **Dashboard**: You'll be redirected to `/dashboard`

## 👥 User Roles

### 1. **Customer**
- View products and browse catalog
- Request quotes
- View and manage own orders
- Access personal dashboard
- Limited to own data only

**Menu Items:** Products, Quotes, Orders, Dashboard

### 2. **Salesperson**
- Create and manage customer quotes
- View customer information
- Track sales performance
- Create new customers
- Access customer management

**Menu Items:** Dashboard, Products, Quotes, Orders, Customers

### 3. **Manager**
- View team performance metrics
- Approve quotes from salespersons
- Monitor all orders
- Generate reports
- Manage inventory
- Oversee team activities

**Menu Items:** Dashboard, Products, Quotes, Orders, Customers, Reports

### 4. **Admin**
- Full system access
- User management (create, edit, delete users)
- Manage all roles and permissions
- System settings and configuration
- View audit logs
- Generate comprehensive reports

**Menu Items:** Dashboard, Products, Quotes, Orders, Customers, Reports, Users, Settings

## 🔐 Security Features

### Row-Level Security (RLS)
- Users can only view their own profiles
- Admins can view all profiles
- Users can only update their own data
- Only admins can change user roles

### Authentication
- Secure password hashing via Supabase
- Email verification before account activation
- Session management with secure cookies
- Protected routes via middleware

### Protected Routes
```
/dashboard/*           - Requires authentication
/auth/*               - Public auth pages
/auth/callback        - Email verification endpoint
```

## 📁 File Structure

```
lib/
  supabase/
    client.ts         - Browser Supabase client
    server.ts         - Server Supabase client
    proxy.ts          - Session management
  auth/
    auth-actions.ts   - Server actions for auth
    use-auth.ts       - React hook for auth state

app/
  auth/
    login/page.tsx    - Login page
    signup/page.tsx   - Signup page
    error/page.tsx    - Error page
    callback/route.ts - Email verification callback
  dashboard/
    layout.tsx        - Protected dashboard layout
    page.tsx          - Role-based dashboard router
    products/         - Product management
    quotes/           - Quote management
    orders/           - Order management
    customers/        - Customer management
    reports/          - Reports (manager/admin only)
    users/            - User management (admin only)
    settings/         - Settings (admin only)

components/
  dashboard/
    dashboard-header.tsx      - Dashboard header with logout
    dashboard-sidebar.tsx     - Role-based navigation
    customer-dashboard.tsx    - Customer dashboard
    salesperson-dashboard.tsx - Salesperson dashboard
    manager-dashboard.tsx     - Manager dashboard
    admin-dashboard.tsx       - Admin dashboard
```

## 🎨 Theme Colors

The new orange color is used for:
- Primary action buttons (Sign In, Sign Up, Create Quote, etc.)
- Interactive links (Sign Up Link, Forgot Password, etc.)
- Hover states on important CTAs

**Light Mode:**
- Action: #F59E0B (Light Orange)
- Action Foreground: #ffffff (White)

**Dark Mode:**
- Action: #FBBF24 (Lighter Orange)
- Action Foreground: #1a2a1a (Dark Background)

## 🔄 Authentication Flow

```
User visits /auth/signup
    ↓
Selects role (customer/salesperson/manager)
    ↓
Fills in details (name, email, password)
    ↓
Account created with Supabase Auth
    ↓
Confirmation email sent
    ↓
User clicks email link
    ↓
Redirected to /auth/callback
    ↓
Email verified, profile created
    ↓
User can sign in at /auth/login
    ↓
Authenticated → Redirected to /dashboard
    ↓
Dashboard page loads appropriate role dashboard
```

## 🧪 Testing Users

For testing, you can create users with different roles:

1. **Test Customer:**
   - Email: customer@test.com
   - Role: customer
   - Can access: Products, Quotes, Orders, Dashboard

2. **Test Salesperson:**
   - Email: salesperson@test.com
   - Role: salesperson
   - Can access: All above + Customers

3. **Test Manager:**
   - Email: manager@test.com
   - Role: manager
   - Can access: All above + Reports

4. **Test Admin:**
   - Email: admin@test.com
   - Role: admin
   - Can access: Everything

## 🐛 Troubleshooting

### Issue: Users can't sign up
**Solution:** Check if Supabase auth is enabled and email confirmations are set up

### Issue: "Profile doesn't exist" error
**Solution:** Run the migration scripts in the Supabase SQL editor

### Issue: Menu items not showing based on role
**Solution:** Check the `ROLE_OPTIONS` in `dashboard-sidebar.tsx` and verify role permissions

### Issue: Email verification link not working
**Solution:** Ensure `NEXT_PUBLIC_APP_URL` is set to your deployed app origin and Supabase Auth allows `<NEXT_PUBLIC_APP_URL>/auth/callback` as a redirect URL

## 🚀 Next Steps

1. **Database Setup:** Execute the SQL migration scripts
2. **Test Authentication:** Try signing up and logging in
3. **Customize Dashboards:** Update the dashboard components with real data
4. **Add Features:** Build out the placeholder pages (Products, Orders, etc.)
5. **Deploy:** Deploy to Vercel when ready

## 📚 Resources

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [Row-Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## 💡 Tips

- Use the `useAuth()` hook in any client component to access user data
- Create server actions for any auth-related operations
- Always use RLS policies for database queries
- Test each role's access carefully before deploying
- Keep role names consistent across the app

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review your Supabase project settings
3. Verify all environment variables are set correctly
4. Check browser console for error messages
