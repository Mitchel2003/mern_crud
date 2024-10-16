import { Menu, ChevronLeft, ChevronRight, Home, FileText, Settings, HelpCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '#/ui/dropdown-menu'
import { SidebarItem, NavItem } from '#/others/SidebarItem'
import { ScrollArea } from '#/ui/scroll-area'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'

import { useThemeContext } from '@/context/ThemeContext'
import { useState } from 'react'

const CollapsibleSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useThemeContext()

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'absolute p-0 mt-2 w-64 right-[calc(100vh-665px)] h-[calc(100vh-4rem)]',
          isCollapsed && 'w-16'
        )}
      >
        <aside
          className={cn(
            'h-full transition-all',
            'bg-background border-l duration-300 ease-in-out',
            theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'
          )}
        >
          <ScrollArea className="h-full px-3 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem
                  isCollapsed={isCollapsed}
                  key={item.href}
                  item={item}
                />
              ))}
            </nav>
          </ScrollArea>

          <Button
            variant="ghost"
            className={cn(
              'hidden md:block absolute bottom-4 transform',
              'bg-background border border-input',
              'left-1/2 -translate-x-1/2'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed
              ? (<ChevronLeft className="h-4 w-4" />)
              : (<ChevronRight className="h-4 w-4" />)
            }
          </Button>

        </aside>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CollapsibleSidebar

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="w-5 h-5" />
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: <FileText className="w-5 h-5" />,
    subItems: [
      { icon: <FileText className="w-4 h-4" />, label: 'Reports', href: '/documents/reports' },
      { icon: <FileText className="w-4 h-4" />, label: 'Invoices', href: '/documents/invoices' },
    ]
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />
  },
  {
    href: '/help',
    label: 'Help',
    icon: <HelpCircle className="w-5 h-5" />
  }
]