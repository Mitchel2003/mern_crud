import { useNotification } from "@/hooks/ui/useNotification"
import QRScanner from "@/lib/scanner/QRScanner"

export const ScannerHub = () => {
  const { notifySuccess, notifyError } = useNotification()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Escáner QR</h1>
      <div className="max-w-md mx-auto">
        <QRScanner
          onScanSuccess={(decodedText) => { notifySuccess({ title: "QR escaneado", message: decodedText }) }}
          onScanError={(error) => { notifyError({ title: "Error al escanear QR", message: error }) }}
          fps={10}
          qrbox={{ width: 250, height: 250 }}
        />
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Coloca un código QR frente a la cámara para escanearlo
        </p>
      </div>
    </div>
  )
}