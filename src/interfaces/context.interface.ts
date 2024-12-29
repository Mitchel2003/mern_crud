/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme
  toggleTheme: () => void
} | undefined

export type ThemeContextProps = { theme: Theme }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------SidebarContext--------------------------------------------------*/
export type SidebarContext = {
  setOpenMobile: (open: boolean) => void
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  openMobile: boolean
  isMobile: boolean
  open: boolean
  state: "expanded" | "collapsed"
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------AuthContext--------------------------------------------------*/
interface Overwrite { create: boolean; read: boolean; update: boolean; delete: boolean }
interface Permissions { overwrite: Overwrite; headquarters: [] }
export type UserCredentials = {
  uid: string
  _id: string
  role: string
  email: string
  username: string
  permissions: Permissions

  //timestamps
  updatedAt: Date
  createdAt: Date
} | null

export type AuthContext = {
  user: UserCredentials
  isAuth: boolean
  loading: boolean
  signin: (data: object) => Promise<void>
  signup: (data: object) => Promise<void>
  logout: () => Promise<void>
  sendResetPassword: (email: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------UserContext--------------------------------------------------*/
export type UserType = 'client' | 'user'
export type BaseUser = {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type User = BaseUser & {}
export type Client = BaseUser & { name: string, address: string }

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

/*--------------------------------------------------LocationContext--------------------------------------------------*/
export type LocationType = 'country' | 'state' | 'city' | 'headquarter'
export type BaseLocation = {
  _id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Country = BaseLocation & { name: string }
export type State = BaseLocation & { name: string; country: string }
export type City = BaseLocation & { name: string; state: string }
export type Headquarter = BaseLocation & { name: string; address: string; client: string; city: string }

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