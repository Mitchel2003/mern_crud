import { type LucideIcon } from 'lucide-react'

export interface SidebarLink {
  label: string
  href: string
  icon: LucideIcon
}

export interface SidebarProps {
  links: SidebarLink[]
  logo: React.ReactNode
  logoIcon: React.ReactNode
  userAvatar: string
  userName: string
}