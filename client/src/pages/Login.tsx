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
    <>
      <div>Login</div>
      <form onSubmit={onSubmit}>

        {errors.map((e, i) => (<div key={i} className="bg-red-500 text-white"> {e} </div>))}

        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: true })}
        />

        {errsForm.email && (<p className="text-red-500"> Email is required </p>)}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />

        {errsForm.password && (<p className="text-red-500"> Password is required </p>)}

        <button type="submit"> Submit </button>

      </form>
    </>
  )
}

export default Login