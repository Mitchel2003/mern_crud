import { AlertCircle, AlertOctagon, AlertTriangle, CircleHelpIcon, Info } from "lucide-react"
import { Curriculum } from "@/interfaces/context.interface"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * This function is used to process a file, specifically a base64 string.
 * also works to convert a blob to base64
 * @param data - The file to process.
 * @returns {string} A promise that resolves to a base64 string.
 */
export const processFile = (data: File): Promise<string> => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string).split(',')[1])
    reader.readAsDataURL(data)
  })
}

/**
 * This function is used to copy a string to the clipboard.
 * @param text Text to copy.
 */
export const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text) }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------data-table-advanced--------------------------------------------------*/
export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", {
    year: opts.year ?? "numeric",
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

/** @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  const handleEvent = (event: E) => {
    originalEventHandler?.(event)
    if (checkForDefaultPrevented === false || !(event as unknown as Event).defaultPrevented) {
      ourEventHandler?.(event)
    }
  }
  return handleEvent
}

/**
 * Returns the appropriate risk icon based on the provided risk.
 * @param risk - The status from curriculum.
 * @returns A React component representing the risk icon.
 */
export function getRiskIcon(risk: Curriculum['riskClassification']) {
  const risksIcons = {
    I: AlertOctagon,
    IIA: AlertTriangle,
    IIB: AlertCircle,
    III: Info
  }
  return risksIcons[risk] || CircleHelpIcon
}