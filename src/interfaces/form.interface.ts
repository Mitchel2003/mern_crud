import { Control } from "react-hook-form";

/*--------------------------------------------------Component--------------------------------------------------*/
{/* Inputs */ }
export interface FieldProps {//standard with type changeable
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
}
export interface SelectFieldProps {//type select (dropdown)
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
  placeholder: string;
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
export interface FieldFormat { name: string; label: string; placeholder?: string }
export interface IterableCardFieldProps {//type card (IterableCardField)
  name: string;
  title: string;
  fields: FieldFormat[];
  addButtonText: string;
}
export interface ImageFieldProps {//type file (image equipment)
  name: string;
  label: string;
  control: Control<any>;
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
  //fourth section
  distributor: string;
  city_distributor: string;
  phone_distributor: string;
  //fifth section
  manufacturer: string;
  country_manufacturer: string;
  phone_manufacturer: string;
  year_manufacture: number;
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