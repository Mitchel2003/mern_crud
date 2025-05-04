import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState, CameraDevice } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  qrbox?: { width: number; height: number }
  onScanError?: (error: string) => void
  isScanning?: boolean
  fps?: number
}

export const QRScanner = ({
  qrbox = { width: 250, height: 250 },
  isScanning = true,
  onScanSuccess,
  onScanError,
  fps = 5,
}: QRScannerProps) => {
  const qrRef = useRef<Html5Qrcode | null>(null)
  const [cameraList, setCameraList] = useState<CameraDevice[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>("")
  const [scannerActive, setScannerActive] = useState<boolean>(false)

  const startScanning = async () => {
    if (!qrRef.current || !selectedCameraId) return false
    if (qrRef.current.getState() === Html5QrcodeScannerState.SCANNING) return true
    const config = {// Config qr scanner
      fps, qrbox, aspectRatio: 1.0, disableFlip: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      videoConstraints: { facingMode: "environment", deviceId: selectedCameraId, width: { ideal: 1280 }, height: { ideal: 720 } }
    }
    await qrRef.current.start(selectedCameraId, config,
      (decodedText) => { stopScanning().then(() => { onScanSuccess(decodedText) }) },
      (errorMessage) => { if (!errorMessage.includes('MultiFormat')) { console.warn("QR Scanner warning:", errorMessage) } }
    )
    setScannerActive(true)
    return true
  }

  // Initialize the scanner
  useEffect(() => {
    setTimeout(() => {// Timeout to avoid double rendering issues
      const container = document.getElementById("qr-reader")
      if (container && container.innerHTML === "") { initScanner() }
    }, 100)
    return () => {
      stopScanning()// Cleanup when component unmounts
        .then(() => { if (qrRef.current) { qrRef.current.clear(); qrRef.current = null } })
        .catch(err => { console.error("Error al detener el escáner durante limpieza:", err) })
    }
  }, [])

  // control scanner state when isScanning changes
  useEffect(() => {
    if (!qrRef.current) { return } else { updateScannerState() }
  }, [isScanning, scannerActive, selectedCameraId])

  useEffect(() => {// reboot scanner when camera changes
    if (!selectedCameraId || !qrRef.current || !isScanning) { return } else { restartScanner() }
  }, [selectedCameraId])

  /** Initializes the scanner */
  const initScanner = async () => {
    qrRef.current = new Html5Qrcode("qr-reader", true) // qr scanner instance
    const hasCameras = await getCameraList({ setSelectedCameraId, setCameraList, onScanError })
    if (hasCameras && isScanning) { setTimeout(() => { startScanning() }, 500) }
  }
  /** Restarts the scanner */
  const restartScanner = async () => {
    await stopScanning()
    setTimeout(() => { startScanning() }, 500)
  }
  /** Updates the scanner state */
  const updateScannerState = async () => {
    if (isScanning && !scannerActive && selectedCameraId) { await startScanning() }
    else if (!isScanning && scannerActive) { await stopScanning() }
  }
  /** Stops the scanner accurately */
  const stopScanning = async () => {
    if (!qrRef.current) return
    try { if (qrRef.current.getState() === Html5QrcodeScannerState.SCANNING) { await qrRef.current.stop(); setScannerActive(false) } }
    catch (err) { console.error("Error al detener el escáner:", err) }
  }

  return (
    <div className="qr-container relative">
      <div id="qr-reader" className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden" />
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
          aria-label="Cambiar cámara"
          className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
          onClick={() => switchCamera({ cameraList, selectedCameraId, stopScanning, setSelectedCameraId })}
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface CameraListParams {
  /** Callback function to handle the selected camera ID. */
  setSelectedCameraId: (id: string) => void
  /** Callback function to handle the list of available cameras. */
  setCameraList: (value: CameraDevice[]) => void
  /** Optional callback function to handle scan errors. */
  onScanError?: (error: string) => void
}
/**
 * Get the list of available cameras and select the first one.
 * @returns Promise that resolves to true if cameras are available, false otherwise.
 */
const getCameraList = async ({ setCameraList, setSelectedCameraId, onScanError }: CameraListParams) => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length) {
      setCameraList(devices)// Try to find the back camera
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('trasera') ||
        device.label.toLowerCase().includes('rear')
      )
      setSelectedCameraId(backCamera?.id || devices[0].id)
      return true
    } else {
      onScanError?.("No se encontraron cámaras disponibles")
      return false
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    onScanError?.(`Error al obtener la lista de cámaras: ${errorMessage}`)
    return false
  }
}

interface SwitchCameraParams {
  /** Callback function to handle the selected camera ID. */
  setSelectedCameraId: (id: string) => void
  /** Callback function to handle the list of available cameras. */
  stopScanning: () => Promise<void>
  /** List of available cameras. */
  cameraList: CameraDevice[]
  /** ID of the currently selected camera. */
  selectedCameraId: string
}
/**
 * Switches to the next available camera.
 */
const switchCamera = async ({ cameraList, selectedCameraId, stopScanning, setSelectedCameraId }: SwitchCameraParams) => {
  await stopScanning()
  if (cameraList.length <= 1) return
  const currentIndex = cameraList.findIndex(camera => camera.id === selectedCameraId)
  const nextIndex = (currentIndex + 1) % cameraList.length
  setSelectedCameraId(cameraList[nextIndex].id)
}