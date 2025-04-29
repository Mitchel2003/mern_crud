/** @description Utility functions for handling URL query parameters */

/**
 * Encodes an object of query parameters into a URL-safe string
 * @param params - Object containing query parameters
 * @returns URL-encoded string representation of the parameters
 * @example
 * // Returns encoded string like "%7B%22type%22%3A%22maintenance%22%7D"
 * encodeQueryParams({ type: 'maintenance' })
 */
export const encodeQueryParams = (params: Record<string, any>): string => {
  // Filter out undefined values to keep the query string clean
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))
  return encodeURIComponent(JSON.stringify(filteredParams))
}

/**
 * Decodes a URL-encoded query string back into an object
 * @param encodedParams - URL-encoded string of parameters
 * @returns Object containing the decoded parameters
 * @example
 * // Returns { type: 'maintenance' }
 * decodeQueryParams("%7B%22type%22%3A%22maintenance%22%7D")
 */
export const decodeQueryParams = <T = Record<string, any>>(encodedParams: string): T => {
  try { return JSON.parse(decodeURIComponent(encodedParams)) as T }
  catch (error) { console.error('Failed to decode query parameters:', error); return {} as T }
}
