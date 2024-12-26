import config from "@/utils/config"
import axios from "axios"

const instance = axios.create({ baseURL: config.backendUrl, withCredentials: true })

instance.interceptors.request.use(
  (config) => {
    const token = axios.defaults.headers.common['Authorization']
    if (token) config.headers['Authorization'] = token
    return config
  }, (error) => Promise.reject(error)
)

export default instance