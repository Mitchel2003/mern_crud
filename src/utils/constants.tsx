import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileStackIcon, BookUserIcon, FileTextIcon, PlusCircle, UserCircle, FilesIcon, Building2, UserPlus, UserCog2, FilePlus, Building, MapPin, LogOut, LogIn, Info, Flag, Home, Map } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { NavItemProps } from "@/types/sidebar.type"

export const links = (auth: boolean) => {
  const { logout } = useAuthContext()

  const navGuestItems: NavItemProps[] = [
    {
      href: '/',
      label: 'Home',
      icon: Home
    },
    {
      href: '/auth/login',
      label: 'Iniciar sesión',
      icon: LogIn
    },
    {
      href: '/auth/register',
      label: 'Registrarse',
      icon: UserPlus
    },
    {
      href: '/about',
      label: 'Acerca de nosotros',
      icon: Info
    }
  ]

  const navUserItems: NavItemProps[] = [
    {
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {
      label: 'Currículums',
      icon: FilesIcon,
      subItems: [
        {
          href: '/form/cvs',
          label: 'Ver todos',
          icon: FileTextIcon
        },
        {
          href: '/form/cv/new',
          label: 'Crear curriculum',
          icon: FilePlus
        }
      ]
    },
    {
      label: 'Mantenimientos',
      icon: FileTextIcon,
      subItems: [
        {
          href: '/form/maintenances',
          label: 'Ver todos',
          icon: FileTextIcon
        },
        {
          href: '/form/maintenance/new',
          label: 'Crear mantenimiento',
          icon: FilePlus
        }
      ]
    },
    {
      label: 'Usuarios',
      icon: UserCircle,
      subItems: [
        {
          label: 'Ingenieros',
          icon: UserCog2,
          subItems: [
            {
              href: '/users',
              label: 'Ver ingenieros',
              icon: BookUserIcon
            },
            {
              href: '/user/new',
              label: 'Nuevo ingeniero',
              icon: PlusCircle
            }
          ]
        },
        {
          label: 'Clientes',
          icon: Building2,
          subItems: [
            {
              href: '/clients',
              label: 'Ver clientes',
              icon: FileTextIcon
            },
            {
              href: '/client/new',
              label: 'Nuevo cliente',
              icon: PlusCircle
            }
          ]
        }
      ]
    },
    {
      label: 'Institución',
      icon: Building,
      subItems: [
        {
          label: 'Sedes',
          icon: FileStackIcon,
          subItems: [
            {
              label: 'Ver sedes',
              href: '/location/headquarters',
              icon: FileStackIcon
            },
            {
              label: 'Crear sede',
              href: '/location/headquarter/new',
              icon: PlusCircle
            }
          ]
        },
        {
          label: 'Areas',
          icon: FileStackIcon,
          subItems: [
            {
              label: 'Ver areas',
              href: '/location/areas',
              icon: FileStackIcon
            },
            {
              label: 'Crear area',
              href: '/location/area/new',
              icon: PlusCircle
            },
          ]
        },
        {
          label: 'Consultorios',
          icon: Building2,
          subItems: [
            {
              label: 'Ver consultorios',
              href: '/location/offices',
              icon: FileStackIcon
            },
            {
              label: 'Crear consultorio',
              href: '/location/office/new',
              icon: PlusCircle
            }
          ]
        },
        {
          label: 'Servicios',
          icon: LucideHandHelping,
          subItems: [
            {
              label: 'Ver servicios',
              href: '/location/services',
              icon: FileStackIcon
            },
            {
              label: 'Crear servicio',
              href: '/location/service/new',
              icon: PlusCircle
            }
          ]
        }
      ]
    },
    {
      label: 'Ubicaciones',
      icon: MapPin,
      subItems: [
        {
          label: 'Ciudades',
          icon: LocateFixedIcon,
          subItems: [
            {
              label: 'Ver ciudades',
              href: '/location/cities',
              icon: Map
            },
            {
              label: 'Crear nueva ciudad',
              href: '/location/city/new',
              icon: PlusCircle
            }
          ]
        },
        {
          label: 'Departamentos',
          icon: MapPin,
          subItems: [
            {
              label: 'Ver departamentos',
              href: '/location/departments',
              icon: FileStackIcon
            },
            {
              label: 'Crear nuevo departamento',
              href: '/location/department/new',
              icon: PlusCircle
            }
          ]
        },
        {
          label: 'Países',
          icon: Flag,
          subItems: [
            {
              label: 'Ver países',
              href: '/location/countries',
              icon: FileStackIcon
            },
            {
              label: 'Crear nuevo país',
              href: '/location/country/new',
              icon: PlusCircle
            }
          ]
        }
      ]
    },
    {
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]

  return auth ? navUserItems : navGuestItems
}