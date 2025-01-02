import { BaseMDB } from "@/interfaces/db.interface"

/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme
  toggleTheme: () => void
} | undefined

export type ThemeContextProps = { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------ActionConfirmContext--------------------------------------------------*/
export type ActionConfig = {
  title: string
  description: string
  isDestructive: boolean
  action: () => Promise<void> | void
} | null

export type ActionConfirmContext = {
  show: boolean
  title: string
  description: string
  isDestructive: boolean
  setShow: (show: boolean) => void
  handleConfirm: () => Promise<void>
  confirmAction: (config: ActionConfig) => void
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
interface Permissions { overwrite: Overwrite; headquarters: [] }
export type UserType = 'client' | 'user'

export type User = BaseMDB & { uid: string; role: string; email: string; username: string; permissions: Permissions } | null
export type Client = BaseMDB & { name: string, email: string, phone: string, nit: string }

export type UserContext = {
  loading: boolean
  getAll: <T>(type: UserType) => Promise<T[]>
  getById: <T>(type: UserType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: UserType, query: object, populate?: string) => Promise<T[]>
  create: (type: UserType, data: object) => Promise<void>
  update: (type: UserType, id: string, data: object) => Promise<void>
  delete: (type: UserType, id: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------LocationContext--------------------------------------------------*/
export type LocationType = 'country' | 'state' | 'city' | 'headquarter'

export type Country = BaseMDB & { name: string }
export type State = BaseMDB & { name: string; country: Country }
export type City = BaseMDB & { name: string; state: State }
export type Headquarter = BaseMDB & { name: string; address: string; client: Client; city: City }

export type LocationContext = {
  loading: boolean
  getAll: <T>(type: LocationType) => Promise<T[]>
  getById: <T>(type: LocationType, id: string) => Promise<T | undefined>
  getByQuery: <T>(type: LocationType, query: object, populate?: string) => Promise<T[]>
  create: (type: LocationType, data: object) => Promise<void>
  update: (type: LocationType, id: string, data: object) => Promise<void>
  delete: (type: LocationType, id: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------CurriculumContext--------------------------------------------------*/
export type Curriculum = {
  _id: string
  name: string
  brand: string
  serie: string
  modelEquip: string
  healthRecord: string
  characteristics: string
  photoUrl: string
  recommendationsManufacturer: string

  //details
  datePurchase: Date
  dateInstallation: Date
  dateOperation: Date
  dateManufacturing: Date
  acquisition: string
  warranty: string
  price: number

  //equipment
  useClassification: string
  typeClassification: string
  biomedicalClassification: string
  riskClassification: string
  technologyPredominant: string[]
  powerSupply: string[]

  //maintenance
  employmentMaintenance: string
  frequencyMaintenance: string
  typeMaintenance: string[]
  manualsMaintenance: string

  //relationship
  serviceOffice: string
  representative: string
  manufacturer: string
  supplier: string
} | undefined

export type CurriculumContext = {
  loading: boolean
  getCV: (id: string) => Promise<Curriculum>
  getCVs: () => Promise<Curriculum[]>
  createCV: (cv: object) => Promise<Curriculum>
  updateCV: (id: string, cv: object) => Promise<Curriculum>
  deleteCV: (id: string) => Promise<Curriculum>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/