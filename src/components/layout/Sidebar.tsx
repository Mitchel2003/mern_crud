import { Sidebar as SidebarShadcn, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "#/ui/sidebar"
import { Home, Info, LogIn, UserPlus } from 'lucide-react'
import { useLocation } from 'react-router-dom'

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Iniciar sesión",
    url: "/auth/login",
    icon: LogIn,
  },
  {
    title: "Registrarse",
    url: "/auth/register",
    icon: UserPlus,
  },
  {
    title: "Sobre nosotros",
    url: "/about",
    icon: Info,
  }
]

export const Sidebar = () => {
  const location = useLocation()

  return (
    <SidebarShadcn>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarShadcn>
  )
}