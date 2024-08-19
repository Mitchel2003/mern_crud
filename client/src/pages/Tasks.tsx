import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";

function Tasks() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => { getTasks() }, [])
  return (
    <>
      <div>Tasks</div>
      {tasks.map((e, i) => (
        <div key={i} className="backdrop-grayscale-0 rounded-2xl border border-red-300">
          <div className="flex justify-center">
            <h1 className="font-bold">ID: {e._id}</h1>
          </div>
          <h3>Title: {e.title}</h3>
          <h3>Description: {e.description}</h3>
        </div>
      ))}
    </>
  )
}

export default Tasks