import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/tasks/TaskCard";

function Tasks() {
  const { tasks, errors, getTasks } = useTasks();

  useEffect(() => { getTasks() }, [])
  return (
    <div className="grid-cols-3 gap-2">
      {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}
      {tasks.map((e, i) => <TaskCard key={i} task={e} />)}
    </div>
  )
}

export default Tasks