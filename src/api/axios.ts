import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://rest-api-qvo9.onrender.com/api'
    : 'http://localhost:4000/api',
  withCredentials: true
})

export default instance