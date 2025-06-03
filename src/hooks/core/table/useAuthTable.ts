import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { useFormatMutation } from "@/hooks/query/useFormatQuery"
import { useUserMutation } from "@/hooks/query/useAuthQuery"
import { RoleProps } from "@/interfaces/context.interface"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { useAuthContext } from "@/context/AuthContext"
import { User } from "@/interfaces/context.interface"

/*--------------------------------------------------user table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de usuarios para la tabla */
export const useUserTable = (to: RoleProps) => {
  const [onDelete, setOnDelete] = useState<User | undefined>(undefined)
  const { deleteUser: _delete, updateUser: _update } = useUserMutation()
  const { deleteFile } = useFormatMutation('file')
  const { user: credentials } = useAuthContext()
  const isProcessing = useRef<boolean>(false)

  const isCompany = credentials?.role === 'company'
  const { data: users = [] } = useQueryUser().fetchUserByQuery<User>({ role: to })
  const { data: companies, isLoading: isLoadingCompanies } = useQueryUser().fetchUserByQuery<User>({ role: 'company', enabled: to === 'client' && !!onDelete })
  const { data: collaborators, isLoading: isLoadingCollaborators } = useQueryUser().fetchUserByQuery<User>({ role: 'collaborator', enabled: to === 'client' && !!onDelete })
  const isLoading = isLoadingCompanies || isLoadingCollaborators

  /** Dynamically filter available users based on type table and role context */
  const userFormat = useMemo(() => ( //to table company and collaborator (sort)
    isCompany && to === 'company' ? users?.filter(e => e.belongsTo) //get sub:companies
      : (isCompany && to === 'collaborator' ? users?.filter(e => e.belongsTo?._id === credentials?._id) : users)
  ), [credentials, users, to])

  /**
   * Función que se ejecuta cuando se elimina un usuario
   * @param {User} user - Usuario a eliminar, contiene referencias
   */
  const deleteUser = useCallback(async (user: User) => {
    if ((!companies || !collaborators) && user.role === 'client') return
    if (isProcessing.current) return
    isProcessing.current = true
    const credential = `${user._id}-${user.uid}`
    await _delete({ id: credential }).then(async () => {
      const files = user.role === 'company'
        ? [{ path: 'company', ref: 'logo' }, { path: 'company', ref: 'signature' }]
        : (user.role === 'client' ? [{ path: 'client', ref: 'logo' }] : []) //empty to collaborators and admin (without photo)
      await Promise.all(files.map(async ({ path, ref }) => await deleteFile({ path: `${path}/${user._id}/preview/${ref}` })))
      //Clear residual references; important to avoid errors from unexisting references (clients)
      if (user?.role !== 'client') return //if client, clear residual references (permissions)
      //Remove client_id from permissions field of companies (if exists at least one)
      const coms = companies?.filter((e) => e.permissions?.includes(user._id)) || []
      coms.length > 0 && await Promise.all(coms.map(async (e) => { //at least one
        const permissions = e.permissions?.filter((id) => id !== user._id)
        await _update({ id: e._id, data: { permissions } })
      }))
      //Remove client_id from permissions field of collaborators (if exists at least one)
      const cols = collaborators?.filter((e) => e.permissions?.includes(user._id)) || []
      cols.length > 0 && await Promise.all(cols.map(async (e) => { //at least one
        const permissions = e.permissions?.filter((id) => id !== user._id)
        await _update({ id: e._id, data: { permissions } })
      }))
    }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [_delete, _update, deleteFile, isLoading])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteUser(onDelete) }, [
    isLoading, companies, collaborators,
    onDelete, deleteUser,
  ])

  return {
    users: userFormat,
    handleDelete: (user: User) => setOnDelete(user)
  }
}
/*---------------------------------------------------------------------------------------------------------*/