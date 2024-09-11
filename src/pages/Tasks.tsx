import TaskCard from "../components/tasks/TaskCard";
import { useTasks } from "../context/TaskContext";
import { useFetchTasks } from "../hooks/useTasks";
// import { useFavoriteTask } from "../store/favoriteTask";
// import { useStore } from "zustand"

function Tasks() {
  const { data: tasks, error, isLoading } = useFetchTasks();
  // const { favoriteTaskIds } = useFavoriteTask();
  const { errors } = useTasks();

  if (error) return (<h1> {error.message} </h1>)
  if (isLoading) return (<h1> Cargando... </h1>)

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">

      {errors.map((e, i) =>
        <div key={i} className="bg-red-500 text-white"> {e} </div>
      )}

      {tasks?.map((e, i) =>
        <TaskCard
          key={i}
          task={e}
          isFavorite={/*favoriteTaskIds.includes(e._id)*/ true}
        />
      )}

    </div>
  )
}

export default Tasks