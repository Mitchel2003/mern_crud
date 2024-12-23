import { Sidebar as SidebarShadcn, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "#/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#/ui/collapsible"
import { useLocation } from 'react-router-dom'
import { links } from '@/utils/constants'

export const Sidebar = () => {
  const location = useLocation()
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
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={location.pathname === item.href}>
                        <a
                          href={item.href}
                          onClick={item.action}
                          className='flex items-center gap-2'
                        >
                          <item.icon className='w-4 h-4 md:w-5 md:h-5' />
                          <span className='text-sm pointer-events-none'>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.subItems && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.label}>
                              <SidebarMenuSubButton asChild isActive={location.pathname === subItem.href}>
                                <a
                                  href={subItem.href}
                                  onClick={subItem.action}
                                >
                                  <subItem.icon className='w-4 h-4 md:w-5 md:h-5' />
                                  <span className='text-sm pointer-events-none'>{subItem.label}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarShadcn>
  )
}