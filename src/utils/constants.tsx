import { LocateFixedIcon, TerminalSquare, FileTextIcon, FilesIcon, Building2, UserPlus, MapPin, LogOut, LogIn, Info, Flag, Home, WrenchIcon, LucideMap, GitPullRequestArrowIcon, BriefcaseBusiness, Users, UserSquare, UserCircle2, UserSquare2 } from 'lucide-react'
import { MaintenanceFormProps } from '@/schemas/format/maintenance.schema'
import { CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { NavItemProps } from '@/interfaces/props.interface'
import { Curriculum } from '@/interfaces/context.interface'
import { useAuthContext } from '@/context/AuthContext'
import { StyleSheet } from '@react-pdf/renderer'

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
      icon: UserCircle2,
      subItems: [
        {// proveedor of service
          icon: UserSquare2,
          label: 'Proveedores de servicios',
          href: '/companies',
        },
        {// staff
          icon: Users,
          label: 'Personal interno',
          href: '/staff',
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
  manualsMaintenance: [], //maintenance

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
  client: { name: '', email: '', nit: '' }, //helper reference
  curriculum: '', //helper reference

  //cv (autocomplete)
  cv: {
    name: '',
    brand: '',
    serie: '',
    preview: '',
    modelEquip: '',
    healthRecord: '',
  },

  //timestandard
  dateNextMaintenance: null,
  dateMaintenance: null,
  dateTest: null,

  //maintenance
  statusEquipment: '',
  observations: '',
  photoUrl: [],

  //received
  receivedBy: '',
  nameEngineer: '',
  invimaEngineer: '',

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
export const userDefaultValues = { username: '', phone: '', role: '', email: '', password: '', company: '' }
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

/*--------------------------------------------------Statics--------------------------------------------------*/
export const defaultWarranty = [
  { label: "Ninguna", value: "n/a" },
  { label: "6 meses", value: "6 meses" },
  { label: "1 año", value: "12 meses" }
]
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

/*--------------------------------------------------styles PDF--------------------------------------------------*/
export const styles = StyleSheet.create({
  page: {
    padding: '15pt',
    fontSize: '9pt',
    fontFamily: 'Helvetica',
  },
  // Header section
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '5pt',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100pt',
    marginRight: '10pt',
  },
  logo: {
    width: '100pt',
    height: '50pt',
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    backgroundColor: '#000000',
    padding: '4pt',
    marginBottom: '2pt',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: '9pt',
    fontFamily: 'Helvetica-Bold',
  },
  // Format info section
  formatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    padding: '2pt',
    marginBottom: '5pt',
  },
  formatText: {
    fontSize: '7pt',
  },
  // Client section
  sectionTitle: {
    backgroundColor: '#000000',
    padding: '2pt 4pt',
    marginBottom: '2pt',
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid black',
    minHeight: '12pt',
    alignItems: 'center',
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2pt 4pt',
  },
  col2: { width: '50%' },
  col3: { width: '33.33%' },
  col4: { width: '25%' },
  label: {
    fontFamily: 'Helvetica-Bold',
    marginRight: '2pt',
  },
  // Equipment section
  equipmentContainer: {
    flexDirection: 'row',
    marginTop: '5pt',
  },
  equipmentInfo: {
    flex: 1,
    marginRight: '10pt',
  },
  equipmentImage: {
    width: '100pt',
    height: '100pt',
  },
  // Accessories table
  table: {
    marginTop: '5pt',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderTop: '0.5pt solid black',
    borderBottom: '0.5pt solid black',
  },
  tableCell: {
    flex: 1,
    padding: '2pt 4pt',
    borderLeft: '0.5pt solid black',
    borderRight: '0.5pt solid black',
  },
  // Technical characteristics
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techItem: {
    width: '20%',
    padding: '2pt',
  },
  // Bio classification section
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4pt',
    padding: '2pt 4pt',
  },
  tag: {
    backgroundColor: '#F3F4F6',
    padding: '2pt 4pt',
    borderRadius: '2pt',
    fontSize: '9pt',
  },
  classificationSection: {
    width: '50%',
    padding: '2pt 4pt',
    borderRight: '0.5pt solid black',
  },
  classificationRow: {
    flexDirection: 'row',
  },
  // Inspections section
  inspectionTag: {
    width: '25%',
    fontSize: '8pt',
    padding: '4pt 8pt',
    marginBottom: '4pt',
    borderRadius: '2pt',
    backgroundColor: '#F3F4F6',
    textAlign: 'left' as const,
  },
  // Characteristics section
  characteristicsContainer: {
    flexDirection: 'row',
    marginTop: '4pt',
    borderBottom: '0.5pt solid black',
  },
  characteristicsCol: {
    width: '50%',
    padding: '4pt 8pt',
  },
  descriptionText: {
    fontSize: '9pt',
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  recommendationsList: {
    marginTop: '4pt',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: '4pt',
    alignItems: 'flex-start',
  },
  recommendationNumber: {
    width: '12pt',
    fontSize: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: '9pt',
    lineHeight: 1.4,
  },
  // ServiceProvider section
  providerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottom: '2pt solid black',
    justifyContent: 'space-between',
  },
  providerInfo: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: '15pt',
    alignItems: 'center',
    paddingRight: '20pt',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '10pt',
    flexDirection: 'row',
  },
  providerLabel: {
    width: '140pt',
    fontSize: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  providerValue: {
    flex: 1,
    fontSize: '10pt',
  },
  providerLogo: {
    width: '140pt',
    height: '90pt',
    objectFit: 'contain',
  }
})