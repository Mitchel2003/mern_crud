import { useNotification } from "@/hooks/ui/useNotification"
import { QRScanner } from "@/lib/qrs/QRScanner"
import { Card, CardContent } from "#/ui/card"
import { Camera, Copy } from "lucide-react"
import { Button } from "#/ui/button"
import { useState } from "react"

export const ScannerHub = () => {
  const { notifySuccess, notifyError } = useNotification()
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  const handleScanSuccess = (decodedText: string) => {
    setLastScanned(decodedText)
    notifySuccess({
      title: "QR escaneado correctamente",
      message: "El código ha sido detectado y copiado al portapapeles"
    })
    navigator.clipboard.writeText(decodedText)
      .catch(() => notifyError({
        title: "Error",
        message: "No se pudo copiar al portapapeles"
      }))
  }

  const handleScanError = (error: string) => {
    // Solo notificar errores críticos
    if (!error.includes('MultiFormat')) {
      notifyError({
        title: "Error al escanear QR",
        message: error
      })
    }
  }

  const handleCopyToClipboard = () => {
    if (lastScanned) {
      navigator.clipboard.writeText(lastScanned)
        .then(() => notifySuccess({
          title: "Copiado",
          message: "Contenido copiado al portapapeles"
        }))
        .catch(() => notifyError({
          title: "Error",
          message: "No se pudo copiar al portapapeles"
        }))
    }
  }

  const toggleScanner = () => setIsScanning(prev => !prev)

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Escáner QR</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleScanner}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {isScanning ? (
            <div className="space-y-4">
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                fps={10}
                qrbox={{ width: 250, height: 250 }}
              />
              <p className="text-sm text-muted-foreground text-center">
                Coloca un código QR frente a la cámara para escanearlo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">Último código escaneado:</p>
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm break-all">
                      {lastScanned || 'Ningún código escaneado aún'}
                    </p>
                    {lastScanned && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyToClipboard}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}