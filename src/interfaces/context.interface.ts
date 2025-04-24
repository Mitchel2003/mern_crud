import { LoginFormProps, UserFormProps } from "@/schemas/auth/auth.schema"
import { BaseMDB, FileReference } from "@/interfaces/db.interface"
import { QueryOptions } from "@/interfaces/props.interface"
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
export type RoleProps = 'client' | 'company' | 'engineer' | 'admin'
export type User = BaseMDB & {
  uid: string
  email: string
  username: string
  phone: string
  nit?: string
  invima?: string
  profesionalLicense?: string
  //user access
  role: RoleProps
  fcmToken?: string
  permissions?: string[]
  metadata?: Record<string, any>
}

export type AuthContext = {
  user: User | undefined
  isAuth: boolean
  loading: boolean
  logout: () => Promise<void>
  login: (data: LoginFormProps) => Promise<void>
  sendResetPassword: (email: string) => Promise<void>
  sendNotification: (data: object) => Promise<void>
  //user handlers
  getAll: <T>() => Promise<T[]>
  getById: <T>(id: string, enabled?: boolean) => Promise<T | undefined>
  getByQuery: <T>(query: QueryOptions, enabled?: boolean) => Promise<T[]>
  create: (data: UserFormProps) => Promise<any>
  update: (id: string, data: object) => Promise<any>
  delete: (id: string) => Promise<any>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------LocationContext--------------------------------------------------*/
export type LocationType = 'country' | 'state' | 'city' | 'headquarter' | 'office'

export type Country = BaseMDB & { name: string }
export type State = BaseMDB & { name: string; country: Country }
export type City = BaseMDB & { name: string; state: State }
export type Headquarter = BaseMDB & { name: string; address: string; user: User; city: City }
export type Office = BaseMDB & { name: string; group: string; services: string[]; headquarter: Headquarter }

export type LocationContext = {
  getAll: <T>(type: LocationType) => Promise<T[]>
  getById: <T>(type: LocationType, id: string, enabled?: boolean) => Promise<T | undefined>
  getByQuery: <T>(type: LocationType, query: object, enabled?: boolean) => Promise<T[]>
  create: (type: LocationType, data: object) => Promise<any>
  update: (type: LocationType, id: string, data: object) => Promise<any>
  delete: (type: LocationType, id: string) => Promise<any>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------FormatContext--------------------------------------------------*/
export type FormatType = //globals
  | 'cv' | 'maintenance' | 'solicit' | 'activity' | 'schedule' | 'file'
  //maintenance
  | 'check' | 'checkMaintenance'
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
export type Schedule = BaseMDB & {
  typeClassification: 'biomédico' | 'red de frio' | 'equipo computo'
  type: 'capacitación' | 'mantenimiento' | 'acta de asistencia'
  name: string
  url: string
  client: User
}

export type Activity = BaseMDB & {
  status: 'pendiente' | 'en proceso' | 'completado'
  dateAssignment: Date
  solicit: Solicit
  engineer: User
}
export type Solicit = BaseMDB & {
  status: 'pendiente' | 'asignado' | 'cerrado'
  photoUrl?: string
  priority: boolean
  message: string
  curriculum: Curriculum
}
export type Maintenance = BaseMDB & {
  //timestandard
  dateNextMaintenance?: Date
  dateMaintenance: Date

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
  photoUrl?: string
  metadata?: Record<string, any>

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
  equipClassification: 'fijo' | 'móvil'
  typeClassification: 'biomédico' | 'red de frio' | 'equipo computo'
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
  getById: <T>(type: FormatType, id: string, enabled?: boolean) => Promise<T | undefined>
  getByQuery: <T>(type: FormatType, query: object, enabled?: boolean) => Promise<T[]>
  create: (type: FormatType, data: object) => Promise<any>
  update: (type: FormatType, id: string, data: object) => Promise<any>
  delete: (type: FormatType, id: string) => Promise<any>
  // file operations
  getAllFiles: <T>(data: FileReference) => Promise<T[]>
  uploadFile: (data: FileReference) => Promise<any>
  deleteFile: (data: FileReference) => Promise<any>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------NotificationContext--------------------------------------------------*/
export type NotificationType = BaseMDB & {
  message: string
  isRead: boolean
  title: string
  type: string
  url?: string
}

export interface CreateNotificationProps {
  message: string
  title: string
  type: string
  url?: string
  //Relationship
  sender?: string
  recipient: string
}

export type NotificationContext = {
  createNotification: (data: CreateNotificationProps) => Promise<void>
  handleNotificationClick: (id: string, url?: string) => void
  deleteNotification: (id: string) => Promise<void>
  deleteAllNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  notifications: NotificationType[]
  unreadCount: number
  loading: boolean
  fetchNotifications: () => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/