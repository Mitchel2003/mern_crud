import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTasks } from "../context/TaskContext";
import { Task } from "../interfaces/context.interface";

function TaskForm() { //working here...
  const { register, handleSubmit, setValue, formState: { errors: errsForm } } = useForm();
  const { tasks, errors, getTask, createTask } = useTasks();
  const [loading, setLoading] = useState(true);
  const { id = 'new' } = useParams();
  const navigate = useNavigate();

  useEffect(() => { loadTask() }, [id])

  const loadTask = async () => {
    if (id === 'new') return setFormValues();
    getTask(id);
  }
  const setFormValues = (data?: Task) => {
    setValue('title', data?.title || '');
    setValue('description', data?.description || '');
  };

  if (!loading) { setFormValues(tasks[0]) }

  const onSubmit = handleSubmit(async (values) => { createTask(values); navigate('/tasks') })
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