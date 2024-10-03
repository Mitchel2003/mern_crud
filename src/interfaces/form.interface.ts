import { Control } from 'react-hook-form'
import { ReactElement } from 'react';

/*--------------------------------------------------Component--------------------------------------------------*/
{/*---------------------- Fields ----------------------*/ }
export interface FieldProps {//standard with type changeable
  name: string;
  label?: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
}
export interface SelectFieldProps {//type select (dropdown)
  name: string;
  label?: string;
  control: Control<any>;
  options: string[];
  placeholder?: string;
}
export interface AreaFieldProps {//type area (textArea)
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
}
export interface CheckboxFieldProps {//type checkbox
  label: string;
  control: Control<any>;
  options: string[];
  isMultiple?: boolean;
}
export interface DateFieldProps {//type date (calendar)
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
}
export interface ImageFieldProps {//type file (image equipment)
  name: string;
  label: string;
  control: Control<any>;
}

{/*---------------------- Cards ----------------------*/ }
//to cards reusables
export interface CardFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  component: ReactElement;
}
export interface IterableCardFieldProps {
  name: string;
  control: Control<any>;
  fields: CardFieldProps[];
  titleButton?: string;
  limit?: number;
}
/* --------------------------------------------------------------------------------------------------------- */