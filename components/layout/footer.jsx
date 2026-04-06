import Image from 'next/image'
import Link from 'next/link'

const businessLinks = [
  { label: 'CBG Plant Setup', href: '/business/cbg-plant' },
  { label: 'Biodiesel Plant Setup', href: '/business/biodiesel' },
  { label: 'Retail Fuel Station', href: '/business/fuel-station' },
  { label: 'EV Charging Infrastructure', href: '/business/ev-charging-station' },
]

const companyLinks = [
  { label: 'Home', href: '/' },
  { label: 'Businesses', href: '/business' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Quote Request', href: '/quote' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 w-full bg-primary text-primary-foreground print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary-foreground">
                <Image
                  src="/bng-logo.png"
                  alt="BNGPowerIndia logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div>
                <p className="text-xl font-bold">BNGPowerIndia Pvt Ltd</p>
                <p className="text-sm text-primary-foreground/80">
                  Green energy, clean fuel, and future-ready infrastructure
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/90">
              We support CBG, biodiesel, retail fuel station, and EV charging businesses with practical planning,
              project coordination, commissioning support, and execution-focused guidance for long-term growth.
            </p>

            <div className="mt-6 space-y-2 text-sm text-primary-foreground/90">
              <p>A2 1004 Parijat Building, Near Awadh Bus Station,</p>
              <p>Lucknow UP, 226016 India</p>
              <a className="block hover:text-white" href="tel:+919151141423">
                +91 9151141423
              </a>
              <a
                className="block hover:text-white"
                href="mailto:info@bngpowerindia.com"
                suppressHydrationWarning
              >
                info@bngpowerindia.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-foreground/90 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Businesses We Provide</h3>
            <ul className="space-y-3 text-sm">
              {businessLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-foreground/90 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-primary-foreground/90 transition-colors hover:text-white">
                  Project Services & Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company Information</h3>
            <div className="space-y-3 text-sm text-primary-foreground/90">
              <p>
                <span className="font-semibold text-white">CIN:</span> U35200UP2026PTC244211
              </p>
              <p>
                <span className="font-semibold text-white">PAN:</span> AAOCB4444L
              </p>
              <p>
                <span className="font-semibold text-white">TAN:</span> LKNB13437E
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <Link href="/contact" className="block text-primary-foreground/90 transition-colors hover:text-white">
                Contact for project discussion
              </Link>
              <Link href="/quote" className="block text-primary-foreground/90 transition-colors hover:text-white">
                Submit an enquiry
              </Link>
              <a
                href="https://wa.me/919151141423"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-foreground/90 transition-colors hover:text-white"
              >
                WhatsApp support
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20" />

        <div className="flex flex-col gap-3 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-primary-foreground/85">
            &copy; {currentYear} BNGPowerIndia Pvt Ltd. All rights reserved.
          </p>
          <p className="text-primary-foreground/75">
            CBG, biodiesel, retail fuel station, and EV charging solutions from Lucknow, Uttar Pradesh.
          </p>
        </div>
      </div>
    </footer>
  )
}
