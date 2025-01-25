import { BaseMDB, FileReferenceDB } from "@/interfaces/db.interface"

/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme
  toggleTheme: () => void
} | undefined

export type ThemeContextProps = { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------ActionConfirmContext--------------------------------------------------*/
export type DialogConfig = {
  title: string
  description: string
  isDestructive?: boolean
  action: () => Promise<void> | void
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
export type UserType = 'client' | 'user'

export type User = BaseMDB & { uid: string; role: string; email: string; username: string; permissions: Permissions } | null
export type Client = BaseMDB & { name: string, email: string, phone: string, nit: string }

export type UserContext = {
  loading: boolean
  getAll: <T>(type: UserType) => Promise<T[]>
  getById: <T>(type: UserType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: UserType, query: object) => Promise<T[]>
  create: (type: UserType, data: object) => Promise<void>
  update: (type: UserType, id: string, data: object) => Promise<void>
  delete: (type: UserType, id: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------LocationContext--------------------------------------------------*/
export type LocationType = 'country' | 'state' | 'city' | 'headquarter' | 'area' | 'office' | 'service'

export type Country = BaseMDB & { name: string }
export type State = BaseMDB & { name: string; country: Country }
export type City = BaseMDB & { name: string; state: State }
export type Headquarter = BaseMDB & { name: string; address: string; client: Client; city: City }
export type Area = BaseMDB & { name: string; headquarter: Headquarter }
export type Office = BaseMDB & { name: string; area: Area; services: string[] }
export type Service = BaseMDB & { name: string }

export type LocationContext = {
  loading: boolean
  getAll: <T>(type: LocationType) => Promise<T[]>
  getById: <T>(type: LocationType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: LocationType, query: object) => Promise<T[]>
  create: (type: LocationType, data: object) => Promise<void>
  update: (type: LocationType, id: string, data: object) => Promise<void>
  delete: (type: LocationType, id: string) => Promise<void>
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

export type Inspection = BaseMDB & { name: string, typeInspection: { name: string }[], inactive: Boolean }
export type Accessory = BaseMDB & { name: string, type: string, serie: string, modelEquip: string, curriculum: Curriculum }

export type Supplier = BaseMDB & { name: string, phone: string, city: string }
export type Manufacturer = BaseMDB & { name: string, phone: string, country: string }
export type Representative = BaseMDB & { name: string, phone: string, city: string }

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
  dateNextMaintenance: Date
  dateMaintenance: Date

  //maintenance
  typeMaintenance: string
  statusEquipment: string
  observations: string

  //references
  receivedBy: string
  nameEngineer: string
  invimaEngineer: string
  curriculum: Curriculum
}
export type Curriculum = BaseMDB & {
  //basicData
  name: string
  brand: string
  serie: string
  service: string
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
  useClassification: string
  typeClassification: string
  biomedicalClassification: string
  riskClassification: string
  technologyPredominant: string[]
  powerSupply: string[]

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
  typeMaintenance: string[]
  manualsMaintenance: string

  //relationship
  office: Office
  inspection: Inspection
  supplier: Supplier
  manufacturer: Manufacturer
  representative: Representative
}

export type FormatContext = {
  loading: boolean
  getAll: <T>(type: FormatType) => Promise<T[]>
  getById: <T>(type: FormatType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: FormatType, query: object) => Promise<T[]>
  create: (type: FormatType, data: object) => Promise<any>
  update: (type: FormatType, id: string, data: object) => Promise<any>
  delete: (type: FormatType, id: string) => Promise<any>
  // file operations
  getAllFiles: <T>(type: FormatType, data: FileReferenceDB) => Promise<T[]>
  uploadFiles: (type: FormatType, data: FileReferenceDB) => Promise<void>
  deleteFile: (type: FormatType, data: FileReferenceDB) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/