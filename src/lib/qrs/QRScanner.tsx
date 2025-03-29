import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState, CameraDevice } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  qrbox?: { width: number; height: number }
  onScanError?: (error: string) => void
  fps?: number
  isScanning?: boolean // Nuevo prop para controlar externamente el estado del escáner
}

export const QRScanner = ({
  qrbox = { width: 250, height: 250 },
  isScanning = true, // Por defecto el escáner está activo
  onScanSuccess,
  onScanError,
  fps = 5, // Reducido a 5 fps para evitar problemas en dispositivos Android
}: QRScannerProps) => {
  const qrRef = useRef<Html5Qrcode | null>(null)
  const [cameraList, setCameraList] = useState<CameraDevice[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>("")
  const [scannerActive, setScannerActive] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const getCameraList = async () => {
    try {
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length) {
        setCameraList(devices)
        // Try to find the back camera
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

  const startScanning = async () => {
    if (!qrRef.current || !selectedCameraId) return false
    try {
      // Config qr scanner
      const config = {
        fps,
        qrbox,
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: "environment",
          deviceId: selectedCameraId,
          width: { ideal: 1280 }, height: { ideal: 720 }
        },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      }

      await qrRef.current.start(selectedCameraId, config,
        // Detener el escáner inmediatamente después de detectar un código
        (decodedText) => { stopScanning().then(() => { onScanSuccess(decodedText) }) },
        // Filtrar mensajes de error no críticos
        (errorMessage) => { if (!errorMessage.includes('MultiFormat')) { console.warn("QR Scanner warning:", errorMessage) } }
      )
      setScannerActive(true)
      setError("")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      // handle errors
      if (errorMessage.includes('NotReadableError')) { setError("No se pudo acceder a la cámara. Intente cerrar otras aplicaciones que puedan estar usando la cámara."); onScanError?.("No se pudo acceder a la cámara. Intente cerrar otras aplicaciones que puedan estar usando la cámara.") }
      else { setError(`Error al iniciar el escáner: ${errorMessage}`); onScanError?.(`Error al iniciar el escáner: ${errorMessage}`) }
      return false
    }
  }

  const stopScanning = async () => {
    if (!qrRef.current) return
    try {
      if (qrRef.current.getState() === Html5QrcodeScannerState.SCANNING) { await qrRef.current.stop(); setScannerActive(false) }
    } catch (err) { console.error("Error al detener el escáner:", err) }
  }

  const switchCamera = async () => {
    await stopScanning()
    if (cameraList.length <= 1) return
    // Find the index of the current camera
    const currentIndex = cameraList.findIndex(camera => camera.id === selectedCameraId)
    const nextIndex = (currentIndex + 1) % cameraList.length
    setSelectedCameraId(cameraList[nextIndex].id)
  }

  useEffect(() => {// Initialize the scanner
    const initScanner = async () => {
      // Initialize the scanner with verbose for debugging
      const qrScanner = new Html5Qrcode("qr-reader", true)
      qrRef.current = qrScanner
      // Get list of cameras (permissions will be handled automatically by the browser)
      const hasCameras = await getCameraList()
      // Wait a bit before starting the scan to avoid issues
      if (hasCameras && isScanning) { setTimeout(() => { startScanning() }, 500) }
    }

    setTimeout(() => {// Timeout to avoid double rendering issues
      const container = document.getElementById("qr-reader")
      if (container && container.innerHTML === "") { initScanner() }
    }, 0)

    return () => {// Cleanup when component unmounts
      if (qrRef.current) {
        stopScanning().then(() => {
          if (qrRef.current) {// free resources
            try { qrRef.current.clear(); qrRef.current = null }
            catch (err) { console.error("Error al limpiar el escáner:", err) }
          }
        })
      }
    }
  }, []) // Only executed once when the component mounts


  useEffect(() => {// control scanner state when isScanning changes
    if (qrRef.current) {
      if (isScanning && !scannerActive && selectedCameraId) { startScanning() }
      else if (!isScanning && scannerActive) { stopScanning() }
    }
  }, [isScanning, scannerActive, selectedCameraId])


  useEffect(() => {// reboot scanner when camera changes
    if (selectedCameraId && qrRef.current && isScanning) {
      stopScanning().then(() => { setTimeout(() => { startScanning() }, 500) })
    }
  }, [selectedCameraId])

  return (
    <div className="qr-container relative">
      <div id="qr-reader" className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden" />
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
          aria-label="Cambiar cámara"
          className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
        >
          <svg
            width="20"
            fill="none"
            height="20"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"></path>
            <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="m18 22-3-3 3-3"></path>
            <path d="m6 2 3 3-3 3"></path>
          </svg>
        </button>
      )}
    </div>
  )
}