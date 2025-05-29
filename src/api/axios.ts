import { setupCache } from 'axios-cache-interceptor'
import axios, { AxiosResponse } from "axios"
import { baseUrl } from '@/utils/config'

/**
 * Axios instance configured for the API
 * Includes interceptors to handle authentication tokens and errors
 */
const instance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
  timeout: 10000, //Timeout 10 seconds for all requests
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Interceptors to all requests
 * Adds the token to the request headers if it exists
 */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => { return Promise.reject(error) })

/**
 * Interceptors to all responses
 * - Detects when token is about to expire and triggers renewal
 * - Handles token expired errors and attempts to refresh the token
 */
instance.interceptors.response.use((response: AxiosResponse) => {
  const tokenExpiringHeader = response.headers['x-token-expiring-soon']
  if (tokenExpiringHeader === 'true') { //Check if token is expired
    const tokenExpiringEvent = new CustomEvent('token-expiring')
    window.dispatchEvent(tokenExpiringEvent)
  }
  return response
}, async (error) => {
  const originalRequest = error.config
  //If the error is 401 (Unauthorized) and we haven't tried to renew the token yet
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true //Mark that we've tried to renew
    try {
      const { getRefreshToken } = await import('@/controllers/auth.controller')
      const newToken = await getRefreshToken() //Obtain new token generated
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return instance(originalRequest) //Retry request (new token)
    } catch (e) { //If we can't renew the token, dispatch event
      const tokenExpiredEvent = new CustomEvent('token-expired')
      window.dispatchEvent(tokenExpiredEvent)
    }
  }
  return Promise.reject(error)
})

export default instance
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------cache--------------------------------------------------*/
/**
 * Apply cache configuration to our axios instance
 * with an optimized configuration for maximum performance
 * 
 * Implementation using axios-cache-interceptor that offers:
 * - Persistent storage in localStorage (automatic)
 * - High performance (21x faster than axios normal)
 * - Native support for ETag and Cache-Control headers
 * - Elimination of unnecessary 304 responses
 */
export const cachedAxios = setupCache(instance, {
  ttl: 15 * 60 * 1000, // 15 minutes
  interpretHeader: true,
  methods: ['get'],

  generateKey: (req) => req.url || '',
  debug: process.env.NODE_ENV === 'development' ? (msg) => console.log(`AxiosCache: ${JSON.stringify(msg)}`) : undefined,
  cachePredicate: (response) => { //decides if the response should be cached, returns true by default
    const contentLength = Number(response.headers?.['content-length'] || '0')
    if (contentLength > 200 * 1024) return false //too large to cache (200kb)
    const requestPath = (response.config?.url || '').toLowerCase()
    /**
     * List of sensitive endpoints to avoid cache:
     * - /auth => allow synchronous refresh token
     * - /user(s)? => to avoid cache users (between tables)
     * - /notifications => to avoid cache notifications (freshness)
     * - /signatures => to avoid cache signatures (between different headquarters)
     */
    const sensitivePattern = /\/(user(s)?|auth|notifications|signatures)\/?(?:\?|$)/i
    if (sensitivePattern.test(requestPath)) return false

    /**
     * List of urls to ignore, to avoid cache:
     * - /client/preview/:id => client preview page (refreshes every time)
     */
    const routePattern = /\/client\/preview\/\w+$/i
    if (routePattern.test(requestPath)) return false
    return true
  }
})
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Invalida la caché tanto en axios como en React Query
 * @param url - La URL a invalidar cache (para axios)
 */
export const invalidateCache = (url: string): void => {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  const [_empty, ...urlParts] = normalizedUrl.split('/')
  if (!cachedAxios.storage) return
  cachedAxios.storage.remove(normalizedUrl)
  //if it's a nested endpoint, invalidate the parent collection as well
  if (urlParts.length >= 2) { cachedAxios.storage.remove(`/${urlParts[0]}/${urlParts[1]}`) }
  if (url.includes('/form/') || url.includes('/location/')) { cachedAxios.storage.clear?.() }
}