import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { verifyActionRequest } from '@/api/auth'
import { getParams } from '@/utils/urlParser'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const continueUrl = searchParams.get('continueUrl')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => { validateEmail() }, [continueUrl])

  const validateEmail = async () => {
    const userCredentials = getParams(continueUrl)
    const res = await verifyActionRequest('verifyEmail', { ...userCredentials })
    setData(res.data)
    setLoading(false);
  }
  if (loading) return <div>Verificando email...</div>
  if (data) return <div>{JSON.stringify(data)}</div>
  
  return <div>Email verificado correctamente</div>
}