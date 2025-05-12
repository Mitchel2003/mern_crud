import { z } from "zod"

export const curriculumSchema = z.object({
  //location
  client: z
    .string({ required_error: "El cliente es requerido" })
    .min(1, "Debes seleccionar un cliente"),
  headquarter: z
    .string({ required_error: "La sede es requerida" })
    .min(1, "Debes seleccionar una sede"),
  office: z
    .string({ required_error: "La oficina es requerida" })
    .min(1, "Debes seleccionar una oficina"),
  service: z
    .string({ required_error: "El servicio es requerido" })
    .min(1, "Debes seleccionar un servicio"),

  //basicData
  preview: z.string().optional(),
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
    .min(2, "Debes seleccionar una serie")
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

  //characteristics
  annexesPreview: z.array(z.string()).optional().default([]),
  characteristics: z
    .string({ required_error: "Características son requeridas" })
    .optional(),
  recommendationsManufacturer: z
    .string({ required_error: "Las recomendaciones del fabricante son requeridas" })
    .optional(),

  //details
  datePurchase: z
    .date().optional().nullable(),
  dateInstallation: z
    .date().optional().nullable(),
  dateOperation: z
    .date().optional().nullable(),
  acquisition: z
    .string({ required_error: "Tipo adquisición del equipo es requerida" })
    .min(3, "Debes seleccionar un tipo de adquisición"),
  warranty: z.union([
    z.string().min(3, "Debes seleccionar una garantía"),
    z.object({ type: z.literal("otro"), value: z.string().min(3, "El valor de garantía debe tener al menos 3 caracteres") })
  ]),
  price: z.string()
    .transform(val => val.trim())
    .refine(val => val === '' || /^[0-9]+$/.test(val), { message: "El precio debe contener solo números" }),

  //equipment
  useClassification: z
    .string({ required_error: "Clasificación de uso del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación de uso"),
  equipClassification: z
    .string({ required_error: "Clasificación del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación del equipo"),
  typeClassification: z
    .string({ required_error: "Clasificación de tipo del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación de tipo"),
  biomedicalClassification: z
    .string({ required_error: "Clasificación biomédica del equipo es requerida" })
    .min(3, "Debes seleccionar una clasificación biomédica")
    .optional(),
  riskClassification: z
    .string({ required_error: "Clasificación de riesgo del equipo es requerida" })
    .min(1, "Debes seleccionar una clasificación de riesgo")
    .optional(),
  technologyPredominant: z
    .array(z.string({ required_error: "Tecnologías predominantes del equipo son requeridas" }))
    .min(1, "Debes seleccionar al menos una tecnología predominante"),
  powerSupply: z
    .array(z.string({ required_error: "Suministro de energía del equipo es requerido" }))
    .min(1, "Debes seleccionar al menos un suministro de energía"),

  //technical characteristics
  technicalCharacteristics: z
    .object({
      voltage: z.string(),
      amperage: z.string(),
      power: z.string(),
      frequency: z.string(),
      capacity: z.string(),
      pressure: z.string(),
      speed: z.string(),
      humidity: z.string(),
      temperature: z.string(),
      weight: z.string(),
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
    .array(z.string({ required_error: "Manuales de mantenimiento son requeridos" }))
    .min(1, "Debes seleccionar al menos un manual de mantenimiento"),

  //relationship
  inspection: z
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
    .min(1, "Debes seleccionar un representante"),

  //stakeholder (representative, supplier, manufacturer)
  newRepresentative: z.array(
    z.object({
      name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres"),
      phone: z
        .string().transform(val => val.trim())
        .refine(val => val === '' || /^[0-9]+$/.test(val), { message: "El teléfono debe contener solo números" }),
      city: z
        .string()
    })
  ).optional().default([]),

  newSupplier: z.array(
    z.object({
      name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres"),
      phone: z
        .string().transform(val => val.trim())
        .refine(val => val === '' || /^[0-9]+$/.test(val), { message: "El teléfono debe contener solo números" }),
      city: z
        .string()
    })
  ).optional().default([]),

  newManufacturer: z.array(
    z.object({
      name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres"),
      phone: z
        .string().transform(val => val.trim())
        .refine(val => val === '' || /^[0-9]+$/.test(val), { message: "El teléfono debe contener solo números" }),
      country: z
        .string()
    })
  ).optional().default([]),

  newInspection: z.array(
    z.object({
      name: z
        .string()
        .min(5, "El nombre debe tener al menos 5 caracteres")
        .max(50, "El nombre debe tener menos de 50 caracteres"),
      typeInspection: z.array(z.string({ required_error: "Las inspecciones son requeridas" })).min(1, "Debes seleccionar al menos una inspección"),
    })
  ).optional().default([]),

  newAccessories: z.array(
    z.object({
      name: z
        .string()
        .min(1, "Debes seleccionar un nombre para el accesorio"),
      type: z
        .string()
        .min(1, "Debes seleccionar un tipo"),
      serie: z
        .string()
        .min(1, "Debes seleccionar una serie"),
      modelEquip: z
        .string()
        .min(1, "Debes seleccionar un modelo"),
    })
  ).optional().default([]),

  newAnnexes: z.array(
    z.object({
      file: z.instanceof(File, { message: "Debe seleccionar un archivo" })
        .refine(file => file.size <= 5 * 1024 * 1024, "El archivo no debe exceder 5MB")
        .refine(file => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type), "El archivo debe ser PDF, DOC, DOCX, XLS o XLSX")
    })
  ).optional().default([])
}).refine((data) => {
  if (data.equipClassification === 'biomédico') return data.biomedicalClassification || data.riskClassification !== null
  return true
}, { message: "La clasificación biomédica o de riesgo es requerida cuando el tipo es biomédico", path: ["riskClassification", "biomedicalClassification"] })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
export type CurriculumFormProps = z.infer<typeof curriculumSchema>