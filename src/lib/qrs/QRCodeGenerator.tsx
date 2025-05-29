import { Curriculum } from '@/interfaces/context.interface'
import gsIcon from '/assets/gs_ico.ico'
import config from '@/utils/config'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

// Define layout constants
const MARGIN = 4        // Margin in mm
const PAGE_WIDTH = 210  // A4 width in mm
const PAGE_HEIGHT = 297 // A4 height in mm
const CARDS_PER_ROW = 4
const CARDS_PER_COL = 5
const APP_NAME = "Gest.ing"

// Card dimensions
const CARD_WIDTH = (PAGE_WIDTH - (MARGIN * 2) - ((CARDS_PER_ROW - 1) * 5)) / CARDS_PER_ROW
const CARD_HEIGHT = (PAGE_HEIGHT - (MARGIN * 2) - ((CARDS_PER_COL - 1) * 10)) / CARDS_PER_COL

// QR code size (dynamic based on card size)
const QR_SIZE = CARD_WIDTH * 0.4
const QR_MARGIN_TOP = 12

// Text positioning
const TITLE_FONT_SIZE = 10
const INVENTORY_FONT_SIZE = 8

interface DrawProps { x: number, y: number, width: number, height: number, radius?: number }
/**
 * Function to generate professional-looking PDF cards with QR codes
 * @param rows Array of objects containing name, model and _id properties
 * @param logoUrl URL to the company logo
 * @param appName Name of the application
 */
export const generatePDF = async (rows: Curriculum[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Load logo
  let logoImage: string | undefined
  try { logoImage = await loadImage(gsIcon) }
  catch (error) { console.error('Error loading logo:', error) }

  // Set up fonts
  doc.setFont('helvetica', 'bold')

  // Add custom function to draw a rounded rectangle
  const drawRoundedRect = ({ x, y, width, height, radius = 2 }: DrawProps) => {
    doc.setDrawColor(170, 170, 170)
    doc.setLineWidth(0.3)
    // Draw the rounded rectangle
    doc.roundedRect(x, y, width, height, radius, radius, 'S')
    // Draw inner border with gradient effect
    doc.setLineWidth(0.1)
    doc.setDrawColor(220, 220, 220)
    doc.roundedRect(x + 0.5, y + 0.5, width - 1, height - 1, radius, radius, 'S')
  }

  // Add custom function to create a gradient background effect
  const drawCardBackground = ({ x, y, width, height, radius = 2 }: DrawProps) => {
    // Fill with very light gray
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(x, y, width, height, radius, radius, 'F')
    // Add header area with slight gradient
    doc.setFillColor(245, 245, 245)
    doc.rect(x, y, width, 10, 'F')
  }

  // Generate all QR codes in parallel
  const qrPromises = rows.map(async row => {
    const url = `${config.frontendUrl}/equipment/${row._id}`
    return QRCode.toDataURL(url, { width: QR_SIZE * 10, margin: 0, color: { dark: '#000000', light: '#FFFFFF' } })
      .then(qrCode => ({ name: row.name, inventory: row.inventory, qrCode }))
  })

  // Wait for all QR codes to be generated
  const qrData = await Promise.all(qrPromises)
  let currentPage = 1

  // Calculate how many pages we need
  const totalPages = Math.ceil(qrData.length / (CARDS_PER_ROW * CARDS_PER_COL))

  let cardIndex = 0
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) { doc.addPage(); currentPage++ }

    // Add page number
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Página ${currentPage} de ${totalPages}`, PAGE_WIDTH - MARGIN - 30, PAGE_HEIGHT - MARGIN, { align: 'right' })

    // Layout cards in grid
    for (let row = 0; row < CARDS_PER_COL; row++) {
      for (let col = 0; col < CARDS_PER_ROW; col++) {
        if (cardIndex >= qrData.length) break
        const item = qrData[cardIndex]
        cardIndex++

        const x = MARGIN + (col * (CARD_WIDTH + 5))
        const y = MARGIN + (row * (CARD_HEIGHT + 5))

        // Draw card background and border
        drawCardBackground({ x, y, width: CARD_WIDTH, height: CARD_HEIGHT })
        drawRoundedRect({ x, y, width: CARD_WIDTH, height: CARD_HEIGHT })

        // Add decorative header line
        doc.setLineWidth(0.5)
        doc.setDrawColor(30, 136, 229) //Blue color
        doc.line(x, y + 10, x + CARD_WIDTH, y + 10)

        // Logo and app name in header
        const logoWidth = 10
        const logoHeight = 6
        doc.addImage(logoImage as string, 'PNG', x + 10, y + 2, logoWidth, logoHeight)

        // App name next to logo
        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        doc.text(APP_NAME, x + logoWidth + 12, y + 6.5)

        // Add QR code
        const qrY = y + QR_MARGIN_TOP
        const qrX = x + (CARD_WIDTH - QR_SIZE) / 2
        doc.addImage(item.qrCode, 'PNG', qrX, qrY, QR_SIZE, QR_SIZE)

        // Add shadow effect for QR code
        doc.setLineWidth(0.1)
        doc.setDrawColor(220, 220, 220)
        doc.rect(qrX - 0.2, qrY - 0.2, QR_SIZE + 0.4, QR_SIZE + 0.4)

        // Add equipment name
        doc.setFontSize(TITLE_FONT_SIZE)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(50, 50, 50)

        // Center text and handle long names with word wrapping
        const nameY = qrY + QR_SIZE + 4
        const nameMaxWidth = CARD_WIDTH - 10
        const nameLines = doc.splitTextToSize(item.name, nameMaxWidth)
        const truncatedName = nameLines.slice(0, 2) //Limit 2 lines
        doc.text(truncatedName, x + CARD_WIDTH / 2, nameY, { align: 'center' })

        // Add inventory information
        doc.setFontSize(INVENTORY_FONT_SIZE)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)

        const inventoryY = nameY + (truncatedName.length * 4)
        const inventoryLines = doc.splitTextToSize(`Inventario: ${item.inventory}`, nameMaxWidth)
        doc.text(inventoryLines, x + CARD_WIDTH / 2, inventoryY, { align: 'center' })

        // Add decorative corner elements
        doc.setDrawColor(30, 136, 229) // Blue accent color
        doc.setLineWidth(0.5)

        // Top-left corner decoration
        doc.line(x, y, x + 5, y)
        doc.line(x, y, x, y + 5)

        // Bottom-right corner decoration
        doc.line(x + CARD_WIDTH - 5, y + CARD_HEIGHT, x + CARD_WIDTH, y + CARD_HEIGHT)
        doc.line(x + CARD_WIDTH, y + CARD_HEIGHT - 5, x + CARD_WIDTH, y + CARD_HEIGHT)
      }
    }
  }

  // Add a decorative footer to the last page
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text(`Generado el ${new Date().toLocaleDateString()} - ${APP_NAME}`, MARGIN, PAGE_HEIGHT - 7)

  // Output the PDF
  const pdfBlob = doc.output('blob')
  const pdfURL = URL.createObjectURL(pdfBlob)
  window.open(pdfURL, '_blank')
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
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