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
 * - Handles token expired errors and attempts to refresh the token
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const tokenExpiringHeader = response.headers['x-token-expiring-soon']
    if (tokenExpiringHeader === 'true') {// Check if token is expired
      const tokenExpiringEvent = new CustomEvent('token-expiring')
      window.dispatchEvent(tokenExpiringEvent)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    // If the error is 401 (Unauthorized) and we haven't tried to renew the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Mark that we've tried to renew
      try {
        const { getRefreshToken } = await import('@/controllers/auth.controller')
        const newToken = await getRefreshToken() // Obtain new token generated
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return instance(originalRequest) // Retry request (new token)
      } catch (e) {// If we can't renew the token, dispatch event
        const tokenExpiredEvent = new CustomEvent('token-expired')
        window.dispatchEvent(tokenExpiredEvent)
      }
    }
    return Promise.reject(error)
  }
)

export default instance