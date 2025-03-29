import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

// Function to generate PDF with QR codes
export const generatePDF = async (rows: any[]) => {
  const doc = new jsPDF()

  let yPos = 10 // initial position
  for (const row of rows) {
    const url = `https://app/form/schedule/${row._id}`
    const qrCode = await QRCode.toDataURL(url, { width: 150 })

    doc.text(row.name, 10, yPos)
    doc.addImage(qrCode, 'PNG', 10, yPos + 5, 50, 50)

    yPos += 60; // Space between QR
    if (yPos > 270) { doc.addPage(); yPos = 10 }
  }

  // Open PDF in a new tab without downloading
  const pdfBlob = doc.output('blob')
  const pdfURL = URL.createObjectURL(pdfBlob)
  window.open(pdfURL, '_blank')
}
