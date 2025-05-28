import { Curriculum } from '@/interfaces/context.interface'
import gsIcon from '/assets/gs_ico.ico'
import config from '@/utils/config'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

// Define layout constants según especificaciones de la impresora de pegatinas
const TOTAL_WIDTH = 103    // Ancho total aprovechable en mm
const LABEL_HEIGHT = 25    // Altura de cada etiqueta en mm
const SPACE_BETWEEN = 3    // Espacio entre etiquetas en mm
const LABELS_PER_ROW = 3   // Etiquetas por fila
const APP_NAME = "Gest.ing"

// Calcular el ancho de cada etiqueta basado en las especificaciones
const LABEL_WIDTH = (TOTAL_WIDTH - (SPACE_BETWEEN * (LABELS_PER_ROW - 1))) / LABELS_PER_ROW // ~33mm

// QR code size (maximizar dentro del espacio disponible)
const QR_SIZE = Math.min(LABEL_WIDTH * 0.75, LABEL_HEIGHT * 0.75) // El QR ocupa el 75% del espacio disponible

// Text positioning
const TITLE_FONT_SIZE = 6
const MODEL_FONT_SIZE = 5

interface DrawProps {
  radius?: number,
  height: number,
  width: number,
  y: number,
  x: number,
}

/**
 * Función para generar QRs para impresión con impresora de pegatinas
 * @param rows Array de objetos Curriculum con name, modelEquip y _id
 */
export const generateLabels = async (rows: Curriculum[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Cargar logo
  let logoImage: string | undefined
  try { logoImage = await loadImage(gsIcon) }
  catch (error) { console.error('Error loading logo:', error) }

  // Configurar fuentes
  doc.setFont('helvetica', 'bold')

  // Función para dibujar bordes de etiquetas
  const drawLabelBorder = ({ x, y, width, height, radius = 1 }: DrawProps) => {
    doc.setLineWidth(0.2)
    doc.setDrawColor(180, 180, 180)
    doc.roundedRect(x, y, width, height, radius, radius, 'S')
  }

  // Generar todos los códigos QR en paralelo
  const qrPromises = rows.map(async row => {
    const url = `${config.frontendUrl}/equipment/${row._id}`
    return QRCode.toDataURL(url, { width: QR_SIZE * 10, margin: 0, color: { dark: '#000000', light: '#FFFFFF' } })
      .then(qrCode => ({ name: row.name, inventory: row.inventory, qrCode }))
  })

  // Esperar a que todos los códigos QR se generen
  const qrData = await Promise.all(qrPromises)

  // Iniciamos desde el origen (0,0) como requiere la impresora
  let currentX = 0
  let currentY = 0

  // Layout etiquetas en filas (la impresora maneja los saltos de página)
  for (let i = 0; i < qrData.length; i++) {
    const item = qrData[i]

    // Calcular posición de etiqueta actual
    const col = i % LABELS_PER_ROW
    currentX = col * (LABEL_WIDTH + SPACE_BETWEEN)

    // Si completamos una fila, avanzamos a la siguiente
    if (col === 0 && i > 0) { currentY += LABEL_HEIGHT + SPACE_BETWEEN }

    // Dibujar borde de etiqueta
    drawLabelBorder({ x: currentX, y: currentY, width: LABEL_WIDTH, height: LABEL_HEIGHT })

    // Posicionar el QR en el centro vertical y ligeramente a la izquierda
    const qrY = currentY + (LABEL_HEIGHT - QR_SIZE) / 2 // Centrar verticalmente
    const qrX = currentX + 2 // Pequeño margen izquierdo

    // Añadir QR code
    doc.addImage(item.qrCode, 'PNG', qrX, qrY, QR_SIZE, QR_SIZE)

    // Espacio para texto (a la derecha del QR)
    const textX = qrX + QR_SIZE + 2 // Margen después del QR
    const textMaxWidth = LABEL_WIDTH - QR_SIZE - 6 // Ancho disponible para texto

    // Añadir nombre App
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(TITLE_FONT_SIZE)
    doc.setFont('helvetica', 'bold')
    doc.text(APP_NAME, textX, currentY + 5)

    // Logo y app name en header
    const logoWidth = 8
    const logoHeight = 5
    doc.addImage(logoImage as string, 'PNG', textX, currentY + 6, logoWidth, logoHeight)

    // Añadir nombre del equipo
    doc.setFontSize(MODEL_FONT_SIZE)
    doc.setFont('helvetica', 'normal')
    const nameLines = doc.splitTextToSize(item.name, textMaxWidth)
    // Limitamos a máximo 3 líneas para el nombre
    const truncatedName = nameLines.slice(0, 3)
    doc.text(truncatedName, textX, currentY + 13)

    // Añadir inventario (en 3 líneas)
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(MODEL_FONT_SIZE - 1)
    const modelLines = doc.splitTextToSize(`Inventario: ${item.inventory}`, textMaxWidth)
    // Limitamos a máximo 3 líneas para el modelo
    const truncatedModel = modelLines.slice(0, 3)
    doc.text(truncatedModel, textX, currentY + 19)
  }

  // Generar PDF para impresión
  const pdfBlob = doc.output('blob')
  const pdfURL = URL.createObjectURL(pdfBlob)
  window.open(pdfURL, '_blank')
}

/**
 * Helper function to load an image and convert it to base64
 * @param url URL of the image to load
 * @returns Promise resolving to base64 encoded image
 */
const loadImage = (url: string): any => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = url
  })
}