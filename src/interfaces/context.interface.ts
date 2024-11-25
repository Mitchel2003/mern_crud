/*--------------------------------------------------ThemeContext--------------------------------------------------*/
export type Theme = 'light' | 'dark'

export type ThemeContext = {
  theme: Theme
  toggleTheme: () => void
} | undefined

export type ThemeContextProps = { theme: Theme }
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
  verifyAction: (mode: string, data: object) => Promise<void>
  logout: () => Promise<void>
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
  cvs: Curriculum[]
  getCV: (id: string) => Promise<void>
  getCVs: () => Promise<void>
  createCV: (cv: object) => Promise<void>
  updateCV: (id: string, cv: object) => Promise<void>
  deleteCV: (id: string) => Promise<void>
} | undefined
/*---------------------------------------------------------------------------------------------------------*/