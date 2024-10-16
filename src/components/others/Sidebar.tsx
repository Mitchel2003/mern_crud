import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '#/ui/dropdown-menu'
import { SidebarItem, NavItem } from '#/others/SidebarItem'
import { ScrollArea } from '#/ui/scroll-area'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

import { Menu, ChevronLeft, ChevronRight, Home, LayoutDashboardIcon } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'

const CollapsibleSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useThemeContext()

  // const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
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
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </nav>
          </ScrollArea>
          <Button
            variant="ghost"
            className={cn(
              'absolute bottom-4 left-1/2 transform -translate-x-1/2',
              'bg-background border border-input'
            )}
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
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
    icon: <Home />,
    label: 'Inicio',
  },
  {
    href: '/dashboard',
    icon: <LayoutDashboardIcon />,
    label: 'Dashboard',
  }
]