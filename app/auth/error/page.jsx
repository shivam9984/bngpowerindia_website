import { Suspense } from 'react'
import AuthErrorClient from './error-client'

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorClient />
    </Suspense>
  )
}
