import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { register, handleForm, formState: { errors } } = useForm(); 
  const { signin, errors: errs } = useAuth();

  const onSubmit = handleForm(async (data) => signin(data));
  
  return (
    <div>Login</div>
    { errs.map((e, index) => (<div className="bg-red-500 text-white" key={index}> {e} </div>)) }
    <form onSubmit={onSubmit}>
      <input type="email" placeholder="Email" {...register('email', { required: true })}/>
      <input type="password" placeholder="Password" {...register('password', { required: true })}/>
      <button type="submit"> Submit </button>
    </form>
  )
}

export default Login
