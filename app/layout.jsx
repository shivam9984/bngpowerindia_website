import { Analytics } from '@vercel/analytics/next'
import { AppShell } from '@/components/layout/app-shell'
import { getAppUrl } from '@/lib/supabase/env'
import { Providers } from './providers'
import './globals.css'

const siteUrl = getAppUrl()

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BNGPowerIndia Pvt Ltd | CBG • Biodiesel • Fuel Station',
  description:
    'BNGPowerIndia delivers turnkey CBG, biodiesel and fuel-station dealership solutions — feasibility, DPR, commissioning and long-term operations support.',
  keywords: [
    'CBG',
    'compressed biogas',
    'biodiesel',
    'fuel station',
    'SATAT',
    'renewable fuels',
    'Uttar Pradesh',
  ],
  authors: [{ name: 'BNGPowerIndia Pvt Ltd' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'BNGPowerIndia Pvt Ltd',
    description: 'Turnkey CBG, biodiesel and fuel retail solutions',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1f4d2a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
