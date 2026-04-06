import SignupSuccessClient from './signup-success-client'

export default async function SignupSuccessPage({ searchParams }) {
  const email = typeof searchParams?.email === 'string' ? searchParams.email : ''
  return <SignupSuccessClient email={email} />
}

