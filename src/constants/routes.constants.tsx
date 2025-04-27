import { LocateFixedIcon, TerminalSquare, FileTextIcon, FilesIcon, UserPlus, MapPin, LogIn, Info, Flag, Home, WrenchIcon, LucideMap, GitPullRequestArrowIcon, Users, UserSquare, UserCircle2 } from 'lucide-react'
import { AssignmentInd, PermMedia, SwitchAccount, Dashboard, SupervisorAccount, Badge, WorkHistory, MoveToInbox, Devices, HomeRepairService } from '@mui/icons-material'
import { NavItemProps } from '@/interfaces/props.interface'
import { useAuthContext } from '@/context/AuthContext'

export const links = () => {
  const { isAuth, user } = useAuthContext()
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
    {/** about **/
      href: '/about',
      label: 'Acerca de nosotros',
      icon: Info
    }
  ]
  /*--------------------------------------------------client--------------------------------------------------*/
  const navClientItems: NavItemProps[] = [
    {/** dashboard **/
      label: 'Panel',
      href: '/dashboard',
      icon: TerminalSquare
    },
    {// documents
      href: '/form',
      icon: PermMedia,
      label: 'Documentación'
    }
  ]
  /*--------------------------------------------------company--------------------------------------------------*/
  const navCompanyItems: NavItemProps[] = [
    {/** dashboard **/
      icon: Dashboard,
      href: '/dashboard',
      label: 'Panel del usuario',
    },
    {// users
      href: '/engineer',
      icon: AssignmentInd,
      label: 'Usuarios de servicio',
    },
    {// solicits
      icon: MoveToInbox,
      href: '/form/solicit',
      label: 'Solicitudes',
    },
    {// cronogramas
      icon: WorkHistory,
      href: '/form/schedule',
      label: 'Cronogramas',
    },
    {// curriculums
      icon: Devices,
      href: '/form/curriculums',
      label: 'Equipos',
    },
    {// maintenances
      icon: HomeRepairService,
      href: '/form/maintenances',
      label: 'Mantenimientos',
    },
    {/** institution **/
      label: 'Gestion de clientes',
      icon: SwitchAccount,
      href: '/clients',
      subItems: [
        {// new client
          icon: UserPlus,
          href: '/newClient',
          label: 'Nuevo',
        },
        {// management clients
          icon: Users,
          href: '/clients',
          label: 'Clientes',
        }
      ]
    }
  ]
  /*--------------------------------------------------engineer--------------------------------------------------*/
  const navEngineerItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    }
  ]
  /*--------------------------------------------------admin--------------------------------------------------*/
  const navAdminItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      icon: TerminalSquare,
      label: 'Panel del usuario',
    },
    {// users
      label: 'Usuarios',
      icon: UserCircle2,
      subItems: [
        {// proveedor of service
          icon: Badge,
          label: 'Proveedores',
          href: '/companies',
        },
        {// engineer
          icon: SupervisorAccount,
          label: 'Ingenieros',
          href: '/engineer',
        },
      ]
    },
    {/** forms **/
      icon: FilesIcon,
      label: 'Formularios',
      subItems: [
        {// cvs
          icon: FileTextIcon,
          href: '/form/curriculums',
          label: 'Currículums',
        },
        {// maintenances
          icon: WrenchIcon,
          href: '/form/maintenances',
          label: 'Mantenimientos',
        }
      ]
    },
    {/** institution **/
      label: 'Gestion de clientes',
      icon: UserSquare,
      href: '/clients',
      subItems: [
        {// new client
          icon: UserPlus,
          href: '/newClient',
          label: 'Nuevo',
        },
        {// management clients
          icon: Users,
          href: '/clients',
          label: 'Clientes',
        }
      ]
    },
    {// complementaries
      label: 'Complementarios',
      icon: GitPullRequestArrowIcon,
      subItems: [
        {/** locations **/
          label: 'Ubicaciones',
          icon: LucideMap,
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
        }
      ]
    }
  ]

  return !isAuth ? navGuestItems : (
    user?.role === 'engineer' ? navEngineerItems
      : (user?.role === 'client' ? navClientItems
        : (user?.role === 'company' ? navCompanyItems
          : navAdminItems))
  )
}