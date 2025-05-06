import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { useFormatMutation } from "@/hooks/query/useFormatQuery"
import { useUserMutation } from "@/hooks/query/useAuthQuery"
import { RoleProps } from "@/interfaces/context.interface"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { User } from "@/interfaces/context.interface"

/*--------------------------------------------------user table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de usuarios para la tabla */
export const useUserTable = (to: RoleProps) => {
  const [onDelete, setOnDelete] = useState<User | undefined>(undefined)
  const { deleteFile } = useFormatMutation('file')
  const { deleteUser: _delete } = useUserMutation()
  const isProcessing = useRef<boolean>(false)

  const { data: users } = useQueryUser().fetchUserByQuery<User>({ role: to })

  /**
   * Función que se ejecuta cuando se elimina un usuario
   * @param {User} user - Usuario a eliminar, contiene referencias
   */
  const deleteUser = useCallback(async (user: User) => {
    if (isProcessing.current) return
    isProcessing.current = true
    const credential = `${user._id}-${user.uid}`
    await _delete({ id: credential }).then(async () => {
      const files = user.role === 'company'
        ? [{ path: 'company', ref: 'logo' }, { path: 'company', ref: 'signature' }]
        : (user.role === 'client' ? [{ path: 'client', ref: 'logo' }] : []) //empty to collaborators and admin (without photo)
      await Promise.all(files.map(async ({ path, ref }) => await deleteFile({ path: `${path}/${user._id}/preview/${ref}` })))
    }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [_delete, deleteFile])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteUser(onDelete) }, [onDelete, deleteUser])

  return {
    users: useMemo(() => users, [users]),
    handleDelete: (user: User) => setOnDelete(user)
  }
}
/*---------------------------------------------------------------------------------------------------------*/