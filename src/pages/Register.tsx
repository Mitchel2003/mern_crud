import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useAuthContext } from "../context/AuthContext"

function Register() {
  const { register, handleSubmit, formState: { errors: errsForm } } = useForm();
  const { signup, isAuth, errors = [] } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => { if (isAuth) return navigate('/tasks') }, [isAuth]);
  const onSubmit = handleSubmit(async (values) => signup(values));
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md">
        <h1 className="text-3xl font-bold my-2"> Register </h1>

        <form onSubmit={onSubmit}>

          {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white text-center my-2"> {e} </div>))}

          <input
            type="text"
            autoComplete="off"
            placeholder="Username"
            className="bg-zinc-700 text-white w-full px-4 py-2 my-2 rounded-md"
            {...register('username', { required: true })}
          />

          {errsForm.username && (<p className="text-red-500">Username is required</p>)}

          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            className="bg-zinc-700 text-white w-full px-4 py-2 my-2 rounded-md"
            {...register('email', { required: true })}
          />

          {errsForm.email && (<p className="text-red-500">Email is required</p>)}

          <input
            type="password"
            autoComplete="off"
            placeholder="Password"
            className="bg-zinc-700 text-white w-full px-4 py-2 my-2 rounded-md"
            {...register('password', { required: true })}
          />

          {errsForm.password && (<p className="text-red-500">Password is required</p>)}

          <button type="submit" className="bg-sky-600 hover:bg-sky-700 px-4 py-2 mt-2 rounded-md"> Submit </button>

        </form>
      </div>
    </div>
  )
}

export default Register