import { Link } from "react-router-dom";

import { useFavoriteTask } from "../../store/favoriteTask";
import { TaskCardProps } from "../../interfaces/props.interface";
import { useCustomMutation } from "../../hooks/useTasks";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(utc)

function TaskCard({ task, isFavorite }: TaskCardProps) {
  const addFavorite = useFavoriteTask(state => state.addFavoriteTask)
  const removeFavorite = useFavoriteTask(state => state.removeFavoriteTask)
  const mutation = useCustomMutation().deleteTask();
  /**
   * Handler that execute a custom mutation (Query React); this way we can fetch and put data on cache to evade refetchs
   * @returns a method to remove and agree task favorite depending from Props obtained
   */
  const handleDelete = () => mutation.mutate(task._id)
  /**
   * Helps us to toggle the state favorite task using local store (Zustand)
   * @returns {void} a method to remove and agree task favorite depending from Props obtained
   */
  const handleFavorite = () => isFavorite ? removeFavorite(task._id) : addFavorite(task._id)

  return (
    <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md">
      <h1 className="text-2xl font-bold"> {task.title} </h1>
      <p className="text-slate-300"> Description: {task.description} </p>
      <p className="text-slate-300"> Date: {dayjs(task?.date ?? '').utc().format("DD/MM/YYYY")} </p>

      <div className="flex items-center mt-2 gap-x-2">
        <button
          onClick={handleFavorite}
          className={`
            text-white px-4 py-2 rounded-md
            ${isFavorite
              ? 'bg-fuchsia-600 hover:bg-fuchsia-700'
              : 'bg-gray-600 hover:bg-gray-700'}
          `}
        >
          &#11088;
        </button>

        <Link
          to={`/task/${task._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>

      </div>
    </div>
  )
}

export default TaskCard