import { Control } from 'react-hook-form'
import { ReactElement } from 'react';

/*--------------------------------------------------Component--------------------------------------------------*/
/*---------------------- Fields ----------------------*/
export interface ControlProps {
  control: Control<any>;
}
/*---------------------- Cards ----------------------*/
//to cards reusables
export interface CardFieldProps { name: string, component: ReactElement }
/* --------------------------------------------------------------------------------------------------------- */