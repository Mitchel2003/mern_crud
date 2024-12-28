import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#/ui/collapsible"
import { NavItemProps } from "@/interfaces/props.interface"
import { useLocation } from 'react-router-dom'
import { links } from '@/utils/constants'
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
  SidebarMenu
} from "#/ui/sidebar"

export const Sidebar = () => {
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
                  <SidebarItem item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarShadcn>
  )
}

interface SidebarItemProps { item: NavItemProps }
const SidebarItem = ({ item }: SidebarItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === item.href

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton asChild isActive={isActive}>
          <a href={item.href} onClick={item.action} className='flex items-center gap-2'>
            <item.icon className='w-4 h-4 md:w-5 md:h-5' />
            <span className='text-sm pointer-events-none'>{item.label}</span>
          </a>
        </SidebarMenuButton>
      </CollapsibleTrigger>

      {item.subItems && (
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => (
              <SidebarSubItem key={subItem.label} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

interface SidebarSubItemProps { item: NavItemProps }
const SidebarSubItem = ({ item }: SidebarSubItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === item.href

  return (
    <SidebarMenuSubItem>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton asChild isActive={isActive}>
            <a href={item.href} onClick={item.action} className='flex items-center gap-2'>
              <item.icon className='w-4 h-4 md:w-5 md:h-5' />
              <span className='text-sm pointer-events-none'>{item.label}</span>
            </a>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>

        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subSubItem) => (
                <SidebarSubItem key={subSubItem.label} item={subSubItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </Collapsible>
    </SidebarMenuSubItem>
  )
}