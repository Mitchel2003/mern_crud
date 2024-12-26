import { onAuthStateChanged, getAuth, Auth, User } from "firebase/auth"
import { firebaseApp } from "@/utils/config"

interface IAuth { observeAuth(callback: (user: any) => void): void }

/**
 * Consist on a class that works above an instance auth
 * Have various functions like observer, verification or overwrite data
 */
class AuthService implements IAuth {
  private static instance: AuthService
  private readonly auth: Auth
  private constructor() { this.auth = getAuth(firebaseApp) }

  public static getInstance(): AuthService {
    if (!AuthService.instance) { AuthService.instance = new AuthService() }
    return AuthService.instance
  }

  /**
   * Observa el estado de autenticación del usuario.
   * @param {Function} callback - La función de devolución de llamada que se ejecutará cuando cambie el estado de autenticación.
   */
  observeAuth(callback: (user: User | null) => void) {
    onAuthStateChanged(this.auth, callback)
  }
}

export const authService = AuthService.getInstance()