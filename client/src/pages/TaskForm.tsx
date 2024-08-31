import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useTasks } from "../context/TaskContext";
import { FieldValues } from 'react-hook-form';
import utc from "dayjs/plugin/utc"
import dayjs from "dayjs";
dayjs.extend(utc)

function TaskForm() {
  const { register, handleSubmit, setValue, formState: { errors: errsForm } } = useForm();
  const { errors, getTask, createTask, updateTask } = useTasks();
  const { id = 'new' } = useParams();
  const navigate = useNavigate();

  useEffect(() => { preloadTask() }, [])

  const preloadTask = async () => {
    if (id === 'new') return;
    const res = await getTask(id);
    setValue('title', res.title);
    setValue('description', res.description);
  }

  const onSubmit = handleSubmit(async (values) => {
    const task = schemaTask(values);
    if (id === 'new') { createTask(task) }
    else { updateTask(id, task) }
    navigate('/tasks');
  })

  return (
    <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

      {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}

      <form onSubmit={onSubmit}>

        <label> Title </label>
        <input
          type="text"
          placeholder="Title"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          {...register('title', { required: true })}
        />

        {errsForm.title && (<p className="text-red-500">Title is required</p>)}

        <label> Description </label>
        <textarea
          placeholder="Description"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          {...register('description', { required: true })}
        />

        {errsForm.description && (<p className="text-red-500">Description is required</p>)}

        <label> Date </label>
        <input
          type="date"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
          {...register('date', { required: true })}
        />

        {errsForm.date && (<p className="text-red-500">Date is required</p>)}

        <button type="submit" className="bg-indigo-500 px-3 py-2 rounded-md"> Save </button>

      </form>
    </div>
  )
}

export default TaskForm

/*--------------------------------------------------tools--------------------------------------------------*/
function schemaTask(values: FieldValues) {
  return { ...values, date: dayjs.utc(values.date).format() }
}