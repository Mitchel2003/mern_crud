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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------handler download PDF--------------------------------------------------*/
/** Type for PDF generation props */
type DownloadZipProps<T extends object> = { components: PDFProps<T>[]; zipName?: string }
type PDFProps<T extends object> = { component: FC<T>; fileName: string; props: T }

/** This represent a hook with tools to download a PDF. */
export const usePDFDownload = () => {
  /**
   * This function is used to download multiple PDFs as a ZIP file.
   * @param components Array of components to convert to PDFs and include in the ZIP
   * @param zipName Optional custom name for the ZIP file
   */
  const downloadZIP = async <T extends object>({ components, zipName = 'mantenimientos.zip' }: DownloadZipProps<T>) => {
    try {
      // Create a new ZIP file
      const zip = new JSZip()

      // Generate all PDFs in parallel
      const pdfPromises = components.map(async ({ component, props, fileName }) => {
        const pdf = await pdfToBase64(component, props)
        return { pdf, fileName }
      })

      // Wait for all PDFs to be generated
      const pdfs = await Promise.all(pdfPromises)

      // Add each PDF to the ZIP file
      pdfs.forEach(({ pdf, fileName }) => { zip.file(fileName, pdf.split('base64,')[1], { base64: true }) })

      // Generate and download the ZIP file
      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      saveAs(content, zipName)

    } catch (e) { console.error('Error generating ZIP file:', e); throw e }
  }

  /**
   * This function is used to download a PDF.
   * Is used to download directly from the component with the option to choose save location
   * @param component The React component to convert to PDF.
   * @param props The props to pass to the component.
   * @param fileName The name to give to the file.
   */
  const downloadPDF = async <T extends object>({ component, props, fileName }: PDFProps<T>) => {
    try {
      const element = createElement(component, props)
      const blob = await pdf(element).toBlob()
      // @ts-ignore - FileSystemFileHandle API es experimental
      const handle = await window.showSaveFilePicker({
        types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }],
        suggestedName: fileName,
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
    } catch (e: any) { if (e.name === 'AbortError') return; console.error('Error al generar el PDF:', e) }
  }

  /**
   * This function is used to download a PDF.
   * Is used in the case that we need save in a path
   * @param blob The PDF file to save.
   * @param suggestedName The name to give to the file.
   */
  const downloadPDFAs = async (blob: Blob, suggestedName: string) => {
    try {
      // @ts-ignore - FileSystemFileHandle API es experimental
      const handle = await window.showSaveFilePicker({
        types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }],
        suggestedName,
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
    } catch (e: any) { if (e.name === 'AbortError') return; console.error('Error al guardar el PDF:', e) }
  }

  return { downloadPDF, downloadPDFAs, downloadZIP }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Helper function to convert a React component to base64 PDF */
const pdfToBase64 = async <T extends object>(Component: FC<T>, props: T): Promise<string> => {
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