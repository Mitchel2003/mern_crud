import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { register, handleSubmit, formState: { errors: errsForm } } = useForm();
  const { signin, isAuth, errors = [] } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuth) return navigate('/tasks') }, [isAuth]);
  const onSubmit = handleSubmit(async (data) => signin(data));
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md">
        <h1 className="text-3xl font-bold my-2"> Login </h1>

        <form onSubmit={onSubmit}>

          {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white text-center my-2"> {e} </div>))}

          <input
            type="email"
            autoComplete="on"
            placeholder="Email"
            className="bg-zinc-700 text-white w-full px-4 py-2 my-2 rounded-md"
            {...register('email', { required: true })}
          />

          {errsForm.email && (<p className="text-red-500"> Email is required </p>)}

          <input
            type="password"
            autoComplete="off"
            placeholder="Password"
            className="bg-zinc-700 text-white w-full px-4 py-2 my-2 rounded-md"
            {...register('password', { required: true })}
          />

          {errsForm.password && (<p className="text-red-500"> Password is required </p>)}

          <button type="submit" className="bg-sky-600 hover:bg-sky-700 px-4 py-2 mt-2 rounded-md"> Submit </button>

        </form>
      </div>
    </div>
  )
}

export default Login