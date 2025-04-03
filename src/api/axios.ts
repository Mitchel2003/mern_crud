import axios, { AxiosResponse } from "axios"
import config from '@/utils/config'

/**
 * Axios instance configured for the API
 * Includes interceptors to handle authentication tokens and errors
 */
const instance = axios.create({
  baseURL: config.nodeEnv === 'production'
    ? 'https://rest-api-qvo9.onrender.com/api'
    : 'http://localhost:4000/api',
  withCredentials: true,
  timeout: 10000, // Timeout of 10 seconds for all requests
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Interceptors to all requests
 * Adds the token to the request headers if it exists
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
  }, (error) => { return Promise.reject(error) }
)

/**
 * Interceptors to all responses
 * - Detects when token is about to expire and triggers renewal
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const tokenExpiringHeader = response.headers['x-token-expiring-soon'];
    if (tokenExpiringHeader === 'true') {// Check if token is expired
      // Dispatch an event that can be caught by the auth service
      const tokenExpiringEvent = new CustomEvent('token-expiring');
      window.dispatchEvent(tokenExpiringEvent);
      console.log('Token is about to expire, renewal needed');
    }
    return response
  }
)

export default instance