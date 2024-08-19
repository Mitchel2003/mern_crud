import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";

function Tasks() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    getTasks();
    console.log(tasks);
  }, []);

  return (
    <>
      <div>Tasks</div>
      {tasks.map((e, i) => (
        <div key={i} className="flex backdrop-grayscale-0 rounded-2xl border border-red-300">
          <h1 className="text-center font-bold" >ID Task: {e._id}</h1>
          <h3>{e.title}</h3>
        </div>
      ))}
    </>
  )
}

export default Tasks