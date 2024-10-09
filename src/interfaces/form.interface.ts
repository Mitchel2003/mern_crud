import { Control } from 'react-hook-form'
import { ReactElement } from 'react';

/*--------------------------------------------------Component--------------------------------------------------*/
/*---------------------- Fields ----------------------*/
export interface ControlProps {
  control: Control<any>;
}
/*---------------------- Reusables ----------------------*/
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
/*---------------------- Cards ----------------------*/
/**
 * @name name - Corresponde como tal al nombre del campo, hace las veces de un identificador para el correcto control del formulario
 * @name component - Es el componente personalizado que se renderiza en el campo
 * @description En diversas ocasiones se puede usar el mismo componente para diferentes campos;
 * el detalle esta en que ha este se le debe pasar una propiedad name pero es para nombrar al componente mismo "FormField"
 */
export interface CardFieldProps { name: string, component: ReactElement }
/* --------------------------------------------------------------------------------------------------------- */