import { cva, type VariantProps } from "class-variance-authority"
import { useNavigate } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "#/ui/button"
import { cn } from "@/lib/utils"

/**
 * Variants for the warning badge container styling
 */
const warningVariants = cva(
  "max-w-md rounded-lg shadow-lg border overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white border-yellow-200 dark:bg-zinc-800 dark:border-yellow-900/50",
        subtle: "bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800/30",
        outline: "bg-transparent border-yellow-300 dark:border-yellow-700",
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
 * Props for the BadgeWarning component
 * @param title - The title to display in the warning
 * @param textContent - The descriptive text content of the warning
 * @param variant - The visual style variant
 * @param size - The size variant of the warning badge
 * @param className - Additional CSS classes
 * @param icon - Whether to show the warning icon
 * @param onActionClick - Function to call when action button is clicked
 * @param actionLabel - Label for the action button
 * @param hideBackButton - Whether to hide the back button
 */
interface BadgeWarningProps extends VariantProps<typeof warningVariants> {
  title: string
  textContent: string
  className?: string
  icon?: boolean
  onActionClick?: () => void
  actionLabel?: string
  hideBackButton?: boolean
}

/**
 * BadgeWarning component
 * A professional, animated warning badge with customizable appearance
 */
const BadgeWarning = ({
  title,
  textContent,
  variant,
  size,
  className,
  icon = true,
  onActionClick,
  actionLabel,
  hideBackButton = false,
}: BadgeWarningProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-6 flex items-center justify-center"
      role="alert"
      aria-live="polite">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(warningVariants({ variant, size }), className)}
      >
        <div className="flex flex-col">
          {/* Header with icon */}
          <div className="flex items-start gap-3 mb-4">
            {icon && (
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-yellow-700 dark:text-yellow-400">
                {title}
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                {textContent}
              </p>
            </div>
          </div>

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
            {actionLabel && onActionClick && (
              <Button
                variant="default"
                size="sm"
                onClick={onActionClick}
                className="bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BadgeWarning