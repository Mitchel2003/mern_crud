import axios from "axios"

const instance = axios.create({
  baseURL: 'https://rest-api-qvo9.onrender.com/api', /* to mode production */
  //baseURL: 'http://localhost:4000/api', /* to mode development */
  withCredentials: true
})

export default instance

export class ImageService {
  /**
   * Obtiene una imagen desde una URL y la convierte en una Data URL completa.
   * @param url URL de la imagen
   * @returns Una promesa que resuelve en la cadena completa de la imagen (data URL) o null en caso de error.
   */
  static async fetchImageAsDataUrl(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      console.log(response.data)
      return await this.blobToDataUrl(response.data);
    } catch (error: any) {
      console.error("Error al obtener la imagen:", url, error);
      return null;
    }
  }

  /**
   * Convierte un Blob a una Data URL completa (incluyendo el prefijo).
   * @param blob Archivo Blob
   * @returns Promesa que resuelve en la Data URL
   */
  private static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}