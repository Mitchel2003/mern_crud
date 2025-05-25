import { User } from "@/interfaces/context.interface"

/*--------------------------------------------------simplify--------------------------------------------------*/
/**
 * Verify if a user has the required metadata (logo or signature)
 * @param user - The user to verify, possibly a company (main or sub)
 * @returns true if the user has at least one of the required metadata
 */
const hasRequiredMetadata = (user?: User): boolean => !!(user?.metadata?.logo || user?.metadata?.signature)

/**
 * Solves the user and company hierarchy to obtain the correct provider data
 * @param user - The user (createdBy) responsible of creating the document
 * @returns The company with the complete data (can be main or sub)
 */
export const resolveProviderHierarchy = (user: User): User | undefined => {
  if (!user) return undefined
  //If it is collaborator, always use its company associated
  if (user.role === 'collaborator' && user.belongsTo) return resolveProviderHierarchy(user.belongsTo)

  //If it is company (main or sub)
  if (user.role === 'company') {
    //If this company has the required metadata
    if (hasRequiredMetadata(user)) return user
    //If it doesn't have metadata but has belongsTo (company.sub), search in its main company
    if (user.belongsTo) return resolveProviderHierarchy(user.belongsTo)
  }
  return user //To any other user, return it directly
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------performance--------------------------------------------------*/
/**
 * Implementación de un limitador de concurrencia (Promise Pool)
 * @param tasks - Array de tareas a ejecutar, + rendimiento db
 * @param concurrency - Número máximo de tareas concurrentes
 * @returns Promise con el resultado de todas las tareas
 */
export const promisePool = async <T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> => {
  const results: T[] = new Array(tasks.length)
  let counter = 0 //counter to progresive execute
  const executor = async (): Promise<void> => {
    while (counter < tasks.length) {
      const taskIndex = counter++
      //save result in the original position
      try { results[taskIndex] = await tasks[taskIndex]() }
      catch (error) { results[taskIndex] = Promise.reject(error) as any }
    }
  } //create pool execution según el límite de concurrencia according limit concurrency
  const executors = Array.from({ length: Math.min(concurrency, tasks.length) }, () => executor())
  await Promise.all(executors)
  return results
}