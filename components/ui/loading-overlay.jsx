import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

function LoadingOverlay({
  open = false,
  message = 'Loading...',
  variant = 'container',
  className,
  containerClassName,
}) {
  if (!open) return null

  const overlayClassName =
    variant === 'page'
      ? 'fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm print:hidden'
      : 'absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm print:hidden'

  return (
    <div
      className={cn(
        overlayClassName,
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-5 text-center shadow-lg',
          containerClassName,
        )}
      >
        <Spinner className="size-6" />
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  )
}

export { LoadingOverlay }
