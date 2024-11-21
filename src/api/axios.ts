import axios from "axios";

const instance = axios.create({
  baseURL: 'https://rest-api-qvo9.onrender.com/api', /* to mode production */
  withCredentials: true
})

export default instance

//node_env: development
// http://localhost:5173

// node_env: production
// https://mern-crud-three-lemon.vercel.app