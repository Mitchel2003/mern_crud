import { z } from "zod"

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
    role: z.string().min(1, "Debes seleccionar un rol")
  })


export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginFormProps = z.infer<typeof loginSchema>
export type RegisterFormProps = z.infer<typeof registerSchema>
export type ResetPasswordFormProps = z.infer<typeof resetPasswordSchema>