import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { AlertOctagon, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "#/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Variants for the error badge container styling
 */
const errorVariants = cva(
  "max-w-md rounded-lg shadow-lg border overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white border-red-200 dark:bg-zinc-800 dark:border-red-900/50",
        subtle: "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/30",
        critical: "bg-gradient-to-br from-red-50 to-red-100 border-red-300 dark:from-red-900/30 dark:to-red-900/10 dark:border-red-800/50",
        outline: "bg-transparent border-red-300 dark:border-red-700",
      },
      size: {
        default: "p-6",
        compact: "p-4",
        spacious: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the BadgeError component
 * @param text - The error title/headline
 * @param error - The detailed error message or description
 * @param variant - The visual style variant
 * @param size - The size variant of the error badge
 * @param className - Additional CSS classes
 * @param errorCode - Optional error code to display
 * @param retryable - Whether the error can be retried
 * @param onRetry - Function to call when retry button is clicked
 * @param retryLabel - Custom label for the retry button
 * @param hideBackButton - Whether to hide the back button
 * @param traceable - Whether to show technical details section (expandable)
 * @param timestamp - When the error occurred
 */
interface BadgeErrorProps extends VariantProps<typeof errorVariants> {
  text: string
  error: string
  className?: string
  errorCode?: string | number
  retryable?: boolean
  onRetry?: () => void
  retryLabel?: string
  hideBackButton?: boolean
  traceable?: boolean
  timestamp?: string | Date
}

/**
 * BadgeError component
 * A professional, animated error badge with customizable appearance and retry functionality
 */
const BadgeError = ({
  text,
  error,
  variant,
  size,
  className,
  errorCode,
  retryable = false,
  onRetry,
  retryLabel = "Reintentar",
  hideBackButton = false,
  traceable = false,
  timestamp,
}: BadgeErrorProps) => {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  // Handle retry animation
  const handleRetry = () => {
    if (!onRetry) return

    setIsRetrying(true)
    setTimeout(() => {
      onRetry()
      setIsRetrying(false)
    }, 800)
  }

  // Format timestamp if provided
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString()
    : new Date().toLocaleString()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-6 flex items-center justify-center"
      role="alert"
      aria-live="assertive">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(errorVariants({ variant, size }), className)}
      >
        <div className="flex flex-col">
          {/* Error header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-lg md:text-xl font-semibold text-red-700 dark:text-red-400">
                  {text}
                </h2>
                {errorCode && (
                  <span className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 font-mono">
                    {typeof errorCode === 'number' ? `Error ${errorCode}` : errorCode}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                {error}
              </p>
            </div>
          </div>

          {/* Technical details (collapsible) */}
          {traceable && (
            <div className="mt-4 border-t border-red-100 dark:border-red-900/30 pt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-1"
              >
                {showDetails ? "Ocultar detalles técnicos" : "Mostrar detalles técnicos"}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/20 font-mono text-xs">
                      <div className="mb-1"><span className="text-red-500">Timestamp:</span> {formattedTime}</div>
                      <div><span className="text-red-500">Error:</span> {error}</div>
                      {errorCode && <div><span className="text-red-500">Code:</span> {errorCode}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex justify-end space-x-3">
            {!hideBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-600 dark:text-gray-300"
              >
                Volver
              </Button>
            )}
            {retryable && onRetry && (
              <Button
                variant="default"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 flex items-center gap-1"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Reintentando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{retryLabel}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BadgeError