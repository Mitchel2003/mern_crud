import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isAuth, errors: errs } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuth) return navigate("/tasks") }, [isAuth]);

  const onSubmit = handleSubmit(async (values) => signup(values));

  return (
    <>
      <div>Register</div>
      <form onSubmit={onSubmit} >
                                                
        { errs.map((e, index) => (<div className="bg-red-500 text-white" key={index}> {e} </div>)) }
        
        <input type="text" placeholder="Username" autoFocus {...register('username', { required: true })} />
        {errors.username && (<p className="text-red-500">Username is required</p>)}
        <input type="email" placeholder="Email" {...register('email', { required: true })} />
        {errors.email && (<p className="text-red-500">Email is required</p>)}
        <input type="password" placeholder="Password" {...register('password', { required: true })} />
        {errors.password && (<p className="text-red-500">Password is required</p>)}
        <button type="submit"> Submit </button>
      </form>
    </>
  )
}

export default Register
