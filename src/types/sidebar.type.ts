import { type LucideIcon } from 'lucide-react'

export interface NavItemProps {
  action?: () => void | Promise<void>
  subItems?: NavItemProps[]
  icon: LucideIcon
  label: string
  href?: string
}