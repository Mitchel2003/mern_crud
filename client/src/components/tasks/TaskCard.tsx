import { Link } from "react-router-dom";

import { TaskCardProps } from "../../interfaces/props.interface";
import { useTasks } from "../../context/TaskContext";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(utc)

function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useTasks()

  const actionDelete = () => deleteTask(task._id)
  return (
    <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md">
      <h1 className="text-2xl font-bold"> {task.title} </h1>
      <p className="text-slate-300"> Description: {task.description} </p>
      <p className="text-slate-300"> Date: {dayjs(task?.date ?? '').utc().format("DD/MM/YYYY")} </p>

      <div className="flex items-center mt-2 gap-x-2">
        <Link
          to={`/task/${task._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Edit
        </Link>

        <button
          onClick={actionDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard