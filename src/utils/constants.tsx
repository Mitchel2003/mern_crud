import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileTextIcon, FilesIcon, Building2, UserPlus, MapPin, LogOut, LogIn, Info, Flag, Home, WrenchIcon, HomeIcon, BriefcaseIcon, DoorOpen, LucideMapPinned, LucideMap } from 'lucide-react'
import { MaintenanceFormProps } from '@/schemas/format/maintenance.schema'
import { CurriculumFormProps } from '@/schemas/format/curriculum.schema'
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
    /*{// users
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
    },*/
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
      label: 'Clientes',
      icon: Building2,
      href: '/clients',
      subItems: [
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
        {// areas
          icon: LucideMapPinned,
          label: 'Areas',
          href: '/location/areas',
        },
        {// headquarters
          label: 'Sedes',
          icon: HomeIcon,
          href: '/location/headquarters',
        },
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
  /*---------------------------------------------------------------------------------------------------------*/

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
  area: '', //helper locationData
  office: '', //locationData
  service: '', //locationData

  name: '', //basicData
  brand: '', //basicData
  serie: '', //basicData
  modelEquip: '', //basicData
  healthRecord: '', //basicData
  photoUrl: [{ file: new File([], '') }], //basicData (create after that cv)

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
export const headquarterDefaultValues = { name: '', address: '', client: '', city: '' }
export const areaDefaultValues = { name: '', headquarter: '' }
export const officeDefaultValues = { name: '', area: '', services: [] }
export const serviceDefaultValues = { name: '' }
/*---------------------------------------------------------------------------------------------------------*/