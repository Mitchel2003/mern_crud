import { type LucideIcon } from "lucide-react"

/*--------------------------------------------------Component Props--------------------------------------------------*/
//interface defautl props
export interface Props { children?: React.ReactNode }

/*---------------------- ui components ----------------------*/
// items actions to dropdown (data-table)
export interface ActionProps {
  onClick: () => void | Promise<void>
  className?: string
  icon: LucideIcon
  label: string
}

// options query
export interface QueryOptions {
  [key: string]: any
  enabled?: boolean
}
/*---------------------- Reusables ----------------------*/
// HeaderCustom
export interface HeaderSpanProps {
  iconSpan?: 'info' | 'warn' | 'alert' | 'none'
  span?: string
}

// SelectMultiOption
export interface SelectMultiOptionProps {
  icon?: LucideIcon
  value: string
  label: string
}

// SelectOption
export interface SelectOptionProps<T = string> {
  description?: string
  disabled?: boolean
  label: string
  value: T
}

// StatusCheck
export interface CheckProps {
  name: string
  label: string
  color: string
  icon: LucideIcon
}

// Carousel
/** @description permite crear un carousel de imagenes con un intervalo de tiempo */
export interface CarouselProps {
  children: React.ReactNode
  autoPlay?: boolean
  interval?: number
}
export interface CarouselContext {
  index: number
  setIndex: (index: number) => void
  next: () => void
  prev: () => void
}

//Sidebar
export interface NavItemProps {
  action?: () => void | Promise<void>
  subItems?: NavItemProps[]
  icon: LucideIcon
  label: string
  href?: string
}

// Dashboard
export interface EventMaintenance {
  importance: 'critical' | 'warning' | 'normal'
  description: string
  date: Date
  id: string
}
export interface CardDay {
  events: EventMaintenance[]
  date: Date
}
export interface Equipment {
  nextMaintenance: Date
  imageUrl: string
  status: string
  name: string
  id: string
}

// Dialog
export interface DialogField {
  component: React.ReactElement
  name: string
}
export interface ConfirmTriggerProps {
  onSubmit: (data: any) => Promise<void>
  resetData: Record<string, any>
  description: string
  fieldName: string
  title: string
}

// Step-form
export interface AddOn {
  subtitle: string;
  checked: boolean;
  title: string;
  price: number;
  id: number;
}
export type FormItems = {
  plan: 'arcade' | 'advanced' | 'pro';
  yearly: boolean;
  addOns: AddOn[];
  phone: string;
  email: string;
  name: string;
};