'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function HomeHeroSlider() {
  const slides = useMemo(
    () => [
      {
        tag: 'Compressed Bio Gas',
        title: (
          <>
            CBG Plant <span className="text-primary">Setup &amp; Operations</span>
          </>
        ),
        description:
          "End-to-end CBG plant commissioning under India’s SATAT scheme. Sustainable biogas from agri-waste, cattle dung & press mud.",
        ctaLabel: 'Explore CBG Solutions',
        ctaHref: '/business/cbg-plant',
        image: '/home/cbg_image.png',
        imageAlt: 'CBG plant infrastructure',
        imageClassName: 'scale-105 object-center',
      },
      {
        tag: 'Biodiesel',
        title: (
          <>
            Bio Diesel Plant <span className="text-primary">Design &amp; Supply</span>
          </>
        ),
        description:
          "Complete biodiesel production facilities from feedstock to finished B100. Helping meet India’s blending mandates with clean technology.",
        ctaLabel: 'Explore Biodiesel Solutions',
        ctaHref: '/business/biodiesel',
        image: '/home/bio_diesel_plant.png',
        imageAlt: 'Biodiesel plant infrastructure',
        imageClassName: 'scale-105 object-center',
      },
      {
        tag: 'Fuel Retail',
        title: (
          <>
            Fuel Station <span className="text-primary">Dealership Facilitation</span>
          </>
        ),
        description:
          'Site selection, NOC, documentation, layout design, and commissioning support with OMC liaison for a smoother rollout.',
        ctaLabel: 'Explore Dealership Services',
        ctaHref: '/business/fuel-station',
        image: '/home/fuel_station.png',
        imageAlt: 'Fuel station infrastructure',
        imageClassName: 'scale-110 object-center',
      },
      {
        tag: 'E-Mobility',
        title: (
          <>
            EV Charging <span className="text-primary">Station Installation</span>
          </>
        ),
        description:
          'Commercial charging infrastructure planning and installation support for campuses, fleet depots, retail forecourts, and public access locations.',
        ctaLabel: 'Explore EV Charging Solutions',
        ctaHref: '/business/ev-charging-station',
        image: '/apply/ev-charging.svg',
        imageAlt: 'EV charging station illustration',
        imageMode: 'feature',
        imageClassName: 'object-contain scale-100',
      },
    ],
    [],
  )

  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)
  const isPausedRef = useRef(false)

  const goTo = (index) => {
    setActiveSlide((prev) => {
      const next = (index + slides.length) % slides.length
      return next === prev ? prev : next
    })
  }

  const next = () => goTo(activeSlide + 1)
  const prev = () => goTo(activeSlide - 1)

  useEffect(() => {
    const mq =
      typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-reduced-motion: reduce)')
        : null
    const reducedMotion = !!mq?.matches
    if (reducedMotion) return undefined

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return
      setActiveSlide((slideIndex) => (slideIndex + 1) % slides.length)
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length])

  return (
    <section>
      <div
        className="relative min-h-[28rem] w-full overflow-hidden bg-secondary md:min-h-[34rem]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero slider"
        tabIndex={0}
        onMouseEnter={() => {
          isPausedRef.current = true
        }}
        onMouseLeave={() => {
          isPausedRef.current = false
        }}
        onFocus={() => {
          isPausedRef.current = true
        }}
        onBlur={() => {
          isPausedRef.current = false
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') next()
          if (event.key === 'ArrowLeft') prev()
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeSlide
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
            >
              {slide.imageMode === 'feature' ? (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(16,185,129,0.18),transparent_22%),linear-gradient(120deg,rgba(4,18,17,0.96)_0%,rgba(7,31,24,0.92)_45%,rgba(8,48,40,0.78)_100%)]" />
                  <div className="absolute inset-y-0 right-0 hidden w-[52%] items-center justify-center p-10 md:flex">
                    <div className="relative h-full w-full">
                      <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      className={`${slide.imageClassName || 'object-contain'} drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)]`}
                      sizes="40vw"
                      priority={index === 0}
                    />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    className={`object-cover brightness-[0.58] contrast-110 saturate-[0.82] transition-transform duration-700 ${slide.imageClassName || ''}`}
                    sizes="100vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_22%),linear-gradient(90deg,rgba(3,10,10,0.94)_0%,rgba(7,17,16,0.82)_42%,rgba(7,17,16,0.42)_68%,rgba(7,17,16,0.7)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.02)_22%,rgba(0,0,0,0.28)_100%)]" />
                  <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_left_center,rgba(0,0,0,0.24),transparent_44%)]" />
                </>
              )}

              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
                  <div className={slide.imageMode === 'feature' ? 'max-w-2xl lg:max-w-[48%]' : 'max-w-2xl'}>
                    <div className="rounded-[2rem] border border-white/10 bg-black/12 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.18)] backdrop-blur-[3px] md:p-8">
                      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
                        {slide.tag}
                      </p>
                      <h1 className="mb-5 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap gap-3 sm:flex-row">
                        <Link href={slide.ctaHref}>
                          <Button className="w-full bg-action px-8 py-3 text-lg text-action-foreground shadow-sm hover:bg-action/90 sm:w-auto">
                            {slide.ctaLabel}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm transition hover:bg-card"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm transition hover:bg-card"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeSlide ? 'bg-action' : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
              />
            ))}
            <span className="ml-2 text-xs font-semibold tabular-nums text-muted-foreground">
              {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
