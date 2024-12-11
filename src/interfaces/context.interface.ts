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
  isExpanded: boolean
  toggleSidebar: () => void
} | undefined
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------AuthContext--------------------------------------------------*/
export type User = {
  _id: string
  role: string
  email: string
  username: string
  permissions: object
} | undefined

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
export type BaseLocation = {
  _id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Country = BaseLocation & {}
export type State = BaseLocation & { country: string }
export type City = BaseLocation & { state: string }
export type Headquarter = BaseLocation & { address: string; client: string; city: string }

export type LocationType = 'country' | 'state' | 'city' | 'headquarter'

export type LocationContext = {
  loading: boolean
  // Métodos genéricos
  getOne: <T extends BaseLocation>(type: LocationType, id: string) => Promise<T>
  getAll: <T extends BaseLocation>(type: LocationType) => Promise<T[]>
  create: <T extends BaseLocation>(type: LocationType, data: Partial<T>) => Promise<T>
  update: <T extends BaseLocation>(type: LocationType, id: string, data: Partial<T>) => Promise<T>
  delete: <T extends BaseLocation>(type: LocationType, id: string) => Promise<T>

  // Métodos específicos para relaciones
  getStatesByCountry: (countryId: string) => Promise<State[]>
  getCitiesByState: (stateId: string) => Promise<City[]>
  getHeadquartersByCity: (cityId: string) => Promise<Headquarter[]>
}
/*---------------------------------------------------------------------------------------------------------*/