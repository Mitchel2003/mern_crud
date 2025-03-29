import { Html5Qrcode } from "html5-qrcode"
import { useEffect, useRef } from "react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  qrbox?: { width: number; height: number }
  onScanError?: (error: string) => void
  fps?: number
}

const QRScanner = ({ fps = 10, onScanError, onScanSuccess, qrbox = { width: 250, height: 250 } }: QRScannerProps) => {
  const qrRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    // Inicializar el escáner
    const qrScanner = new Html5Qrcode("qr-reader")
    qrRef.current = qrScanner

    // Obtener cámaras disponibles
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices[0].id
        // Iniciar escaneo con la primera cámara
        qrScanner.start(cameraId, { fps, qrbox },
          (decodedText) => {// No detenemos el escáner automáticamente para permitir múltiples escaneos
            onScanSuccess(decodedText)
          },
          (errorMessage) => { onScanError?.(errorMessage) }
        ).catch(err => { onScanError?.(err?.toString() || 'Error starting scanner') })
      }
    }).catch(err => { onScanError?.(err?.toString() || 'Error accessing camera') })

    // Cleanup al desmontar
    return () => { qrRef.current && qrRef.current.stop().catch(err => console.error('Error stopping scanner:', err)) }
  }, [fps, qrbox.width, qrbox.height, onScanSuccess, onScanError])

  return (
    <div className="qr-container">
      <div id="qr-reader" className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden" />
    </div>
  )
}

export default QRScanner