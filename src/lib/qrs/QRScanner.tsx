import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState, CameraDevice } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  qrbox?: { width: number; height: number }
  onScanError?: (error: string) => void
  fps?: number
}

export const QRScanner = ({
  qrbox = { width: 250, height: 250 },
  onScanSuccess,
  onScanError,
  fps = 5, // Reducido a 5 fps para evitar problemas en dispositivos Android
}: QRScannerProps) => {
  const qrRef = useRef<Html5Qrcode | null>(null)
  const [cameraList, setCameraList] = useState<CameraDevice[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>("")
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // Función para obtener la lista de cámaras
  const getCameraList = async () => {
    try {
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length) {
        setCameraList(devices)

        // Intentar encontrar la cámara trasera
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('trasera') ||
          device.label.toLowerCase().includes('rear')
        )

        setSelectedCameraId(backCamera?.id || devices[0].id)
        return true
      } else {
        setError("No se encontraron cámaras disponibles")
        onScanError?.("No se encontraron cámaras disponibles")
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Error al obtener la lista de cámaras: ${errorMessage}`)
      onScanError?.(`Error al obtener la lista de cámaras: ${errorMessage}`)
      return false
    }
  }

  // Función para iniciar el escaneo
  const startScanning = async () => {
    if (!qrRef.current || !selectedCameraId) return false

    try {
      // Configuración avanzada del escáner
      const config = {
        fps,
        qrbox,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          deviceId: selectedCameraId,
          facingMode: "environment",
          width: { ideal: 1280 }, // Reducido para mejor compatibilidad
          height: { ideal: 720 }  // Reducido para mejor compatibilidad
        }
      }

      await qrRef.current.start(
        selectedCameraId,
        config,
        (decodedText) => {
          onScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Filtrar mensajes de error no críticos
          if (!errorMessage.includes('MultiFormat')) {
            console.warn("QR Scanner warning:", errorMessage)
          }
        }
      )

      setIsScanning(true)
      setError("")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Manejo específico para NotReadableError
      if (errorMessage.includes('NotReadableError')) {
        setError("No se pudo acceder a la cámara. Intente cerrar otras aplicaciones que puedan estar usando la cámara.")
        onScanError?.("No se pudo acceder a la cámara. Intente cerrar otras aplicaciones que puedan estar usando la cámara.")
      } else {
        setError(`Error al iniciar el escáner: ${errorMessage}`)
        onScanError?.(`Error al iniciar el escáner: ${errorMessage}`)
      }

      return false
    }
  }

  // Función para detener el escaneo
  const stopScanning = async () => {
    if (!qrRef.current || !isScanning) return

    try {
      if (qrRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        await qrRef.current.stop()
        setIsScanning(false)
      }
    } catch (err) {
      console.error("Error al detener el escáner:", err)
    }
  }

  // Función para cambiar de cámara
  const switchCamera = async () => {
    await stopScanning()

    if (cameraList.length <= 1) return

    // Encontrar el índice de la cámara actual
    const currentIndex = cameraList.findIndex(camera => camera.id === selectedCameraId)
    const nextIndex = (currentIndex + 1) % cameraList.length

    setSelectedCameraId(cameraList[nextIndex].id)
  }

  // Inicializar el escáner
  useEffect(() => {
    const initScanner = async () => {
      // Inicializar el escáner con verbose para debugging
      const qrScanner = new Html5Qrcode("qr-reader", /* verbose= */ true)
      qrRef.current = qrScanner

      // Obtener lista de cámaras (los permisos los manejará el navegador automáticamente)
      const hasCameras = await getCameraList()
      if (hasCameras) {
        // Esperar un poco antes de iniciar el escaneo para evitar problemas
        setTimeout(() => {
          startScanning()
        }, 500)
      }
    }

    initScanner()

    // Cleanup al desmontar
    return () => {
      stopScanning()
      if (qrRef.current) {
        qrRef.current = null
      }
    }
  }, []) // Solo se ejecuta una vez al montar el componente

  // Reiniciar el escaneo cuando cambia la cámara seleccionada
  useEffect(() => {
    if (selectedCameraId && qrRef.current) {
      stopScanning().then(() => {
        // Esperar un poco antes de reiniciar el escaneo
        setTimeout(() => {
          startScanning()
        }, 500)
      })
    }
  }, [selectedCameraId])

  return (
    <div className="qr-container relative">
      <div
        id="qr-reader"
        className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden"
      />

      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-sm">
          {error}
        </div>
      )}

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

      {cameraList.length > 1 && (
        <button
          onClick={switchCamera}
          className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
          aria-label="Cambiar cámara"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </button>
      )}
    </div>
  )
}