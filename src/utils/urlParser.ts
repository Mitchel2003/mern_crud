export const getUid = (url: string | null) => {
  if (!url) return 'uid firebase not found'
  const decodedUrl = decodeURIComponent(url)
  const urlParams = new URL(decodedUrl)
  return urlParams.searchParams.get('uid')
}