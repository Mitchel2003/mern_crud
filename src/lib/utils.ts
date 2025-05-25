import { type ClassValue, clsx } from "clsx"
import { FC, createElement } from "react"
import { pdf } from "@react-pdf/renderer"
import { twMerge } from "tailwind-merge"
import { saveAs } from "file-saver"
import JSZip from 'jszip'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------handler file--------------------------------------------------*/
/**
 * This function is used to copy a string to the clipboard.
 * @param text Text to copy.
 */
export const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text) }

/**
 * This function is used to process a file, specifically a base64 string.
 * also works to convert a blob to base64
 * @param data - The file to process.
 * @returns {string} A promise that resolves to a base64 string.
 */
export const processFile = (data: File): Promise<string> => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string).split(',')[1])
    reader.readAsDataURL(data)
  })
}

/**
 * Convierte una URL de datos (base64) en un objeto File
 * @param dataUrl - URL de datos en formato base64 (ej: data:image/png;base64,...)
 * @returns Objeto File listo para ser subido al servidor
 */
export const dataUrlToFile = (dataUrl: string): File => {
  //Extract MIME type from data URL (image/png, image/jpeg, etc.)
  const mime = dataUrl.match(/data:([^;]+);/)![1]
  //Extract base64 from data URL
  const bstr = atob(dataUrl.split(',')[1])
  let n = bstr.length //string length base64
  const u8arr = new Uint8Array(n)
  //Convert the string to a byte array
  while (n--) { u8arr[n] = bstr.charCodeAt(n) }
  return new File([u8arr], 'file', { type: mime })
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------handler download PDF--------------------------------------------------*/
/** Type for PDF generation props */
type PDFProps<T extends object> = { component: FC<T>; fileName: string; props: T }
type ZipProps<T extends object> = { components: PDFProps<T>[]; zipName?: string }
type FileZipProps = { pdfFiles: PDFFileProps[]; zipName: string }
type PDFFileProps = { pdf: string; fileName: string }

/** This represent a hook with tools to download a PDF. */
export const usePDFDownload = () => {
  /**
   * This function is used to download a PDF.
   * Is used to download directly from the component with the option to choose save location
   * @param component The React component to convert to PDF.
   * @param props The props to pass to the component.
   */
  const downloadPDF = async <T extends object>({ component, props }: PDFProps<T>): Promise<void> => {
    try {
      const element = createElement(component, props)
      const blob = await pdf(element).toBlob()
      const pdfURL = URL.createObjectURL(blob)
      window.open(pdfURL, '_blank') //Open PDF in a new tab
      setTimeout(() => { URL.revokeObjectURL(pdfURL) }, 1000)
    } catch (e: any) { if (e.name !== 'AbortError') console.error('Error al generar el PDF:', e) }
  }

  /**
   * This function is used to download multiple PDFs as a ZIP file.
   * @param components Array of components to convert to PDFs and include in the ZIP
   * @param zipName Optional custom name for the ZIP file
   */
  const downloadZIP = async <T extends object>({ components, zipName = 'mantenimientos.zip' }: ZipProps<T>) => {
    try {
      const zip = new JSZip() //Generate all PDFs in parallel
      const pdfPromises = components.map(async ({ component, props, fileName }) => {
        const pdf = await pdfToBase64(component, props)
        return { pdf, fileName }
      })
      const pdfs = await Promise.all(pdfPromises) //Wait for all PDFs to be generated
      pdfs.forEach(({ pdf, fileName }) => { zip.file(fileName, pdf.split('base64,')[1], { base64: true }) }) //Add each PDF to file
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }) //Generate ZIP
      saveAs(content, zipName) //Trigger download file that contains all PDFs
    } catch (e) { console.error('Error generating ZIP file:', e); throw e }
  }

  /**
   * This function is used to download a ZIP file from pre-generated PDF files.
   * @param pdfFiles Array of PDF files with their file names
   * @param zipName Name for the ZIP file
   */
  const downloadFilesAsZIP = async ({ pdfFiles, zipName = 'archivos.zip' }: FileZipProps): Promise<void> => {
    try {
      const zip = new JSZip()
      pdfFiles.forEach(({ pdf, fileName }) => { zip.file(fileName, pdf.split('base64,')[1], { base64: true }) })
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      saveAs(content, zipName) //Trigger download file that contains all PDFs
    } catch (e) { console.error('Error generating ZIP file:', e); throw e }
  }

  /**
   * This function is used to directly download a PDF without preview.
   * Works on all devices including mobile. Saves the file to the device.
   * @param component The React component to convert to PDF.
   * @param props The props to pass to the component.
   * @param fileName The name to give to the file.
   */
  const downloadPDFDirect = async <T extends object>({ component, props, fileName }: PDFProps<T>): Promise<File | null> => {
    try {
      const element = createElement(component, props)
      const blob = await pdf(element).toBlob()
      // Create a URL blob and trigger download
      const pdfURL = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = pdfURL; a.download = fileName
      document.body.appendChild(a)
      a.click() //Trigger download
      document.body.removeChild(a)
      URL.revokeObjectURL(pdfURL)
      return new File([blob], fileName, { type: 'application/pdf' })
    } catch (e: any) { if (e.name !== 'AbortError') { console.error('Error al generar el PDF:', e) } return null }
  }

  /**
   * This function is used to download a PDF with the option to save to a specific location.
   * Uses the File System Access API which is only supported in some desktop browsers.
   * Falls back to direct download if the API is not available.
   * @param component The React component to convert to PDF.
   * @param props The props to pass to the component.
   * @param fileName The name to give to the file.
   */
  const downloadPDFDialog = async <T extends object>({ component, props, fileName }: PDFProps<T>): Promise<void> => {
    const element = createElement(component, props)
    const blob = await pdf(element).toBlob()
    try { //Try to use the File System Access API (desktop browsers only)
      //@ts-ignore - FileSystemFileHandle API is experimental
      const handle = await window.showSaveFilePicker({
        types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }],
        suggestedName: fileName,
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
    } catch (fsError: any) { //Fallback for browsers without File System Access API support
      if (fsError.name === 'AbortError') return //Handle user cancellation        
      if (fsError.name === 'NotFoundError' || fsError.name === 'TypeError') {
        const pdfURL = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = pdfURL; a.download = fileName
        document.body.appendChild(a)
        a.click() //Trigger download
        document.body.removeChild(a)
        URL.revokeObjectURL(pdfURL)
      } else { throw fsError }
    }
  }

  return { downloadPDF, downloadZIP, downloadFilesAsZIP, downloadPDFDirect, downloadPDFDialog }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------behavior PDF--------------------------------------------------*/
/** Helper function to convert a React component to base64 PDF */
export const pdfToBase64 = async <T extends object>(Component: FC<T>, props: T): Promise<string> => {
  try {
    const element = createElement(Component, props)
    const blob = await pdf(element).toBlob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch (e) { console.error('Error converting PDF to base64:', e); throw e }
}

/** 
 * This function is used to divide an array into smaller chunks of a specified size.
 * Usually used to divide rows of a table into chunks to fit into a PDF page.
 * @param items The array to be chunked.
 * @param size The size of each chunk.
 * @returns An array of chunks.
 */
export const chunkTable = (items: string[], size: number) => {
  const chunks = [] //Array to store the chunks
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size))
  if (chunks.length === 0) chunks.push([])
  return chunks
}