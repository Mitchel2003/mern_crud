import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { id = 'new' } = useParams();
  const navigate = useNavigate();

  const { data: task, error, isLoading } = useQuery({ //query react defined
    queryKey: ['task', id],
    queryFn: ({ queryKey }) => getTask(queryKey[1]),
    enabled: id !== 'new'
  });

  useEffect(() => {
    if (!task || id === 'new') return;
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('date', dayjs(task.date).utc().format('YYYY-MM-DD'));
  }, [task]);

  const mutation = useMutation({ //configurate data mutation
    mutationFn: (data: object) => id !== 'new' ? updateTask(id, data) : createTask(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }) } // Invalidate and refetch
  });

  const onSubmit = handleSubmit(async (values) => {
    const data = schemaTask(values);
    mutation.mutate(data);
    navigate('/tasks');
  })

  if (error) return (<div className="bg-red-600"> <h1 className="text-white"> {error.message} </h1> </div>)
  if (isLoading) return (<h1 className="font-bold text-2xl"> Cargando... </h1>)

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
          {...register('date')}
        />

        <button type="submit" className="bg-indigo-500 px-3 py-2 mt-3 rounded-md"> Save </button>

      </form>
    </div>
  )
}

export default TaskForm

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Helps us to build a task format and send request like create or update
 * @param values its a data object that represent the fields on form context
 * @returns {object} a object that mean the task schema to use on request
 */
function schemaTask(values: FieldValues): object { return { ...values, date: dateFormat(values.date) } }
/**
 * Allows us obtain the date formated from client side (<input type="date"/>)
 * @param date Correspond to date in string format (DD/MM/YYYY)
 * @returns {Date} its a date; if the input dont have something this method returns the current date 
 */
function dateFormat(date?: string): Date { return new Date(dayjs.utc(date || undefined).format()) }