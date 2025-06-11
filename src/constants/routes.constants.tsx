import { LocateFixedIcon, TerminalSquare, FileTextIcon, FilesIcon, UserPlus, MapPin, LogIn, Info, Flag, Home, WrenchIcon, LucideMap, GitPullRequestArrowIcon, Users, UserSquare, UserCircle2, FileClock } from 'lucide-react'
import { PermMedia, SwitchAccount, Dashboard, SupervisorAccount, Badge, WorkHistory, MoveToInbox, Devices, HomeRepairService, ManageSearch } from '@mui/icons-material'
import { NavItemProps } from '@/interfaces/props.interface'
import { RoleProps } from '@/interfaces/context.interface'
import { useAuthContext } from '@/context/AuthContext'

export type RoleAccess = Exclude<RoleProps, 'company'> | 'company:main' | 'company:sub' | undefined
/**
 * @param allowedRoles - Roles that have access to the route
 * @param isPrefix - If true, it will allow access to routes that start with this path (e.g: '/form/')
 * @param path - Route to evaluate
*/
type RoutePermission = { path: string; allowed: RoleAccess[]; isPrefix?: boolean }

/**
 * Helps us to determinate if a route is allowed for a user based on the role
 * @param currentPath - Path of the route to evaluate (e.g: '/form/curriculum')
 * @returns {RoutePermission | undefined} - RoutePermission object if found, undefined otherwise
 */
export function getRoutePermission(currentPath: string): RoutePermission | undefined {
  let exactMatch = routePermissions.find(route => route.path === currentPath)
  if (exactMatch) return exactMatch
  return routePermissions.find(route => //find by prefix
    route.isPrefix && currentPath.startsWith(route.path)
  )
}

/**
 * Configuración central de permisos por ruta
 * Cada entrada define una ruta y los roles que pueden acceder a ella
 * Las rutas más específicas deben ir primero para una correcta evaluación
 */
const routePermissions: RoutePermission[] = [
  /** ------------- FEATURES ------------- */
  {// Scanner
    path: '/scanner',
    allowed: ['company:main', 'collaborator', 'client'],
  },
  {// Calendario
    path: '/calendar',
    allowed: ['collaborator', 'client'],
  },
  /** --------------------------------- */

  /** ------------- FORMS ------------- */
  {// Curriculums (form)
    isPrefix: true,
    path: '/form/curriculum',
    allowed: ['company:main', 'company:sub', 'collaborator', 'client'],
  },
  {// Curriculums (table)
    isPrefix: true,
    path: '/form/curriculums',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator', 'client'],
  },

  {// Maintenance (form)
    isPrefix: true,
    path: '/form/maintenance',
    allowed: ['company:main', 'company:sub', 'collaborator', 'client'],
  },
  {// Maintenance (table)
    isPrefix: true,
    path: '/form/maintenances',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator', 'client'],
  },

  {// Cronograma (form)
    isPrefix: true,
    path: '/form/schedule',
    allowed: ['company:main', 'company:sub', 'collaborator', 'client'],
  },
  {// Cronograma (table)
    isPrefix: true,
    path: '/form/schedules',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator', 'client'],
  },

  {// Solicitud (form)
    isPrefix: true,
    path: '/form/solicit',
    allowed: ['admin', 'company:main', 'company:sub', 'client'],
  },
  {// Solicitud (table)
    isPrefix: true,
    path: '/form/solicits',
    allowed: ['admin', 'company:main', 'company:sub'],
  },
  /** --------------------------------- */

  /** ------------- LOCATIONS ------------- */
  {// Consultorios (form)
    isPrefix: true,
    path: '/location/office',
    allowed: ['admin', 'company:main', 'company:sub'],
  },
  {// Consultorios (table)
    isPrefix: true,
    path: '/location/offices',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator'],
  },

  {// Sedes (form)
    isPrefix: true,
    path: '/location/headquarter',
    allowed: ['admin', 'company:main', 'company:sub'],
  },
  {// Sedes (table)
    isPrefix: true,
    path: '/location/headquarters',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator'],
  },

  {// Ciudades (form)
    isPrefix: true,
    path: '/location/city',
    allowed: ['admin', 'company:main'],
  },
  {// Ciudades (table)
    isPrefix: true,
    path: '/location/cities',
    allowed: ['admin', 'company:main'],
  },

  {// Departamentos (form)
    isPrefix: true,
    path: '/location/state',
    allowed: ['admin', 'company:main'],
  },
  {// Departamentos (table)
    isPrefix: true,
    path: '/location/states',
    allowed: ['admin', 'company:main'],
  },

  {// Paises (form)
    isPrefix: true,
    path: '/location/country',
    allowed: ['admin', 'company:main'],
  },
  {// Paises (table)
    isPrefix: true,
    path: '/location/countries',
    allowed: ['admin', 'company:main'],
  },
  /** --------------------------------- */

  /** ------------- USERS ------------- */
  {// Compañia (form)
    isPrefix: true,
    path: '/company',
    allowed: ['admin', 'company:main'],
  },
  {// Compañia (table)
    isPrefix: true,
    path: '/companies',
    allowed: ['admin', 'company:main'],
  },

  {// Colaboradores (form)
    isPrefix: true,
    path: '/collaborator',
    allowed: ['admin', 'company:main', 'company:sub'],
  },
  {// Colaboradores (table)
    isPrefix: true,
    path: '/collaborators',
    allowed: ['admin', 'company:main', 'company:sub'],
  },

  {// Cliente (form)
    isPrefix: true,
    path: '/client',
    allowed: ['admin', 'company:main'],
  },
  {// Cliente (table)
    isPrefix: true,
    path: '/clients',
    allowed: ['admin', 'company:main', 'company:sub', 'collaborator'],
  }
]
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------items sidebar--------------------------------------------------*/
/**
 * Helps us define the navigation items based on the user's role
 * This items are used in the sidebar on the left (mobile and desktop)
 * @returns {NavItemProps[]} Array of objects that define the routes and their respective permissions
 */
export const links = (): NavItemProps[] => {
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
    {/** documents */
      icon: PermMedia,
      href: '/equipment',
      label: 'Mis equipos'
    }
  ]
  /*--------------------------------------------------company--------------------------------------------------*/
  const navCompanyItems: NavItemProps[] = [ /* MAIN */
    {/** dashboard **/
      icon: Dashboard,
      href: '/dashboard',
      label: 'Panel del usuario',
    },
    {/** users */
      label: 'Usuarios',
      icon: UserCircle2,
      subItems: [
        {// providers
          icon: Badge,
          href: '/companies',
          label: 'Mis contratistas',
        },
        {// collaborators
          icon: SupervisorAccount,
          label: 'Colaboradores',
          href: '/collaborators',
        },
      ]
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
    },
    {/** solicits */
      icon: MoveToInbox,
      href: '/form/solicits',
      label: 'Solicitudes',
    },
    {/** curriculums */
      icon: Devices,
      href: '/form/curriculums',
      label: 'Equipos',
    },
    {/** maintenances */
      icon: HomeRepairService,
      href: '/form/maintenances',
      label: 'Mantenimientos',
    },
    {/** maintenances history */
      icon: ManageSearch,
      href: '/form/maintenance-history',
      label: 'Historial mantenimientos',
    },
    {/** solicits history */
      icon: FileClock,
      href: '/form/solicit-history',
      label: 'Historial solicitudes',
    },
    {/** cronogramas */
      icon: WorkHistory,
      href: '/form/schedule',
      label: 'Cronogramas',
    }
  ]

  const navSubCompanyItems: NavItemProps[] = [ /* SUB */
    {/** dashboard **/
      icon: Dashboard,
      href: '/dashboard',
      label: 'Panel del usuario',
    },
    {/** users collaborators */
      icon: SupervisorAccount,
      label: 'Mis colaboradores',
      href: '/collaborators',
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
    },
    {/** solicits */
      icon: MoveToInbox,
      href: '/form/solicits',
      label: 'Solicitudes',
    },
    {/** curriculums */
      icon: Devices,
      href: '/form/curriculums',
      label: 'Equipos',
    },
    {/** maintenances */
      icon: HomeRepairService,
      href: '/form/maintenances',
      label: 'Mantenimientos',
    },
    {/** maintenances history */
      icon: ManageSearch,
      href: '/form/maintenance-history',
      label: 'Historial mantenimientos',
    },
    {/** solicits history */
      icon: FileClock,
      href: '/form/solicit-history',
      label: 'Historial solicitudes',
    },
    {/** cronogramas */
      icon: WorkHistory,
      href: '/form/schedule',
      label: 'Cronogramas',
    }
  ]
  /*--------------------------------------------------collaborator--------------------------------------------------*/
  const navCollaboratorItems: NavItemProps[] = [
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
    {/** users */
      label: 'Usuarios',
      icon: UserCircle2,
      subItems: [
        {// providers
          icon: Badge,
          label: 'Prestadores de servicio',
          href: '/companies',
        },
        {// collaborators
          icon: SupervisorAccount,
          label: 'Colaboradores',
          href: '/collaborators',
        },
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
    {/** forms **/
      icon: FilesIcon,
      label: 'Formularios',
      subItems: [
        {// curriculums
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
    {/** complementaries */
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
    user?.role === 'company' ? (user?.belongsTo ? navSubCompanyItems : navCompanyItems)
      : (user?.role === 'collaborator' ? navCollaboratorItems
        : (user?.role === 'client' ? navClientItems
          : navAdminItems))
  )
}