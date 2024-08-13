import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { register, handleForm, formState: { errors } } = useForm(); 
  const { signin, errors: errs } = useAuth();

  const onSubmit = handleForm(async (data) => signin(data));
  
  return (
    <div>Login</div>
    { errs.map((e, i) => (<div className="bg-red-500 m-1 text-white" key={i}>{e}</div>)) }
    <form onSubmit={onSubmit}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password"/>
      <button type="onsubmit"> Submit </button>
    </form>
  )
}

export default Login
