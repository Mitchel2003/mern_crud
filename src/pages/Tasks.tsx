import { useTasks } from "../context/TaskContext";
import { useEffect } from "react";

import TaskCard from "../components/tasks/TaskCard";

function Tasks() {
  const { tasks, errors, getTasks } = useTasks();

  useEffect(() => { getTasks() }, []);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}
      {tasks.map((e, i) => <TaskCard key={i} task={e} />)}
    </div>
  )
}

export default Tasks