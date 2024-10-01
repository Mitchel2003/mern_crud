import { Control, UseFormRegister } from "react-hook-form";
import { ReactElement } from 'react';

/*--------------------------------------------------Component--------------------------------------------------*/
{/*---------------------- Inputs ----------------------*/ }
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
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
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
export interface SimpleFieldProps { name: string; label: string; placeholder?: string }
export interface IterableCardProps {//type card (IterableCardField)
  name: string;
  title: string;
  fields: SimpleFieldProps[];
  addButtonText: string;
}


export interface CustomFieldProps {//type card (IterableCardCustom)
  name: string;
  label: string;
  placeholder?: string;
  component: ReactElement;
}
export interface IterableCardCustomProps {//type card (IterableCardCustom)
  name: string;
  fields: CustomFieldProps[];
  titleButton?: string;
  control: Control<any>;
}
export interface SupplierData {//type supplier
  name: string;
  city: string;
  phone: string;
  type: 'distributor' | 'manufacturer';
}


{/* Elements */ }
export interface LogoImageFieldProps {//file (logo entity)
  name: string
  label: string
  control: Control<any>
  className?: string
}
/* --------------------------------------------------------------------------------------------------------- */

/*--------------------------------------------------Section--------------------------------------------------*/
//ChangeEventProps
export type Image = string | null

//Entity Reference Section
export type OfficeAreaProps = {
  entity: string;
  area: string;
  office: string;
}

//General Data Section
export type GeneralDataProps = {
  name: string;
  brand: string;
  model: string;
  serie: string;
  healthRecord: string;
  equipmentImage: Image;
}

//Device Details Section
export type DetailsEquipmentProps = {
  //first section
  purchase_date: Date;
  installation_date: Date;
  start_operation_date: Date;
  //second section
  price: number;
  type_acquisition: string;
  warranty: string;
  //third section
  representative: string;
  city_representative: string;
  phone_representative: string;

  //distributor
  distributor: string;
  city_distributor: string;
  phone_distributor: string;
}

//Technical Characteristics Section
export type TechnicalCharacteristicsProps = {
  //only one component
  voltage: number;
  amperage: number;
  power: number;
  frequency: number;
  capacity: number;
  pressure: number;
  speed: number;
  temperature: number;
  weight: number;
  humidity: number;
}

//Equipment Section
export type EquipmentProps = {
  //first component "classification"
  type_device: string;
  classification_by_use: string;
  classification_biomedical: string;
  //second component "technology and risk"
  technology_predominant: string;
  risk: string;
}

//Maintenance Section
export type MaintenanceProps = {
  maintenance: string;
  type_maintenance: string[];
  frequency_maintenance: string;
  manual: string[];
}

//Accessories Section, its an array of objects
export type AccessoriesProps = {
  accessories: {
    name: string;
    type: string;
    series: string;
    model: string;
  }[];
}

//Characteristics Section
export type CharacteristicsProps = {
  characteristics: string;
  recommendations_manufacturer: string;
}

//Engineer Reference Section
export type EngineerProps = {
  service_engineer: string;
  invima_registration: string;
  engineer_image: Image;
}
/* --------------------------------------------------------------------------------------------------------- */

/*--------------------------------------------------Temp--------------------------------------------------*/
export type FormData = {
  representative: {
    name: string
    city: string
    phone: string
  }
  suppliers: {
    name: string
    city: string
    phone: string
    type: 'distributor' | 'manufacturer'
  }[]
}

export type InputFieldProps = {
  label: string
  name: string
  register: UseFormRegister<FormData>
  placeholder: string
}

export type SupplierCardProps = {
  index: number
  control: Control<FormData>
  register: UseFormRegister<FormData>
  remove: (index: number) => void
}