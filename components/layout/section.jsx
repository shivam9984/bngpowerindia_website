export function Section({
  children,
  className = '',
  variant = 'default',
}) {
  const bgClass = variant === 'secondary' ? 'bg-secondary' : 'bg-background'

  return (
    <section className={`${bgClass} py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
