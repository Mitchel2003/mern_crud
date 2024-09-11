import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useTasks } from "../context/TaskContext";

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useFetchTask = (id: string) => {
  const { getTask } = useTasks();
  return useQuery({
    queryKey: ['task', id],
    queryFn: ({ queryKey }) => getTask(queryKey[1]),
    enabled: id !== 'new'
  });
}

export const useFetchTasks = () => {
  const { getTasks } = useTasks();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks()
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
export function useCustomMutation() {
  const queryClient = useQueryClient();
  /**
   * Execute a request using axios to call the api, we can "Create or Update" based on id param
   * @param id Correspond to idTask from url params to actions create or update
   */
  const createOrUpdateTask = (id: string) => {
    const { createTask, updateTask } = useTasks();
    return useMutation({
      mutationFn: (data: object) => id !== 'new' ? updateTask(id, data) : createTask(data),
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
    });
  }
  /** Execute a request to delete a task by them id */
  const deleteTask = () => {
    const { deleteTask } = useTasks();
    return useMutation({
      mutationFn: (id: string) => deleteTask(id),
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
    });
  }
  return { createOrUpdateTask, deleteTask }
}
/*---------------------------------------------------------------------------------------------------------*/