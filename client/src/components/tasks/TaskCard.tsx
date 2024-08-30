import { useNavigate } from "react-router-dom";
import { TaskCardProps } from "../../interfaces/props.interface"
import { useTasks } from "../../context/TaskContext"

function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, updateTask } = useTasks();
  const navigate = useNavigate();

  const actionDelete = () => deleteTask(task._id);
  const actionUpdate = () => { navigate(`/task/${task._id}`); return () => updateTask(task) }
  return (
    <>
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">Title: {task.title}</h1>
          <div className="flex gap-x-2 items-center">
            <button onClick={actionUpdate}> Edit </button>
            <button onClick={actionDelete}> Delete </button>
          </div>
        </header>
        <p className="text-slate-300">Description: {task.description}</p>
        <p className="text-slate-300">Date: {new Date(task.date ?? '').toLocaleDateString()}</p>
      </div>
    </>
  )
}

export default TaskCard