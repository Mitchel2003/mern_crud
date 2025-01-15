import { z } from "zod"

/*--------------------------------------------------curriculum--------------------------------------------------*/
export const curriculumSchema = z.object({
  //location
  client: z
    .string({ required_error: "El cliente es requerido" })
    .min(1, "Debes seleccionar un cliente"),
  headquarter: z
    .string({ required_error: "La sede es requerida" })
    .min(1, "Debes seleccionar una sede"),
  area: z
    .string({ required_error: "El área es requerida" })
    .min(1, "Debes seleccionar un área"),
  office: z
    .string({ required_error: "La oficina es requerida" })
    .min(1, "Debes seleccionar una oficina"),
  service: z
    .string({ required_error: "El servicio es requerido" })
    .min(1, "Debes seleccionar un servicio"),

  //basicData
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  brand: z
    .string({ required_error: "La marca es requerida" })
    .min(1, "Debes seleccionar una marca")
    .max(50, "La marca debe tener menos de 50 caracteres"),
  serie: z
    .string({ required_error: "La serie es requerida" })
    .min(3, "Debes seleccionar una serie")
    .max(50, "La serie debe tener menos de 50 caracteres"),
  modelEquip: z
    .string({ required_error: "El modelo es requerido" })
    .min(3, "Debes seleccionar un modelo")
    .max(50, "El modelo debe tener menos de 50 caracteres"),
  healthRecord: z
    .string({ required_error: "El registro invima es requerido" })
    .min(3, "Debes seleccionar un registro invima")
    .max(50, "El registro invima debe tener menos de 50 caracteres"),
  photoUrl: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
        .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
    })
  ).optional().default([]),

  //details
  datePurchase: z.date({ required_error: "La fecha de adquisición es requerida" }).nullable(),
  dateInstallation: z.date({ required_error: "La fecha de instalación es requerida" }).nullable(),
  dateOperation: z.date({ required_error: "La fecha de operación es requerida" }).nullable(),
  acquisition: z
    .string({ required_error: "Tipo adquisición del equipo es requerida" })
    .min(3, "Debes seleccionar un tipo de adquisición"),
  warranty: z
    .string({ required_error: "Garantía del equipo es requerida" })
    .min(3, "Debes seleccionar una garantía"),
  price: z
    .string({ required_error: "Precio del equipo es requerido" })
    .min(4, "Debes proporcionar un precio"),

  //equipment
  useClassification: z
    .string({ required_error: "Clasificación de uso del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación de uso"),
  typeClassification: z
    .string({ required_error: "Clasificación de tipo del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación de tipo"),
  biomedicalClassification: z
    .string({ required_error: "Clasificación biomédica del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación biomédica"),
  riskClassification: z
    .string({ required_error: "Clasificación de riesgo del equipo es requerida" })
    .min(1, "Debes seleccionar una clasificación de riesgo"),
  technologyPredominant: z
    .array(z.string({ required_error: "Tecnologías predominantes del equipo son requeridas" }))
    .min(1, "Debes seleccionar al menos una tecnología predominante"),
  powerSupply: z
    .array(z.string({ required_error: "Suministro de energía del equipo es requerido" }))
    .min(1, "Debes seleccionar al menos un suministro de energía"),

  //technical characteristics
  technicalCharacteristics: z
    .object({
      voltage: z.string().optional(),
      amperage: z.string().optional(),
      power: z.string().optional(),
      frequency: z.string().optional(),
      capacity: z.string().optional(),
      pressure: z.string().optional(),
      speed: z.string().optional(),
      humidity: z.string().optional(),
      temperature: z.string().optional(),
      weight: z.string().optional(),
    }).optional(),

  //maintenance
  employmentMaintenance: z
    .string({ required_error: "Empleo del mantenimiento es requerido" })
    .min(3, "Debes seleccionar un empleo de mantenimiento"),
  frequencyMaintenance: z
    .string({ required_error: "Frecuencia de mantenimiento es requerida" })
    .min(3, "Debes seleccionar una frecuencia de mantenimiento"),
  typeMaintenance: z
    .array(z.string({ required_error: "Tipos de mantenimiento son requeridos" }))
    .min(1, "Debes seleccionar al menos un tipo de mantenimiento"),
  manualsMaintenance: z
    .string({ required_error: "Manuales de mantenimiento son requeridos" })
    .min(3, "Debes seleccionar un manual de mantenimiento"),

  //relationship
  /*inspection: z
    .string({ required_error: "La inspección es requerida" })
    .min(1, "Debes seleccionar una inspección"),
  supplier: z
    .string({ required_error: "El proveedor es requerido" })
    .min(1, "Debes seleccionar un proveedor"),
  manufacturer: z
    .string({ required_error: "El fabricante es requerido" })
    .min(1, "Debes seleccionar un fabricante"),
  representative: z
    .string({ required_error: "El representante es requerido" })
    .min(1, "Debes seleccionar un representante"),*/

  // Campos para crear nuevo representante
  /* newRepresentative: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    city: z.string().optional()
  }).optional(),

  // Campos para crear nuevo proveedor 
  newSupplier: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    nit: z.string().optional()
  }).optional(),

  // Campos para crear nuevo fabricante
  newManufacturer: z.object({
    name: z.string().optional(), 
    email: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional()
  }).optional() */
}).refine(data => { return /^[0-9]+$/.test(data.price) }, {
  message: "El precio debe contener solo números", path: ["price"]
})

export const stakeholderSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Correo electrónico inválido"),
  phone: z
    .string({ required_error: "El telefono es requerido" })
    .min(6, "El teléfono es requerido")
    .max(15, "El teléfono es demasiado largo"),
  city: z
    .string({ required_error: "La ciudad es requerida" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres")
    .optional(),
}).refine(data => { return /^[0-9]+$/.test(data.phone) }, {
  message: "El teléfono debe contener solo números", path: ["phone"]
})

export const supplierSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Correo electrónico inválido"),
  phone: z
    .string({ required_error: "El telefono es requerido" })
    .min(6, "El teléfono es requerido")
    .max(15, "El teléfono es demasiado largo"),
  address: z
    .string({ required_error: "La dirección es requerida" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre debe tener menos de 50 caracteres"),
  nit: z
    .string({ required_error: "El NIT es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre debe tener menos de 50 caracteres")
}).refine(data => { return /^[0-9]+$/.test(data.phone) }, {
  message: "El teléfono debe contener solo números", path: ["phone"]
})

export const inspectionSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, "Debes seleccionar un nombre para la inspección"),
  typeInspection: z.array(z.string({ required_error: "Las inspecciones son requeridas" })).min(1, "Debes seleccionar al menos una inspección"),
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------accessories--------------------------------------------------*/
export const accessorySchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(3, "El nombre debe tener al menos 3 caracteres"),
  type: z.string({ required_error: "El tipo es requerido" }).min(3, "El tipo debe tener al menos 3 caracteres"),
  serie: z.string({ required_error: "La serie es requerida" }).min(3, "La serie debe tener al menos 3 caracteres"),
  modelEquip: z.string({ required_error: "El modelo es requerido" }).min(3, "El modelo debe tener al menos 3 caracteres"),
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------maintenance--------------------------------------------------*/
export const maintenanceSchema = z.object({
  //timestandard
  dateNextMaintenance: z.date({ required_error: "La fecha del próximo mantenimiento es requerida" }),
  dateMaintenance: z.date().optional(),

  //maintenance
  typeMaintenance: z.string({ required_error: "El tipo de mantenimiento es requerido" }).min(1, "Debes seleccionar un tipo de mantenimiento"),
  statusEquipment: z.string({ required_error: "El estado del equipo es requerido" }).min(1, "Debes seleccionar un estado del equipo"),
  faultEquipment: z.boolean().optional().default(false),
  faultDescription: z.string({ required_error: "La descripción de la falla es requerida" }).min(1, "Debes seleccionar una descripción de la falla"),
  inspections: z.array(z.string({ required_error: "Las inspecciones son requeridas" })).min(1, "Debes seleccionar al menos una inspección"),
  observations: z.string({ required_error: "Las observaciones son requeridas" }).min(1, "Debes seleccionar una observación"),

  //received
  receivedBy: z.string({ required_error: "El nombre de la persona que recibe es requerido" }).min(1, "Debes seleccionar una persona que recibe"),
  nameEngineer: z.string({ required_error: "El nombre del ingeniero es requerido" }).min(1, "Debes seleccionar un ingeniero"),
  invimaEngineer: z.string({ required_error: "El INVIMA del ingeniero es requerido" }).min(1, "Debes seleccionar un INVIMA"),

  //references
  equipment: z.string({ required_error: "El ID del equipo es requerido" }).min(1, "Debes seleccionar un equipo"),
  headquarter: z.string({ required_error: "El ID de la sede es requerido" }).min(1, "Debes seleccionar una sede"),
})

export type CurriculumFormProps = z.infer<typeof curriculumSchema>
export type MaintenanceFormProps = z.infer<typeof maintenanceSchema>
export type StakeholderFormProps = z.infer<typeof stakeholderSchema>
export type SupplierFormProps = z.infer<typeof supplierSchema>
export type InspectionFormProps = z.infer<typeof inspectionSchema>