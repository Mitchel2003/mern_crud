import { ThemeContextProps } from "@/interfaces/context.interface"
import { ReactElement, LabelHTMLAttributes } from 'react';
import { Control } from 'react-hook-form'

/*--------------------------------------------------Component Props--------------------------------------------------*/
//interface defautl props
export interface Props { children?: React.ReactNode }

//sidebar
export interface NavItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  subItems?: NavItemProps[]
  action?: () => Promise<void>
}

//theme components
export interface LoginComponentsProps extends ThemeContextProps { }
/*---------------------------------------------------------------------------------------------------------*/

/*---------------------- Cards ----------------------*/
/**
 * @name name - Corresponde como tal al nombre del campo, hace las veces de un identificador para el correcto control del formulario
 * @name component - Es el componente personalizado que se renderiza en el campo
 * @description En diversas ocasiones se puede usar el mismo componente para diferentes campos;
 * el detalle esta en que ha este se le debe pasar una propiedad name pero es para nombrar al componente mismo "FormField"
*/
export interface CardFieldProps { name: string, component: ReactElement }

/*---------------------- Carousel ----------------------*/
/**
 * @description permite crear un carousel de imagenes con un intervalo de tiempo
*/
export interface CarouselProps { children: React.ReactNode, autoPlay?: boolean, interval?: number }
export interface CarouselContext {
  index: number
  setIndex: (index: number) => void
  next: () => void
  prev: () => void
}

/*---------------------- Fields ----------------------*/
export interface ControlProps { control: Control<any> }
/*---------------------- htmlFor ----------------------*/
/** @description Pick<> se utiliza para extraer solo la propiedad 'htmlFor' */
export interface HtmlForProps extends Pick<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> { }
/*---------------------- Reusables ----------------------*/
// HeaderForm
export interface HeaderBreadcrumbProps { description: string }

// HeaderCustom
export interface HeaderSpanProps {
  span?: string;
  iconSpan?: 'info' | 'warn' | 'alert' | 'none';
}
// StatusCheck
export interface CheckProps {
  name: string
  label: string
  color: string
}