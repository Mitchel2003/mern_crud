import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useTasks } from "../context/TaskContext";

function TaskForm() {
  const { register, handleSubmit, formState: { errors: errsForm } } = useForm();
  const { tasks, errors, createTask, getTask } = useTasks();
  const { id } = useParams();

  useEffect(() => { loadTask() }, [])

  const loadTask = async () => { if (!id || id === 'new') return; getTask(id) }
  const onSubmit = handleSubmit(async (values) => createTask(values));
  return (
    <>
      <div>TaskForm</div>
      <form onSubmit={onSubmit}>

        {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}

        <input
          type="text"
          placeholder="Title"
          value={tasks[0]?.title || ''}
          {...register('title', { required: true })}
        />

        {errsForm.title && (<p className="text-red-500">Title is required</p>)}

        <textarea
          className="text-black"
          placeholder="Description"
          value={tasks[0]?.description || ''}
          {...register('description', { required: true })}
        />

        {errsForm.description && (<p className="text-red-500">Description is required</p>)}

        <button type="submit"> Save </button>
      </form>
    </>
  )
}

export default TaskForm