import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#/ui/collapsible"
import { useNotificationContext } from "@/context/NotificationContext"
import { NavItemProps } from "@/interfaces/props.interface"
import { Link, useLocation } from 'react-router-dom'
import { links } from '@/constants/routes.constants'
import { useIsMobile } from '@/hooks/ui/use-mobile'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import {
  Sidebar as SidebarShadcn,
  SidebarMenuSubButton,
  SidebarGroupContent,
  SidebarMenuSubItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  useSidebar
} from "#/ui/sidebar"

export const Sidebar = () => {
  const { getNotificationCount } = useNotificationContext()
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const items = links()
  return (
    <SidebarShadcn>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='py-5 text-lg font-bold font-roboto-slab'>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarItem item={item} isMobile={isMobile} toggle={toggleSidebar} getCount={getNotificationCount} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarShadcn>
  )
}

interface SidebarItemProps { item: NavItemProps, isMobile: boolean, toggle: () => void, getCount: (path: string) => number }
const SidebarItem = ({ item, isMobile, toggle, getCount }: SidebarItemProps) => {
  const isActive = useLocation().pathname === item.href
  const [isOpen, setIsOpen] = React.useState(false)
  const count = getCount(getUrlPattern(item.href))
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} onClick={() => isMobile && !item.subItems && toggle()}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link
            to={item.href as string}
            onClick={() => item.action?.()}
            className='flex w-full items-center gap-2'
          >
            <div><item.icon className='relative w-4 h-4 md:w-5 md:h-5' /></div>
            <span className='text-sm pointer-events-none'>{item.label}</span>
            {item.subItems && (<IconChevron isOpen={isOpen} />)}
            {count > 0 && <AlertBadge count={count} {...item} />}
          </Link>
        </SidebarMenuButton>
      </CollapsibleTrigger>

      {item.subItems && (
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => (
              <SidebarSubItem
                item={subItem}
                toggle={toggle}
                key={subItem.label}
                isMobile={isMobile}
                getCount={getCount}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

interface SidebarSubItemProps { item: NavItemProps, isMobile: boolean, toggle: () => void, getCount: (path: string) => number }
const SidebarSubItem = ({ item, isMobile, toggle, getCount }: SidebarSubItemProps) => {
  const isActive = useLocation().pathname === item.href
  const [isOpen, setIsOpen] = React.useState(false)
  const count = getCount(getUrlPattern(item.href))
  return (
    <SidebarMenuSubItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} onClick={() => isMobile && !item.subItems && toggle()}>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton asChild isActive={isActive}>
            <Link
              to={item.href as string}
              onClick={() => item.action?.()}
              className='flex w-full items-center gap-2'
            >
              <div><item.icon className='relative w-4 h-4 md:w-5 md:h-5' /></div>
              <span className='text-sm pointer-events-none'>{item.label}</span>
              {item.subItems && (<IconChevron isOpen={isOpen} />)}
              {count > 0 && <AlertBadge count={count} {...item} />}
            </Link>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>

        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subSubItem) => (
                <SidebarSubItem
                  toggle={toggle}
                  item={subSubItem}
                  isMobile={isMobile}
                  getCount={getCount}
                  key={subSubItem.label}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </Collapsible>
    </SidebarMenuSubItem>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const IconChevron = ({ isOpen }: { isOpen: boolean }) => <ChevronDown className={`w-4 h-4 ms-auto transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
/**
 * Componente para el badge de notificaciones
 * @param {number} count - Cantidad de notificaciones
 * @returns {JSX.Element | null} Elemento JSX con el badge o null si no hay notificaciones
 */
const AlertBadge = ({ count, href }: { count: number, href?: string }): JSX.Element | null => {
  if (count <= 0) return null
  return (
    <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
      {href ? (count > 99 ? '99+' : count) : "Nuevo"}
    </span>
  )
}
/**
 * Obtiene el patrón de URL que representa el contexto del item
 * Esto con el fin de identificar las notificaciones asociadas
 * @example
 * ('/auth/users') => 'users' (subject of notification)
 * @param href - URL de la ruta, contiene el contexto
 * @returns {string} - Patrón de URL
 */
const getUrlPattern = (href: string | undefined): string => {
  if (!href) return ''
  const path = href.toString()
  const parts = path.split('/')
  return parts[parts.length - 1]
}