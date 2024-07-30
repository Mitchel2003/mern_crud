import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth";

function Register() {
  const { register, handleSubmit } = useForm();

  return (
    <>
      <div>Register</div>
      <form onSubmit={handleSubmit(async (values) => await registerRequest(values))} >
        <input type="text" placeholder="Username" autoFocus {...register('username', { required: true })} />
        <input type="email" placeholder="Email" {...register('email', { required: true })} />
        <input type="password" placeholder="Password" {...register('password', { required: true })} />
        <button type="submit"> Submit </button>
      </form>
    </>
  )
}

export default Register
