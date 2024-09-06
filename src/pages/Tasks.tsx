import { useTasks } from "../context/TaskContext";
import { useQuery } from "@tanstack/react-query";

import TaskCard from "../components/tasks/TaskCard";

function Tasks() {
  const { errors, getTasks } = useTasks();
  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks()
  });

  if (error) return (<h1> {error.message} </h1>)
  if (isLoading) return (<h1> Cargando... </h1>)

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}
      {tasks?.map((e, i) => <TaskCard key={i} task={e} />)}
    </div>
  )
}

export default Tasks