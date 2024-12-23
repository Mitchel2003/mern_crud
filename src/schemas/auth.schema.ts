import { z } from "zod"

export const forgotPasswordSchema = z
  .object({
    email: z.string().email("Correo electrónico inválido")
  })

export const loginSchema = z
  .object({
    email: z.string().email("Correo electronico invalido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
  })

export const registerSchema = z
  .object({
    email: z.string().email("Correo electronico invalido"),
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.string().min(1, "Debes seleccionar un rol"),
    clients: z.array(z.string()).min(1, "Debes seleccionar al menos un cliente")
  })

export type LoginFormProps = z.infer<typeof loginSchema>
export type RegisterFormProps = z.infer<typeof registerSchema>
export type ForgotPasswordFormProps = z.infer<typeof forgotPasswordSchema>