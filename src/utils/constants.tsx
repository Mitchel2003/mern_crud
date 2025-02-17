import { LocateFixedIcon, TerminalSquare, FileTextIcon, FilesIcon, Building2, UserPlus, MapPin, LogOut, LogIn, Info, Flag, Home, WrenchIcon, LucideMap, GitPullRequestArrowIcon, BriefcaseBusiness, Users, UserSquare, UserCircle, UserCog2Icon } from 'lucide-react'
import { MaintenanceFormProps } from '@/schemas/format/maintenance.schema'
import { CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { NavItemProps } from '@/interfaces/props.interface'
import { Curriculum } from '@/interfaces/context.interface'
import { useAuthContext } from '@/context/AuthContext'

export const formatDate: Intl.DateTimeFormatOptions = {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
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

  /*--------------------------------------------------admin--------------------------------------------------*/
  const navAdminItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      icon: TerminalSquare,
      label: 'Panel del usuario',
    },
    {// users
      label: 'Usuarios',
      icon: UserCircle,
      subItems: [
        {// proveedor of service
          icon: UserCog2Icon,
          label: 'Proveedores de servicios',
          href: '/companies',
        },
        /**{// engineers
          icon: UserPenIcon,
          label: 'Ingenieros',
          href: '/users/engineers',
        },
        {// admins
          icon: UserCog2,
          href: '/users/admins',
          label: 'Administradores',
        }*/
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
    },
    {
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]

  return !isAuth ? navGuestItems : (
    user?.role === 'admin'
      ? navAdminItems
      : (user?.role === 'medical' ? navMedicalItems : navEngineerItems)
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default format values--------------------------------------------------*/
/**
 * Valores predeterminados para el formulario de currículum
 * @type {CurriculumFormProps}
 */
export const curriculumDefaultValues: CurriculumFormProps = {
  //helpers fields not has been sent to database
  client: '', //helper locationData
  headquarter: '', //helper locationData
  office: '', //locationData
  service: '', //locationData

  preview: '', //basicData
  name: '', //basicData
  brand: '', //basicData
  serie: '', //basicData
  modelEquip: '', //basicData
  healthRecord: '', //basicData
  photoUrl: [], //basicData (create after that cv)

  characteristics: '', //characteristics
  recommendationsManufacturer: '', //characteristics

  datePurchase: null, //datailsEquipment
  dateOperation: null, //datailsEquipment
  dateInstallation: null, //datailsEquipment
  acquisition: '', //datailsEquipment
  warranty: '', //datailsEquipment
  price: '', //datailsEquipment

  //equipment
  useClassification: '', //equipmentClassification
  typeClassification: '', //equipmentClassification
  biomedicalClassification: '', //equipmentClassification
  riskClassification: '', //equipmentClassification
  technologyPredominant: [], //equipmentClassification
  powerSupply: [], //equipmentClassification

  //technical characteristics
  technicalCharacteristics: {
    voltage: '', //technicalCharacteristics
    amperage: '', //technicalCharacteristics
    power: '', //technicalCharacteristics
    frequency: '', //technicalCharacteristics
    capacity: '', //technicalCharacteristics
    pressure: '', //technicalCharacteristics
    speed: '', //technicalCharacteristics
    humidity: '', //technicalCharacteristics
    temperature: '', //technicalCharacteristics
    weight: '', //technicalCharacteristics
  },

  //maintenance
  employmentMaintenance: '', //maintenance
  frequencyMaintenance: '', //maintenance
  typeMaintenance: [], //maintenance
  manualsMaintenance: '', //maintenance

  //relationship
  inspection: '', //inspection
  supplier: '', //datailsEquipment
  manufacturer: '', //datailsEquipment
  representative: '', //datailsEquipment

  /*---------------------------------------------------------------------------------------------------------*/
  //helpers fields not has been sent to database "curriculum"
  newSupplier: [],
  newManufacturer: [],
  newRepresentative: [],

  //helpers fields not has been sent to database "inspection and accessories"
  newInspection: [],
  newAccessories: []
}
/*---------------------------------------------------------------------------------------------------------*/
/**
 * Valores predeterminados para el formulario de mantenimiento
 * @type {MaintenanceFormProps}
 */
export const maintenanceDefaultValues: MaintenanceFormProps = {
  //helpers fields not has been sent to database
  client: '', //helper clientData
  nameClient: '', //helper clientData
  nitClient: '', //helper clientData

  //timestandard
  dateNextMaintenance: null,
  dateMaintenance: null,

  //maintenance
  statusEquipment: '',
  observations: '',

  //received
  receivedBy: '',
  nameEngineer: '',
  invimaEngineer: '',

  curriculum: '',
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default location values--------------------------------------------------*/
export const countryDefaultValues = { name: '' }
export const stateDefaultValues = { name: '', country: '' }
export const cityDefaultValues = { name: '', state: '' }
export const headquarterDefaultValues = { name: '', address: '', client: '', city: '', state: '', country: '' }
export const officeDefaultValues = { name: '', group: '', headquarter: '', services: [] }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default auth values--------------------------------------------------*/
export const forgotPasswordDefaultValues = { email: '' }
export const loginDefaultValues = { email: '', password: '' }
export const clientDefaultValues = { name: '', email: '', phone: '', nit: '', preview: '', photoUrl: [] }
export const companyDefaultValues = { name: '', nit: '', invima: '', profesionalLicense: '', previewSignature: '', previewLogo: '' }
export const userDefaultValues = { username: '', email: '', role: '', password: '', headquarters: [] }
export const clientFlowDefaultValues = {
  client: { name: '', email: '', phone: '', nit: '', photoUrl: [] },
  headquarter: [{ name: '', address: '', city: '' }],
  office: [{ headquarter: '', services: [], name: '' }]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default navigation routes--------------------------------------------------*/
export const navigationTabs = [{
  value: 'clients',
  label: 'Clientes',
  icon: <Users className='h-4 w-4' />,
  paths: ['/clients', '/client', '/client/'],
  baseRoute: '/clients'
}, {
  label: 'Sedes',
  value: 'headquarters',
  icon: <Building2 className='h-4 w-4' />,
  paths: ['/location/headquarters', '/location/headquarter', '/location/headquarter/'],
  baseRoute: '/location/headquarters'
}, {
  value: 'offices',
  label: 'Consultorios',
  icon: <BriefcaseBusiness className='h-4 w-4' />,
  paths: ['/location/offices', '/location/office', '/location/office/'],
  baseRoute: '/location/offices'
}]
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------groups and services--------------------------------------------------*/
export interface ServiceGroup { name: string, services: string[] }
export const groupCollection: ServiceGroup[] = [{
  name: 'Consulta externa',
  services: [
    'Consulta externa general',
    'Consulta odontologica general',
    'Consulta odontologica especializada',
    'Consulta externa especialidades medicas',
  ]
}, {
  name: 'Apoyo diagnostico y complementación terapéutica',
  services: [
    'Radioterapia',
    'Electrodiagnostico',
    'Laboratorio clínico',
    'Toma de muestras de laboratorio clínico',
  ]
}, {
  name: 'Urgencias',
  services: [
    'Urgencias de baja complejidad',
    'Urgencias de mediana y alta complejidad'
  ]
}]

export const riskCollection: Curriculum['riskClassification'][] = [
  'I', 'IIA', 'IIB', 'III'
]
export const typeClassCollection: Curriculum['typeClassification'][] = [
  'fijo', 'móvil'
]
export const useClassCollection: Curriculum['useClassification'][] = [
  'médico', 'básico', 'apóyo'
]
export const powerSupplyCollection: Curriculum['powerSupply'] = [
  'agua', 'aire', 'gas', 'vapor', 'electricidad', 'ninguno'
]
export const technologyCollection: Curriculum['technologyPredominant'] = [
  'mecánico', 'eléctrico', 'electrónico', 'hidráulico', 'neumático'
]
export const biomedicalCollection: Curriculum['biomedicalClassification'][] = [
  'diagnóstico', 'tratamiento', 'prevención', 'rehabilitación', 'análisis de laboratorio'
]
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default style values--------------------------------------------------*/
export const defaultStyles = 'px-8 flex items-center gap-2 hover:bg-accent/50 transition-all duration-200 relative group'
export const activeStyles = 'bg-white text-black shadow-sm after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary'
/*---------------------------------------------------------------------------------------------------------*/