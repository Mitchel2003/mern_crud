import { type ClassValue, clsx } from "clsx"
import { FC, createElement } from "react"
import { pdf } from "@react-pdf/renderer"
import { twMerge } from "tailwind-merge"

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
type PDFProps<T> = { component: FC<T>, fileName: string, props: T }
/** This represent a hook with tools to download a PDF. */
export const usePDFDownload = () => {
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
    } catch (e) { console.error('Error al generar el PDF:', e); throw e }
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
    } catch (e) { console.error('Error al guardar el PDF:', e); throw e }
  }

  return { downloadPDF, downloadPDFAs }
}