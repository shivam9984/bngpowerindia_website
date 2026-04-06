'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SERVICE_DEFINITIONS } from '@/lib/applications/config'
import { useApplications } from '@/lib/applications/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Building2,
  Factory,
  Fuel,
  Leaf,
  ListChecks,
  PlugZap,
  PlusCircle,
} from 'lucide-react'

const SERVICE_ICONS = {
  fuel_station: Fuel,
  cbg_plant: Factory,
  biodiesel: Leaf,
  ev_charging_station: PlugZap,
}

const SERVICE_IMAGES = {
  fuel_station: '/apply/fuel-station.svg',
  cbg_plant: '/apply/cbg-plant.svg',
  biodiesel: '/apply/biodiesel.svg',
  ev_charging_station: '/apply/ev-charging.svg',
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function ApplicantDashboardPage() {
  const { myApplications, loading } = useApplications()

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Applicant workspace</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Dashboard
              </h1>
            </div>
            <Button asChild className="w-full md:w-auto gap-2">
              <Link href="/dashboard/profile">
                <Building2 className="h-4 w-4" />
                Complete Profile
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <PlusCircle className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Apply for Services/Businesses</h2>
                <p className="text-sm text-muted-foreground">
                  Choose what you want to apply for. Each option opens the right form.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICE_DEFINITIONS.map((s) => {
                const Icon = SERVICE_ICONS[s.key] ?? PlusCircle
                const imgSrc = SERVICE_IMAGES[s.key]
                return (
                  <Card key={s.key} className="border-border">
                    <CardHeader className="pb-3">
                      {imgSrc ? (
                        <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
                          <Image
                            src={imgSrc}
                            alt={`${s.label} illustration`}
                            fill
                            sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                      ) : null}
                      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                        <Icon className="h-5 w-5 text-action" />
                      </div>
                      <CardTitle className="text-lg">{`Apply for ${s.label}`}</CardTitle>
                      <CardDescription>Share a few details and we’ll contact you.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-end">
                      <Button asChild className="gap-2">
                        <Link href={`/dashboard/apply/${s.slug}`}>
                          <PlusCircle className="h-4 w-4" />
                          Apply
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <div className="h-px bg-border" aria-hidden />

          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <ListChecks className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Applied Forms</h2>
                <p className="text-sm text-muted-foreground">
                  Review the key details of the forms you have already submitted.
                </p>
              </div>
            </div>

            <Card className="border-border">
              <CardContent className="relative p-0">
                <LoadingOverlay open={loading} message="Loading your applications" />
                {loading ? (
                  <div className="min-h-24" />
                ) : myApplications.length === 0 ? (
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground">
                      No applications yet. Start with one of the options above.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="[&_tr]:border-b [&_tr]:border-action/20">
                      <TableRow>
                        <TableHead className="bg-muted/40 font-semibold">Form ID</TableHead>
                        <TableHead className="bg-muted/40 font-semibold">Applied Form</TableHead>
                        <TableHead className="bg-muted/40 font-semibold">Submitted On</TableHead>
                        <TableHead className="bg-muted/40 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myApplications.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-mono text-xs">
                            {a.id ? String(a.id).slice(0, 8) : '—'}
                          </TableCell>
                          <TableCell className="max-w-[260px] truncate font-medium" title={a.serviceLabel || 'Form application'}>
                            {a.serviceLabel || 'Form application'}
                          </TableCell>
                          <TableCell>{formatDate(a.submittedAt) || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {a.status || 'submitted'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
