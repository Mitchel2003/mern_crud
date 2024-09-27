import { Control } from "react-hook-form";

/*--------------------------------------------------Component--------------------------------------------------*/
//input standard with type changeable
export interface FieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  placeholder?: string;
}

//input type select (dropdown)
export interface SelectFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
  placeholder: string;
}

//input type checkbox
export interface CheckboxFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
}

//input type date (calendar)
export interface DateFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
}



//props of IterableCardField
export interface FieldFormat { name: string; label: string; placeholder?: string }
export interface IterableCardFieldProps {
  name: string;
  title: string;
  fields: FieldFormat[];
  addButtonText: string;
}

//input type file (image)
export type ImagePreview = string | null
export interface ImageFieldProps {
  name: string;
  label: string;
  control: Control<any>;
}

/* --------------------------------------------------------------------------------------------------------- */

/*--------------------------------------------------Section--------------------------------------------------*/
//ChangeEventProps
export type Image = File | null

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
export type EngineerReferenceProps = {
  service_engineer: string;
  invima_registration: string;
}
/* --------------------------------------------------------------------------------------------------------- */