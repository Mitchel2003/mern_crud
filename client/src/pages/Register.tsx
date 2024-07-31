import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext"

function Register() {
  const { register, handleSubmit } = useForm();
  const { signup } = useAuth();
	
  const onSubmit = handleSubmit(async(values) => signup(values));

  return (
    <>
      <div>Register</div>
      <form onSubmit={onSubmit} >
        <input type="text" placeholder="Username" autoFocus {...register('username', { required: true })} />
        <input type="email" placeholder="Email" {...register('email', { required: true })} />
        <input type="password" placeholder="Password" {...register('password', { required: true })} />
        <button type="submit"> Submit </button>
      </form>
    </>
  )
}

export default Register
