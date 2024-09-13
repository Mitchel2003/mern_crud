import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { CustomMutation, QueryReact } from "../interfaces/props.interface";
import { useTaskContext } from "../context/TaskContext";

/*--------------------------------------------------useQuery--------------------------------------------------*/
/**
 * With this method we can use "ReactQuery" hook to handle queries and mutation data of way reactive; we use axios to operate request
 * @returns {QueryReact} provide methods that implement useQueryResult
 * @example
 *  const { fetchTask } = useQueryReact();
 *  const { data: task, error, isLoading } = fetchTask(id_task);
 * @description through a key "queryKey" we can handle status;
 */
export function useQueryReact(): QueryReact {
  /**
   * Execute a request of a task by them id
   * @param id - Correspond to "_id" of the task in context
   */
  const fetchTask = (id: string) => {
    const { getTask } = useTaskContext();
    return useQuery({
      queryKey: ['task', id],
      queryFn: ({ queryKey }) => getTask(queryKey[1]),
      enabled: id !== 'new'
    });
  }
  /** Execute a request that returns all tasks from user context */
  const fetchTasks = () => {
    const { getTasks } = useTaskContext();
    return useQuery({
      queryKey: ['tasks'],
      queryFn: () => getTasks()
    });
  }
  return { fetchTask, fetchTasks }
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
   * @param id - Correspond to idTask from url params to actions create or update
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