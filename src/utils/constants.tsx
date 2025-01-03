import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileTextIcon, UserCircle, FilesIcon, Building2, UserPlus, UserCog2, Building, MapPin, LogOut, LogIn, Info, Flag, Home, WrenchIcon, UserPenIcon, HomeIcon, BriefcaseIcon, DoorOpen } from 'lucide-react'
import { NavItemProps } from '@/interfaces/props.interface'
import { useAuthContext } from '@/context/AuthContext'

export const formatDate: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}

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
        {// medicals
          icon: UserCircle,
          label: 'Médicos',
          href: '/users/medicals',
        },
        {// engineers
          icon: UserPenIcon,
          label: 'Ingenieros',
          href: '/users/engineers',
        },
        {// admins
          icon: UserCog2,
          href: '/users/admins',
          label: 'Administradores',
        }
      ]
    },
    {/** institution **/
      label: 'Institución',
      icon: Building2,
      subItems: [
        {// clients
          icon: Building,
          label: 'Clientes',
          href: '/clients',
        },
        {// headquarters
          label: 'Sedes',
          icon: HomeIcon,
          href: '/location/headquarters',
        },
        {// areas
          icon: MapPin,
          label: 'Areas',
          href: '/location/areas',
        },
        {// offices
          label: 'Oficinas',
          icon: BriefcaseIcon,
          subItems: [
            {// services
              label: 'Servicios',
              icon: LucideHandHelping,
              href: '/location/services',
            },
            {// consultories
              icon: DoorOpen,
              label: 'Consultorios',
              href: '/location/offices',
            }
          ]
        },
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
          href: '/location/states',
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
    user?.role === 'admin'
      ? navAdminItems
      : (user?.role === 'medical' ? navMedicalItems : navEngineerItems)
  )
}