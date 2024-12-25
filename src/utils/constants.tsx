import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileStackIcon, BookUserIcon, FileTextIcon, PlusCircle, UserCircle, FilesIcon, Building2, UserPlus, UserCog2, FilePlus, Building, MapPin, LogOut, LogIn, Info, Flag, Home, Map } from 'lucide-react'
import { NavItemProps } from "@/interfaces/props.interface"
import { useAuthContext } from '@/context/AuthContext'

export const links = () => {
  const { isAuth, user, logout } = useAuthContext()

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
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {/** cvs **/
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
    {/** maintenances **/
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
    {/** users **/
      label: 'Usuarios',
      icon: UserCircle,
      subItems: [
        {// engineers
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
        {// clients
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
    {/** institution **/
      label: 'Institución',
      icon: Building,
      subItems: [
        {// headquarters
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
        {// areas
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
        {// offices
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
        {// services
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
    {/** locations **/
      label: 'Ubicaciones',
      icon: MapPin,
      subItems: [
        {// cities
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
        {// departments
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
        {// countries
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
  /*---------------------------------------------------------------------------------------------------------*/

  return !isAuth ? navGuestItems : (
    user?.role === 'admin' ? navAdminItems : (user?.role === 'medical' ? navMedicalItems : navEngineerItems)
  )
}