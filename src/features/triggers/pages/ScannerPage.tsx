import { QRScanner } from "@/features/triggers/hooks/useQRScanner"
import { useNotification } from "@/hooks/ui/useNotification"
import { Camera, Copy, ExternalLink } from "lucide-react"
import { isValidUrl } from "@/utils/validation"
import { Card, CardContent } from "#/ui/card"
import { useState, useEffect } from "react"
import { Button } from "#/ui/button"

const ScannerPage = () => {
  const { notifySuccess, notifyError, notifyInfo } = useNotification()
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const [isUrl, setIsUrl] = useState(false)

  /** Verifies if the scanned text is a valid URL and redirects immediately */
  useEffect(() => {
    if (!lastScanned) return setIsUrl(false)
    const urlValid = isValidUrl(lastScanned)
    setIsUrl(urlValid)
    if (urlValid && !isRedirecting) { window.location.href = lastScanned; setIsRedirecting(true) }
  }, [lastScanned])

  /** Handles the success of a QR scan */
  const handleScanSuccess = (decodedText: string) => {
    setIsScanning(false)
    setLastScanned(decodedText)
    const isValidUrlResult = isValidUrl(decodedText)
    if (!isValidUrlResult) {// Verify if it's a URL
      notifySuccess({ title: "QR escaneado correctamente", message: "El contenido ha sido detectado y está listo para copiar." })
      navigator.clipboard.writeText(decodedText)// Try to copy to clipboard only if it's not a URL
        .then(() => { notifyInfo({ title: "Copiado", message: "Contenido copiado al portapapeles" }) })
        .catch(() => { console.warn("No se pudo copiar automáticamente") })
    }
  }
  /** Handles the action of copying the last scanned content to the clipboard */
  const handleCopyToClipboard = () => {
    if (!lastScanned) return
    navigator.clipboard.writeText(lastScanned)
      .then(() => { notifySuccess({ title: "Copiado", message: "Contenido copiado al portapapeles" }) })
      .catch((err) => { notifyError({ title: "Error", message: "No se pudo copiar al portapapeles." + err }) })
  }
  /** Handles the action of opening a URL. If the last scanned content is a valid URL, it redirects to that URL. */
  const handleOpenUrl = () => {
    if (!lastScanned || !isUrl) return
    window.location.href = lastScanned
    setIsRedirecting(true)
  }
  /** Resets the scanner state by clearing the last scanned content and reinitializing the scanner */
  const resetScanner = () => {
    setLastScanned(null)
    setIsScanning(true)
    setIsRedirecting(false)
  }
  /** Handles errors during QR scanning */
  const handleScanError = (error: string) => { !error.includes('MultiFormat') && notifyError({ title: "Error al escanear QR", message: error }) }
  /** Toggles the scanner state between active and paused */
  const toggleScanner = () => { setIsScanning(prev => !prev) }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Escáner QR</h1>
            <Button
              size="icon"
              variant="outline"
              onClick={toggleScanner}
              title={isScanning ? "Pausar escáner" : "Activar escáner"}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {isScanning ? (
            <div className="space-y-4">
              <QRScanner
                fps={5}
                isScanning={isScanning}
                onScanError={handleScanError}
                onScanSuccess={handleScanSuccess}
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
                      {lastScanned && !isUrl && (
                        <Button size="icon" variant="ghost" title="Copiar al portapapeles" onClick={handleCopyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {isUrl && !isRedirecting && (
                        <Button size="icon" variant="ghost" title="Abrir enlace" onClick={handleOpenUrl}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-4">
                <Button size="sm" variant="outline" onClick={resetScanner}>
                  Escanear otro código
                </Button>

                {isUrl && !isRedirecting && (
                  <Button size="sm" variant="default" onClick={handleOpenUrl}>
                    Visitar enlace
                  </Button>
                )}
                {isRedirecting && (
                  <Button disabled size="sm" variant="default">
                    Redireccionando...
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

export default ScannerPage