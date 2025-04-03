import config from '@/utils/config'
import axios from "axios"

const instance = axios.create({
  baseURL: config.nodeEnv === 'production'
    ? 'https://rest-api-qvo9.onrender.com/api'
    : 'http://localhost:4000/api',
  withCredentials: true
})

export default instance