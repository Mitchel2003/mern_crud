import { Home, FileText, Settings, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea } from "#/ui/scroll-area"
import { Button } from "#/ui/button"

import { SidebarItem } from './SidebarItems'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  subItems?: NavItem[]
}

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <aside
      className={cn('fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'hidden md:block bg-background border-r',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Sidebar Content */}
      <ScrollArea className={cn('h-full px-3 py-4', isCollapsed ? 'w-16' : 'w-64')} >
        <nav className="space-y-2">
          {navItems.map(item => (
            <SidebarItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        className={cn('absolute -right-4 top-1/2 transform -translate-y-1/2 bg-background border border-input')}
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
  )
}

export default Sidebar


const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
  {
    icon: <FileText className="w-5 h-5" />,
    label: 'Documents',
    href: '/documents',
    subItems: [
      { icon: <FileText className="w-4 h-4" />, label: 'Reports', href: '/documents/reports' },
      { icon: <FileText className="w-4 h-4" />, label: 'Invoices', href: '/documents/invoices' },
    ]
  },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', href: '/help' },
]