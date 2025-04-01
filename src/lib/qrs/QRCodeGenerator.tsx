import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

// Define layout constants
const margin = 10
const qrSize = 50
const textHeight = 5
const pageHeight = 200
const columnWidth = 95
const spaceBetweenQR = 40

/**
 * Function to generate PDF with QR codes
 * @param rows Array of objects containing name and _id properties
 */
export const generatePDF = async (rows: any[]) => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL
  const doc = new jsPDF()

  // Generate all QR codes in parallel
  const qrPromises = rows.map(async row => {
    const url = `${frontendUrl}/form/solicit/${row._id}`
    return QRCode.toDataURL(url, { width: 150 }).then(qrCode => ({ name: row.name, qrCode }))
  })

  // Wait for all QR codes to be generated
  const qrData = await Promise.all(qrPromises)
  let currentPage = 0
  let yPos = margin

  // Place QR codes on the PDF
  qrData.forEach((item, index) => {
    const isRightColumn = index % 2 === 1
    const xPos = isRightColumn ? margin + columnWidth : margin

    // If we're starting a right column item but need a new page
    if (yPos > pageHeight && !isRightColumn) { doc.addPage(); currentPage++; yPos = margin }

    // If we're starting a new row
    if (isRightColumn && index > 0) {/* Don't change yPos, we're on the same row as the previous item */ }
    else if (index > 0) { yPos += spaceBetweenQR }

    // Add text and QR code to the PDF
    doc.text(item.name, xPos, yPos)
    doc.addImage(item.qrCode, 'PNG', xPos, yPos + textHeight, qrSize, qrSize)

    // Check if we need a new page for the next row (right column)
    if (isRightColumn && yPos + spaceBetweenQR > pageHeight) { doc.addPage(); currentPage++; yPos = margin }
    // Move to the next row after completing a right column item
    else if (isRightColumn) { yPos += spaceBetweenQR }
  })

  const pdfBlob = doc.output('blob')
  const pdfURL = URL.createObjectURL(pdfBlob)
  window.open(pdfURL, '_blank')
}