import ErrorAPI, { Conflict, Validation, Unauthorized, NotFound, defaultRecord, ErrorRecord } from '@/errors'
import { FirebaseError } from 'firebase/app';

class HandlerErrors {
  /**
   * Crea un error personalizado basado en el código y mensaje de Firebase
   * @param {FirebaseError} e: error de tipo FirebaseError
   * @returns {ErrorAPI} retorna un error de tipo ErrorAPI
   */
  public static get(e: FirebaseError): ErrorAPI {
    const message = 'Error interno del servidor (firebase)'
    const record = this.errorRecords[e.code] || defaultRecord(message, e.message)
    return new record.errorType({ message: record.message, details: { name: e.name, message: e.message, code: e.code } })
  }

  /** Mapeo de errores de Firebase a errores personalizados */
  private static readonly errorRecords: Record<string, ErrorRecord> = {
    // Errores de Firebase Storage
    'storage/unknown': {
      message: 'Error desconocido en el almacenamiento',
      errorType: ErrorAPI
    },
    'storage/object-not-found': {
      message: 'El archivo no existe en la ubicación especificada',
      errorType: NotFound
    },
    'storage/bucket-not-found': {
      message: 'No se ha configurado un bucket para Cloud Storage',
      errorType: NotFound
    },
    'storage/project-not-found': {
      message: 'No se ha configurado un proyecto para Cloud Storage',
      errorType: NotFound
    },
    'storage/quota-exceeded': {
      message: 'Se ha excedido la cuota de almacenamiento disponible',
      errorType: Conflict
    },
    'storage/unauthenticated': {
      message: 'El usuario no está autenticado',
      errorType: Unauthorized
    },
    'storage/unauthorized': {
      message: 'El usuario no está autorizado para realizar esta operación',
      errorType: Unauthorized
    },
    'storage/retry-limit-exceeded': {
      message: 'Se ha excedido el límite de reintentos para la operación',
      errorType: Conflict
    },
    'storage/invalid-checksum': {
      message: 'El archivo en el cliente no coincide con el checksum recibido por el servidor',
      errorType: Validation
    },
    'storage/canceled': {
      message: 'La operación ha sido cancelada por el usuario',
      errorType: Conflict
    },
    'storage/invalid-event-name': {
      message: 'Nombre de evento inválido',
      errorType: Validation
    },
    'storage/invalid-url': {
      message: 'URL inválida proporcionada',
      errorType: Validation
    },
    'storage/invalid-argument': {
      message: 'Argumento inválido proporcionado',
      errorType: Validation
    },
    'storage/no-default-bucket': {
      message: 'No hay un bucket predeterminado configurado',
      errorType: NotFound
    },
    'storage/cannot-slice-blob': {
      message: 'No se puede procesar el archivo (posiblemente ha sido modificado localmente)',
      errorType: Conflict
    },
    'storage/server-file-wrong-size': {
      message: 'El tamaño del archivo en el cliente no coincide con el recibido por el servidor',
      errorType: Conflict
    }
  }
}

//Uso de bind() es para mantener el contexto de la clase
export default HandlerErrors.get.bind(HandlerErrors)