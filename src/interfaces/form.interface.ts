import { ChangeEvent, MouseEvent } from "react";
import { Control } from "react-hook-form";

/*--------------------------------------------------Component--------------------------------------------------*/
export interface SelectFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
  placeholder: string;
}
/* --------------------------------------------------------------------------------------------------------- */

/*--------------------------------------------------Section--------------------------------------------------*/
//ChangeEventProps
export type ChangeEventProps = (event: ChangeEvent<HTMLInputElement>) => void
export type MouseEventProps = (click: MouseEvent) => void
export type Image = string | undefined

//Entity Reference Section
export type EntityReferenceSection = {
  entity: string;
  service: string;
}

//General Data Section
export type GeneralDataSection = {
  name: string;
  brand: string;
  model: string;
  serie: string;
  healthRecord: string;
  equipmentImage: File | null;
}

//Device Details Section
export type DeviceDetailsSection = {
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
export type TechnicalCharacteristicsSection = {
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
export type EquipmentSection = {
  //first component "classification"
  type_device: string;
  classification_by_use: string;
  classification_biomedical: string;
  //second component "technology and risk"
  technology_predominant: string;
  risk: string;
}

//Maintenance Section
export type MaintenanceSection = {
  maintenance: string;
  type_maintenance: string[];
  frequency_maintenance: string;
  manual: string[];
}

//Accessories Section
export type AccessoriesSection = {
  accessories: {
    name: string;
    type: string;
    series: string;
    model: string;
  }[];
}

//Characteristics Section
export type CharacteristicsSection = {
  characteristics: string;
  recommendations_manufacturer: string;
}

//Engineer Reference Section
export type EngineerReferenceSection = {
  service_engineer: string;
  invima_registration: string;
}
/* --------------------------------------------------------------------------------------------------------- */