import { type LucideIcon } from "lucide-react"

/*--------------------------------------------------Component Props--------------------------------------------------*/
//interface defautl props
export interface Props { children?: React.ReactNode }

/*---------------------- ui components ----------------------*/
// items actions to dropdown (data-table)
export interface ActionProps {
  label: string
  icon: LucideIcon
  className?: string
  onClick: () => void | Promise<void>
}

/*---------------------- Reusables ----------------------*/
// HeaderForm
export interface HeaderBreadcrumbProps { description: string }

// HeaderCustom
export interface HeaderSpanProps {
  iconSpan?: 'info' | 'warn' | 'alert' | 'none'
  span?: string
}

// StatusCheck
export interface CheckProps { name: string, label: string, color: string, icon: LucideIcon }

// Carousel
/** @description permite crear un carousel de imagenes con un intervalo de tiempo */
export interface CarouselProps { children: React.ReactNode, autoPlay?: boolean, interval?: number }
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
  importance: 'critical' | 'warning' | 'normal';
  description: string;
  date: Date;
  id: string;
}
export interface CardDay {
  events: EventMaintenance[];
  date: Date;
}
export interface Equipment {
  nextMaintenance: Date;
  imageUrl: string;
  status: string;
  name: string;
  id: string;
}

// Dialog
export interface DialogField { name: string, component: React.ReactElement }