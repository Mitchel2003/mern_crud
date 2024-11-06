import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '#/ui/dropdown-menu'
import { Menu, ChevronLeft, ChevronRight, Home, FileText, LogIn } from 'lucide-react'
import { ScrollArea } from '#/ui/scroll-area'
import SidebarItem from '#/sidebar/Items'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'

import { NavItemProps } from '@/interfaces/props.interface'
import { useThemeContext } from '@/context/ThemeContext'
import { useState } from 'react'

const Sidebar = () => {
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
          size="icon"
          variant="ghost"
          className={cn(
            '[&_svg]:size-6',
            'h-9 w-9 md:h-10 md:w-10',
            'transition-colors duration-300',
            theme === 'dark'
              ? ' hover:bg-zinc-700/40 border-zinc-700'
              : ' hover:bg-gray-200/40 border-gray-200'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-10 w-10 md:h-12 md:w-12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'absolute p-0 w-64',
          'h-[calc(100vh-4rem)] right-[calc(100vh-705px)]',
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

export default Sidebar

const navItems: NavItemProps[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="w-5 h-5" />
  },
  {
    href: '/login',
    label: 'Iniciar sesión',
    icon: <LogIn className="w-5 h-5" />
  },
  {
    href: '/register',
    label: 'Curriculum',
    icon: <FileText className="w-5 h-5" />
  }
]