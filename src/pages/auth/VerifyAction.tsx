import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function VerifyAction() {
  const [searchParams] = useSearchParams()
  const continueUrl = searchParams.get('continueUrl')
  const oobCode = searchParams.get('oobCode')
  const mode = searchParams.get('mode')

  useEffect(() => { validateAction() }, [])
  const validateAction = async () => { console.log(mode, oobCode, continueUrl) }

  return <div>Verificando acción...</div>
}