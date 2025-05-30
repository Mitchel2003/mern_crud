import { User } from "@/interfaces/context.interface"
import { z } from "zod"

/*--------------------------------------------------authSchema--------------------------------------------------*/
export const signatureSchema = z.object({ png: z.string() })
export const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
})
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Correo electrónico inválido" })
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------userSchema--------------------------------------------------*/
export const authSchema = (credentials?: User) => {

  /**
   * User Authentication Schema
   * 
   * This schema defines the structure and validation rules for user authentication forms.
   * It includes fields for user credentials, role-based access, and optional previews.
   * The schema incorporates validation logic to ensure data integrity and compliance with business rules.
   */
  const userSchema = z.object({ //previews (helpers)
    previewCompanySignature: z.string().optional(),
    previewCompanyLogo: z.string().optional(),
    previewClientImage: z.string().optional(),
    //handle form fields optionals (update)
    isUpdate: z
      .boolean().optional(),
    //auth-firebase
    password: z
      .string().optional(),
    email: z
      .string().optional(),
    //user credentials
    username: z
      .string({ required_error: "El nombre de usuario es requerido" })
      .min(5, "El nombre de usuario debe tener al menos 5 caracteres")
      .max(75, "El nombre de usuario debe tener menos de 75 caracteres"),
    phone: z
      .string({ required_error: "El teléfono es requerido" })
      .min(6, "El teléfono debe tener al menos 6 caracteres")
      .refine(value => /^[0-9]+$/.test(value), { message: "El teléfono debe contener solo números" }),
    position: z
      .string({ required_error: "El cargo es requerido" })
      .min(2, "El cargo es demasiado corto")
      .max(25, "El cargo es demasiado largo"),
    //dependent role
    nit: z
      .string().optional(),
    invima: z
      .string().optional(),
    profesionalLicense: z
      .string().optional(),
    //access (role)
    role: z
      .string({ required_error: "El rol es requerido" })
      .min(1, "Debes seleccionar un rol"),
    permissions: z
      .array(z.string()).optional().default([]),
    //handle references associated
    belongsTo: z
      .string().optional().nullable(),
    classification: z
      .array(z.string()).optional().default([]),
    //user files (storage)
    photoImage: z
      .array(z.object({
        file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
          .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
          .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
      })).optional().default([]),
    photoSignature: z
      .array(z.object({
        file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
          .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
          .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
      })).optional().default([]),
    photoLogo: z
      .array(z.object({
        file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
          .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
          .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
      })).optional().default([])
  }).superRefine((data, ctx) => validateUserData(data, credentials, ctx))

  /**
   * Client Flow Schema
   * 
   * This schema defines the structure and validation rules for client registration forms.
   * It supports multi-step form submissions, ensuring comprehensive data collection for client onboarding.
   * The schema includes validation logic to maintain data consistency and enforce business requirements.
   *
   * Fields:
   * - client: Object containing client-specific fields such as email, password, username, etc.
   * - headquarter: Array of objects for defining headquarters details like name, address, and city.
   * - office: Array of objects for office-related information, including headquarter, services, and name.
   *
   * Validation:
   * - Ensures services belong to the same group.
   * - Validates city format using a standard UID regular expression.
   */
  const clientFlowSchema = z.object({
    client: z.object({
      email: z //auth-firebase
        .string({ required_error: "El correo electrónico es requerido" })
        .email("Correo electrónico inválido"),
      password: z
        .string({ required_error: "La contraseña es requerida" })
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
      username: z //user credentials
        .string({ required_error: "El nombre de usuario es requerido" })
        .min(5, "El nombre de usuario debe tener al menos 5 caracteres")
        .max(50, "El nombre de usuario debe tener menos de 50 caracteres"),
      position: z
        .string({ required_error: "El cargo es requerido" })
        .min(2, "El cargo es demasiado corto")
        .max(15, "El cargo es demasiado largo"),
      phone: z
        .string({ required_error: "El teléfono es requerido" })
        .min(6, "El teléfono debe tener al menos 6 caracteres")
        .refine(value => /^[0-9]+$/.test(value), { message: "El teléfono debe contener solo números" }),
      nit: z
        .string({ required_error: "El NIT es requerido" })
        .min(8, "El NIT es requerido")
        .max(20, "El NIT es demasiado largo"),
      role: z //access (role)
        .string({ required_error: "El rol es requerido" })
        .min(1, "Debes seleccionar un rol"),
      photoUrl: z //user files (storage)
        .array(z.object({
          file: z.instanceof(File, { message: "Debe seleccionar una imagen" })
            .refine(file => file.size <= 5 * 1024 * 1024, "La imagen no debe exceder 5MB")
            .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "La imagen debe ser PNG, JPG o JPEG")
        })).optional().default([]),
    }),
    headquarter: z.array(
      z.object({
        name: z
          .string({ required_error: "El nombre es requerido" })
          .min(3, "El nombre debe tener al menos 3 caracteres")
          .max(50, "El nombre debe tener menos de 50 caracteres"),
        address: z
          .string({ required_error: "La dirección es requerida" })
          .min(3, "La dirección debe tener al menos 3 caracteres")
          .max(100, "La dirección debe tener menos de 100 caracteres"),
        city: z
          .string({ required_error: "La ciudad es requerida" })
          .min(1, "Debes seleccionar una ciudad")
          .refine(
            (value) => {
              const regularExpression = /^[0-9a-fA-F]{24}$/;/* standard uid */ return regularExpression.test(value)
            }, { message: "Debes seleccionar una ciudad de la lista proporcionada" }
          )
      })
    ),
    office: z.array(
      z.object({
        headquarter: z
          .string({ required_error: "La sede es requerida" })
          .min(1, "Debes seleccionar una sede"),
        services: z
          .array(z.string({ required_error: "El servicio es requerido" }))
          .min(1, "Debes seleccionar al menos un servicio"),
        name: z
          .string({ required_error: "El nombre es requerido" })
          .min(3, "El nombre debe tener al menos 3 caracteres")
          .max(50, "El nombre debe tener menos de 50 caracteres")
      }).superRefine((data, ctx) => {
        const groups = data.services.map((service) => service.split(' - ')[1])
        if (groups.length > 1 && new Set(groups).size > 1) ctx.addIssue({
          message: "Debes seleccionar servicios del mismo grupo",
          code: z.ZodIssueCode.custom,
          path: ['services']
        })
      })
    )
  })

  return { userSchema, clientFlowSchema }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------types--------------------------------------------------*/
export type LoginFormProps = z.infer<typeof loginSchema>
export type SignatureProps = z.infer<typeof signatureSchema>
export type ForgotPasswordFormProps = z.infer<typeof forgotPasswordSchema>

export type UserFormProps = z.infer<ReturnType<typeof authSchema>['userSchema']>
export type ClientFlowProps = z.infer<ReturnType<typeof authSchema>['clientFlowSchema']>
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const validateUserData = (data: any, credentials: any, ctx: any) => {
  if (!data.isUpdate) { // if id exists, it's an update
    if (!data.email || data.email.trim() === "") {
      ctx.addIssue({ path: ["email"], code: z.ZodIssueCode.custom, message: "El correo electrónico es requerido" });
    }
    if (!data.password || data.password.trim() === "") {
      ctx.addIssue({ path: ["password"], code: z.ZodIssueCode.custom, message: "La contraseña es requerida" });
    }
  }

  // Validate client fields
  if (data.role === 'client') {
    if (!data.nit || data.nit.trim() === "") {
      ctx.addIssue({ path: ["nit"], code: z.ZodIssueCode.custom, message: `El NIT es requerido para cliente` });
    }
  }

  // Validate collaborator fields
  if (data.role === 'collaborator') {
    if (!data.belongsTo || data.belongsTo.trim() === "") {
      ctx.addIssue({ path: ["belongsTo"], code: z.ZodIssueCode.custom, message: "La clasificación es requerida para colaborador" });
    }
    if (!data.permissions || data.permissions.length === 0) {
      ctx.addIssue({ path: ["permissions"], code: z.ZodIssueCode.custom, message: "Los permisos son requeridos para colaborador" });
    }
    if (!data.classification || data.classification.length === 0) {
      ctx.addIssue({ path: ["classification"], code: z.ZodIssueCode.custom, message: "La clasificación es requerida para colaborador" });
    }
  }

  // Validate company fields
  if (data.role === "company") {
    if (!data.nit || data.nit.trim() === "") {
      ctx.addIssue({ path: ["nit"], code: z.ZodIssueCode.custom, message: `El NIT es requerido para prestadores de servicios` });
    }
    if (data.classification?.length) {
      if (data.classification.includes('biomédico') && (!data.invima || data.invima.trim() === "")) {
        ctx.addIssue({ path: ["invima"], code: z.ZodIssueCode.custom, message: "El Invima es requerido para prestadores de servicio" });
      }
      if (!data.classification.includes('biomédico') && (!data.profesionalLicense || data.profesionalLicense.trim() === "")) {
        ctx.addIssue({ path: ["profesionalLicense"], code: z.ZodIssueCode.custom, message: "La licencia profesional es requerida para prestadores de servicio" });
      }
    }
    if (!data.permissions || data.permissions.length === 0) {
      ctx.addIssue({ path: ["permissions"], code: z.ZodIssueCode.custom, message: `Los permisos son requeridos para prestadores de servicios` });
    }
    if (data.belongsTo) {
      if (!data.classification || data.classification.length === 0) {
        ctx.addIssue({ path: ["classification"], code: z.ZodIssueCode.custom, message: "La clasificación es requerida para sub-prestadores" });
      }
      if (data.classification && data.classification.length > 2) {
        ctx.addIssue({ path: ["classification"], code: z.ZodIssueCode.custom, message: "Los sub-prestadores no pueden tener todos los accesos" });
      }
    } else {
      if (credentials?.role === 'company') {
        ctx.addIssue({ path: ["belongsTo"], code: z.ZodIssueCode.custom, message: "La asignación es requerida para sub-prestadores" });
      }
    }
  }
}