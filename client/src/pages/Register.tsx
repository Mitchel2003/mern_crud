import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth";

function Register() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async(values) => {
    const req = await registerRequest(values);
    console.log(req);
  })

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
