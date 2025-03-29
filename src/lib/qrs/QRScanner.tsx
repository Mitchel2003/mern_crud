import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { useEffect, useRef } from "react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
  fps?: number
  qrbox?: { width: number; height: number }
}

export const QRScanner = ({
  onScanSuccess,
  onScanError,
  fps = 10,
  qrbox = { width: 250, height: 250 }
}: QRScannerProps) => {
  const qrRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    // Configuración avanzada del escáner
    const config = {
      fps,
      qrbox,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      aspectRatio: 1.0,
      disableFlip: false,
      videoConstraints: {
        facingMode: { ideal: "environment" }, // Usar cámara trasera por defecto
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    }

    // Inicializar el escáner con verbose para debugging
    const qrScanner = new Html5Qrcode("qr-reader", /* verbose= */ true)
    qrRef.current = qrScanner

    // Obtener cámaras disponibles
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          // Intentar encontrar la cámara trasera
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('trasera') ||
            device.label.toLowerCase().includes('rear')
          )
          
          const cameraId = backCamera?.id || devices[0].id
          
          // Iniciar escaneo con la cámara seleccionada
          qrScanner
            .start(
              cameraId,
              config,
              (decodedText) => {
                onScanSuccess(decodedText)
              },
              (errorMessage) => {
                // Filtrar mensajes de error no críticos
                if (!errorMessage.includes('MultiFormat')) {
                  onScanError?.(errorMessage)
                }
              }
            )
            .catch(err => {
              onScanError?.(`Error al iniciar el escáner: ${err?.toString()}`)
            })
        } else {
          onScanError?.('No se encontraron cámaras disponibles')
        }
      })
      .catch(err => {
        onScanError?.(`Error al acceder a la cámara: ${err?.toString()}`)
      })

    // Cleanup al desmontar
    return () => {
      if (qrRef.current?.isScanning) {
        qrRef.current
          .stop()
          .catch(err => console.error('Error al detener el escáner:', err))
      }
    }
  }, [fps, qrbox.width, qrbox.height, onScanSuccess, onScanError])

  return (
    <div className="qr-container relative">
      <div 
        id="qr-reader" 
        className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: qrbox.width,
            height: qrbox.height,
            border: '2px solid #22c55e',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>
    </div>
  )
}