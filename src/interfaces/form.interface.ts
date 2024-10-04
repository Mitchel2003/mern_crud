import { Control } from 'react-hook-form'
import { ReactElement } from 'react';

/*--------------------------------------------------Component--------------------------------------------------*/
/*---------------------- Fields ----------------------*/
export interface ControlProps {
  control: Control<any>;
}
/*---------------------- Cards ----------------------*/
//to cards reusables
/**
 * @name name - Corresponde como tal al nombre del campo
 * @name component - Es el componente que se renderiza en el campo
 * @description En diversas ocasiones se puede usar el mismo componente para diferentes campos;
 * el detalle esta en que ha este se le debe pasar una propiedad name pero es para nombrar al componente mismo "FormField"
 */
export interface CardFieldProps { name: string, component: ReactElement }
/* --------------------------------------------------------------------------------------------------------- */