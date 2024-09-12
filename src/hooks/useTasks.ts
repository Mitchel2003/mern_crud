import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { CustomMutation } from "../interfaces/props.interface";
import { useTaskContext } from "../context/TaskContext";

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useFetchTask = (id: string) => {
  const { getTask } = useTaskContext();
  return useQuery({
    queryKey: ['task', id],
    queryFn: ({ queryKey }) => getTask(queryKey[1]),
    enabled: id !== 'new'
  });
}
export const useFetchTasks = () => {
  const { getTasks } = useTaskContext();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks()
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/**
 * Allows us prepare the useMutation according to a especific request, we use axios to call the api
 * @returns {CustomMutation} provide methods that implement useMutationResult
 * @example
 *  const mutation = useCustomMutation().create();
 *  mutation.mutate(id);
 */
export function useCustomMutation(): CustomMutation {
  // to use QueryClientProvider
  const queryClient = useQueryClient();
  /**
   * Execute a request condicionally based on id param
   * @param id Correspond to idTask from url params to actions create or update
   */
  const createOrUpdateTask = (id: string) => {
    const { createTask, updateTask } = useTaskContext();
    return useMutation({
      mutationFn: (data: object) => id !== 'new' ? updateTask(id, data) : createTask(data),
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
    });
  }
  /** Execute a request to delete a task by them id */
  const deleteTask = () => {
    const { deleteTask } = useTaskContext();
    return useMutation({
      mutationFn: (id: string) => deleteTask(id),
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
    });
  }
  return { createOrUpdateTask, deleteTask }
}
/*---------------------------------------------------------------------------------------------------------*/