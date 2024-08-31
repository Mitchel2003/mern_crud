import { Link } from "react-router-dom";

import { TaskCardProps } from "../../interfaces/props.interface"
import { useTasks } from "../../context/TaskContext"
import utc from "dayjs/plugin/utc"
import dayjs from "dayjs";
dayjs.extend(utc)

function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useTasks();

  const actionDelete = () => deleteTask(task._id)
  return (
    <>
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">Title: {task.title}</h1>
          <div className="flex gap-x-2 items-center">
            <Link to={`/task/${task._id}`}> Edit </Link>
            <button onClick={actionDelete}> Delete </button>
          </div>
        </header>
        <p className="text-slate-300">Description: {task.description}</p>
        <p className="text-slate-300">Date: {dayjs(task?.date ?? '').utc().format("DD/MM/YYYY")}</p>
      </div>
    </>
  )
}

export default TaskCard