import { useForm } from "react-hook-form";
import { useTasks } from "../context/TaskContext";

function TaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { tasks, createTask } = useTasks();

  const onSubmit = handleSubmit(async (values) => createTask(values));

  return (
    <>
      <div>TaskForm</div>
      <form onSubmit={onSubmit}>

        <input type="text" placeholder="Title" value={tasks[0]?.title} autoFocus {...register('title', { required: true })} />
        {errors.title && (<p className="text-red-500">Title is required</p>)}

        <textarea className="text-black" placeholder="Description" value={tasks[0]?.description} {...register('description', { required: true })} />
        {errors.description && (<p className="text-red-500">Description is required</p>)}

        <button type="submit" > Save </button>
      </form>
    </>
  )
}

export default TaskForm