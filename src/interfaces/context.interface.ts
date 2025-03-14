import { BaseMDB, FileReferenceDB, Paginate } from "@/interfaces/db.interface"

/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  toggleTheme: () => void
  theme: Theme
} | undefined

export type ThemeContextProps = { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------ActionConfirmContext--------------------------------------------------*/
export type DialogConfig = {
  action: () => void | Promise<void>
  isDestructive?: boolean
  description: string
  title: string
} | null

export type DialogConfirmContext = {
  show: boolean
  title: string
  description: string
  isDestructive: boolean
  setShow: (show: boolean) => void
  handleConfirm: () => Promise<void>
  confirmAction: (config: DialogConfig) => void
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------AuthContext--------------------------------------------------*/
export type AuthContext = {
  user: User
  isAuth: boolean
  loading: boolean
  signin: (data: object) => Promise<void>
  signup: (data: object) => Promise<void>
  logout: () => Promise<void>
  sendResetPassword: (email: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------UserContext--------------------------------------------------*/
interface Overwrite { create: boolean; read: boolean; update: boolean; delete: boolean }
interface Permissions { overwrite: Overwrite; headquarters: string[] }
export type UserType = 'user' | 'client' | 'company'

export type User = BaseMDB & { uid: string; role: string; phone: string; email: string; username: string; company?: Company, permissions: Permissions } | null
export type Company = BaseMDB & { name: string, nit: string, invima: string, profesionalLicense: string }
export type Client = BaseMDB & { name: string, email: string, phone: string, nit: string }

export type UserContext = {
  getAll: <T>(type: UserType) => Promise<T[]>
  getById: <T>(type: UserType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: UserType, query: object) => Promise<T[]>
  create: (type: UserType, data: object) => Promise<any>
  update: (type: UserType, id: string, data: object) => Promise<any>
  delete: (type: UserType, id: string) => Promise<any>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------LocationContext--------------------------------------------------*/
export type LocationType = 'country' | 'state' | 'city' | 'headquarter' | 'office'

export type Country = BaseMDB & { name: string }
export type State = BaseMDB & { name: string; country: Country }
export type City = BaseMDB & { name: string; state: State }
export type Headquarter = BaseMDB & { name: string; address: string; client: Client; city: City }
export type Office = BaseMDB & { name: string; group: string; services: string[]; headquarter: Headquarter }

export type LocationContext = {
  getAll: <T>(type: LocationType) => Promise<T[]>
  getById: <T>(type: LocationType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: LocationType, query: object) => Promise<T[]>
  create: (type: LocationType, data: object) => Promise<any>
  update: (type: LocationType, id: string, data: object) => Promise<any>
  delete: (type: LocationType, id: string) => Promise<any>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------FormatContext--------------------------------------------------*/
export type FormatType =
  | 'cv' | 'equipment' | 'maintenance' | 'file' //globals

  //maintenance
  | 'check' | 'checkMaintenance'
  //equipment
  | 'calibration' | 'reminder' | 'calibrationEquipment'
  //curriculum
  | 'inspection' | 'accessory'
  | 'supplier' | 'manufacturer' | 'representative'
  | 'representativeHeadquarter' | 'supplierHeadquarter' | 'manufacturerHeadquarter'

export type Inspection = BaseMDB & { name: string, typeInspection: string[], inactive: Boolean }
export type Accessory = BaseMDB & { name: string, type: string, serie: string, modelEquip: string, curriculum: Curriculum }

export type Supplier = BaseMDB & { name: string, phone: string, city: string, [key: string]: string }
export type Manufacturer = BaseMDB & { name: string, phone: string, country: string, [key: string]: string }
export type Representative = BaseMDB & { name: string, phone: string, city: string, [key: string]: string }

export type RepresentativeHeadquarter = BaseMDB & { headquarter: string, representative: Representative }
export type ManufacturerHeadquarter = BaseMDB & { headquarter: string, manufacturer: Manufacturer }
export type SupplierHeadquarter = BaseMDB & { headquarter: string, supplier: Supplier }

export type Equipment = BaseMDB & {
  dateNextMaintenance: Date
  dateLastMaintenance: Date
  curriculum: Curriculum
  status: string
}
export type Maintenance = BaseMDB & {
  //timestandard
  dateNextMaintenance?: Date
  dateMaintenance: Date
  [key: string]: any

  //maintenance
  typeMaintenance: string
  statusEquipment: string
  observations: string
  curriculum: Curriculum
}
export type Curriculum = BaseMDB & {
  //basicData
  name: string
  brand: string
  serie: string
  service: string
  codeEquip: string
  modelEquip: string
  healthRecord: string

  //complements
  characteristics: string
  recommendationsManufacturer: string

  //detailsEquipment
  datePurchase: string
  dateInstallation: string
  dateOperation: string
  acquisition: string
  warranty: string
  price: string

  //equipment
  useClassification: 'médico' | 'básico' | 'apoyo'
  typeClassification: 'fijo' | 'móvil'
  // typeClassification: 'biomédico' | 'red de frio' | 'equipo computo'
  biomedicalClassification: 'diagnóstico' | 'prevención' | 'rehabilitación' | 'red de frio' | 'análisis de laboratorio' | 'tratamiento y mantenimiento de vida'
  riskClassification: 'I' | 'IIA' | 'IIB' | 'III'
  technologyPredominant: ('mecánico' | 'eléctrico' | 'electrónico' | 'hidráulico' | 'neumático')[]
  powerSupply: ('agua' | 'aire' | 'gas' | 'vapor' | 'electricidad' | 'ninguno')[]

  //technical characteristics
  technicalCharacteristics: {
    voltage: string
    amperage: string
    power: string
    frequency: string
    capacity: string
    pressure: string
    speed: string
    humidity: string
    temperature: string
    weight: string
  }

  //maintenance
  employmentMaintenance: string
  frequencyMaintenance: string
  typeMaintenance: ('preventivo' | 'correctivo' | 'predictivo' | 'reacondicionamiento y ajuste')[]
  manualsMaintenance: ('servicio' | 'componentes' | 'usuario' | 'despiece')[]

  //relationship
  office: Office
  inspection: Inspection
  supplier: Supplier
  manufacturer: Manufacturer
  representative: Representative
}

export type FormatContext = {
  getAll: <T>(type: FormatType) => Promise<T[]>
  getById: <T>(type: FormatType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: FormatType, query: object) => Promise<T[]>
  getByPaginate: <T>(type: FormatType, query: object) => Promise<Paginate<T>>
  create: (type: FormatType, data: object) => Promise<any>
  update: (type: FormatType, id: string, data: object) => Promise<any>
  delete: (type: FormatType, id: string) => Promise<any>
  // file operations
  getAllFiles: <T>(type: FormatType, data: FileReferenceDB) => Promise<T[]>
  uploadFiles: (type: FormatType, data: FileReferenceDB) => Promise<void>
  deleteFile: (type: FormatType, data: FileReferenceDB) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/