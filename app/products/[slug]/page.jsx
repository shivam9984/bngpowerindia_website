import { redirect } from 'next/navigation'

export default async function ProductRedirectDetailPage({ params }) {
  const resolvedParams = await params
  const slug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug

  redirect(`/business/${slug}`)
}
