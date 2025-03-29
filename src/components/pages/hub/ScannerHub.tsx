import { useNotification } from "@/hooks/ui/useNotification"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Copy, ExternalLink } from "lucide-react"
import { isValidUrl } from "@/utils/validation"
import { QRScanner } from "@/lib/qrs/QRScanner"
import { useState, useEffect } from "react"

export const ScannerHub = () => {
  const { notifySuccess, notifyError, notifyInfo } = useNotification()
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [isUrl, setIsUrl] = useState(false)

  // Verificar si el texto escaneado es una URL válida
  useEffect(() => {
    if (lastScanned) {
      setIsUrl(isValidUrl(lastScanned))
    } else {
      setIsUrl(false)
    }
  }, [lastScanned])

  const handleScanSuccess = (decodedText: string) => {
    setLastScanned(decodedText)
    setIsScanning(false) // Pausar el escáner al detectar un código

    // Verificar si es una URL
    const isValidLink = isValidUrl(decodedText)

    if (isValidLink) {
      notifySuccess({
        title: "URL detectada",
        message: "Se ha detectado una URL válida. Puede visitarla o copiarla."
      })
    } else {
      notifySuccess({
        title: "QR escaneado correctamente",
        message: "El contenido ha sido detectado y está listo para copiar."
      })
    }

    // Intentar copiar al portapapeles
    try {
      navigator.clipboard.writeText(decodedText)
        .then(() => {
          notifyInfo({
            title: "Copiado",
            message: "Contenido copiado al portapapeles"
          })
        })
        .catch(() => {
          console.warn("No se pudo copiar automáticamente")
        })
    } catch (err) {
      console.warn("Error al intentar copiar:", err)
    }
  }

  const handleScanError = (error: string) => {
    // Solo notificar errores críticos y no repetitivos
    if (!error.includes('MultiFormat')) {
      notifyError({
        title: "Error al escanear QR",
        message: error
      })
    }
  }

  const handleCopyToClipboard = () => {
    if (!lastScanned) return

    try {
      navigator.clipboard.writeText(lastScanned)
        .then(() => {
          notifySuccess({
            title: "Copiado",
            message: "Contenido copiado al portapapeles"
          })
        })
        .catch((err) => {
          console.error("Error al copiar:", err)
          notifyError({
            title: "Error",
            message: "No se pudo copiar al portapapeles. Su navegador puede no soportar esta función."
          })
        })
    } catch (err) {
      console.error("Error al intentar copiar:", err)
      notifyError({
        title: "Error",
        message: "No se pudo copiar al portapapeles"
      })
    }
  }

  const handleOpenUrl = () => {
    if (!lastScanned || !isUrl) return

    try {
      // Abrir en la misma pestaña
      window.location.href = lastScanned
    } catch (err) {
      console.error("Error al abrir URL:", err)
      notifyError({
        title: "Error",
        message: "No se pudo abrir la URL"
      })
    }
  }

  const toggleScanner = () => {
    setIsScanning(prev => !prev)
  }

  const resetScanner = () => {
    setLastScanned(null)
    setIsScanning(true)
  }

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
              title={isScanning ? "Pausar escáner" : "Activar escáner"}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {isScanning ? (
            <div className="space-y-4">
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                fps={5}
                qrbox={{ width: 250, height: 250 }}
              />
              <p className="text-sm text-muted-foreground text-center">
                Coloca un código QR frente a la cámara para escanearlo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">Contenido escaneado:</p>
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm break-all">
                      {lastScanned || 'Ningún código escaneado aún'}
                    </p>
                    <div className="flex-shrink-0 flex gap-1">
                      {lastScanned && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyToClipboard}
                          title="Copiar al portapapeles"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {isUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleOpenUrl}
                          title="Abrir enlace"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetScanner}
                >
                  Escanear otro código
                </Button>

                {isUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleOpenUrl}
                  >
                    Visitar enlace
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}