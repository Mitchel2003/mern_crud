import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileStackIcon, FileTextIcon, UserCircle, FilesIcon, Building2, UserPlus, UserCog2, Building, MapPin, LogOut, LogIn, Info, Flag, Home, WrenchIcon } from 'lucide-react'
import { NavItemProps } from "@/interfaces/props.interface"
import { useAuthContext } from '@/context/AuthContext'

export const links = () => {
  const { isAuth, logout, user } = useAuthContext()

  /*--------------------------------------------------guest--------------------------------------------------*/
  const navGuestItems: NavItemProps[] = [
    {/** home **/
      href: '/',
      label: 'Home',
      icon: Home
    },
    {/** login **/
      href: '/auth/login',
      label: 'Iniciar sesión',
      icon: LogIn
    },
    {/** register **/
      href: '/auth/register',
      label: 'Registrarse',
      icon: UserPlus
    },
    {/** about **/
      href: '/about',
      label: 'Acerca de nosotros',
      icon: Info
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------engineer--------------------------------------------------*/
  const navEngineerItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {/** logout **/
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------medical--------------------------------------------------*/
  const navMedicalItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {/** logout **/
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------admin--------------------------------------------------*/
  const navAdminItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      icon: TerminalSquare,
      label: 'Panel del usuario',
    },
    {/** forms **/
      icon: FilesIcon,
      label: 'Formularios',
      subItems: [
        {// cvs
          icon: FileTextIcon,
          href: '/form/cvs',
          label: 'Currículums',
        },
        {// maintenances
          icon: WrenchIcon,
          href: '/form/maintenances',
          label: 'Mantenimientos',
        }
      ]
    },
    {/** users **/
      label: 'Usuarios',
      icon: UserCircle,
      subItems: [
        {// engineers
          icon: UserCog2,
          label: 'Ingenieros',
          href: '/users/engineers',
        },
        {// clients
          icon: Building2,
          label: 'Clientes',
          href: '/users/clients',
        }
      ]
    },
    {/** institution **/
      label: 'Institución',
      icon: Building,
      subItems: [
        {// headquarters
          label: 'Sedes',
          icon: FileStackIcon,
          href: '/location/headquarters',
        },
        {// areas
          label: 'Areas',
          icon: FileStackIcon,
          href: '/location/areas',
        },
        {// offices
          icon: Building2,
          label: 'Consultorios',
          href: '/location/offices',
        },
        {// services
          label: 'Servicios',
          icon: LucideHandHelping,
          href: '/location/services',
        }
      ]
    },
    {/** locations **/
      label: 'Ubicaciones',
      icon: MapPin,
      subItems: [
        {// cities
          label: 'Ciudades',
          icon: LocateFixedIcon,
          href: '/location/cities',
        },
        {// departments
          icon: MapPin,
          label: 'Departamentos',
          href: '/location/departments',
        },
        {// countries
          icon: Flag,
          label: 'Países',
          href: '/location/countries',
        }
      ]
    },
    {
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  return !isAuth ? navGuestItems : (
    user?.role === 'admin' ? navAdminItems : (user?.role === 'medical' ? navMedicalItems : navEngineerItems)
  )
}