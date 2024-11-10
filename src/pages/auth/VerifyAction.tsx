import { useSearchParams } from 'react-router-dom'
import { verifyActionRequest } from '@/api/auth'
import { getParams } from '@/utils/urlParser'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

function VerifyAction() {
  const [searchParams] = useSearchParams()
  const continueUrl = searchParams.get('continueUrl')
  const oobCode = searchParams.get('oobCode')
  const mode = searchParams.get('mode')
  const { toast } = useToast();

  useEffect(() => { validateAction() }, [])

  const validateAction = async () => {
    const userCredentials = getParams(continueUrl)

    console.log(mode);
    console.log(oobCode);
    console.log(userCredentials);
    const res = await verifyActionRequest(mode || '', { ...userCredentials, oobCode })
    toast({
      title: 'request success',
      description: `${res.data}`,
      variant: 'default'
    })
  }

  return <div>Verificando acción...</div>
}

export default VerifyAction