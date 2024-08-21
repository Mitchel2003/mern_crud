import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useTasks } from "../context/TaskContext";

function TaskForm() {
  const { register, handleSubmit, setValue, formState: { errors: errsForm } } = useForm();
  const { tasks, errors, getTask, createTask } = useTasks();
  const { id = 'new' } = useParams();

  useEffect(() => { loadTaskParam() }, [])

  if (tasks.length > 0) {
    setValue('title', tasks[0].title)
    setValue('description', tasks[0].description)
  }
  const loadTaskParam = async () => { if (id === 'new') return; getTask(id) }
  const onSubmit = handleSubmit(async (values) => createTask(values));
  return (
    <>
      <div>TaskForm</div>
      <form onSubmit={onSubmit}>

        {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}

        <input
          type="text"
          placeholder="Title"
          {...register('title', { required: true })}
        />

        {errsForm.title && (<p className="text-red-500">Title is required</p>)}

        <textarea
          className="text-black"
          placeholder="Description"
          {...register('description', { required: true })}
        />

        {errsForm.description && (<p className="text-red-500">Description is required</p>)}

        <button type="submit"> Save </button>
      </form>
    </>
  )
}

export default TaskForm