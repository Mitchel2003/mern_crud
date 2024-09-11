import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useTasks } from "../context/TaskContext";

const { getTask, getTasks, createTask, updateTask, deleteTask } = useTasks();
const queryClient = useQueryClient();

/*--------------------------------------------------useQuery--------------------------------------------------*/
export const useFetchTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: ({ queryKey }) => getTask(queryKey[1]),
    enabled: id !== 'new'
  });
}

export const useFetchTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks()
  });
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useMutation--------------------------------------------------*/
/**
 * Execute a request using axios to call the api, we can "Create or Update" based on id param
 * @param id Correspond to idTask from url params to actions create or update
 */
export const useMutationCreateOrUpdate = (id: string) => {
  return useMutation({
    mutationFn: (data: object) => id !== 'new' ? updateTask(id, data) : createTask(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
  });
}

export const useMutationDelete = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
  });
}
/*---------------------------------------------------------------------------------------------------------*/