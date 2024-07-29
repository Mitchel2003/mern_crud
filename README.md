### ---------------------------------------------------------------------------------------------------- ###
### Códigos de estado informativos (100-199)
100 Continue: El servidor ha recibido los encabezados de la solicitud y el cliente debe proceder a enviar el cuerpo de la solicitud.
101 Switching Protocols: El servidor acepta el cambio de protocolo solicitado por el cliente.
### Códigos de estado de éxito (200-299)
200 OK: La solicitud ha tenido éxito. La respuesta depende del método de solicitud utilizado.
201 Created: La solicitud ha sido cumplida y ha resultado en la creación de un nuevo recurso.
202 Accepted: La solicitud ha sido aceptada para procesamiento, pero aún no se ha completado.
204 No Content: La solicitud ha tenido éxito, pero el servidor no devuelve ningún contenido.
### Códigos de redirección (300-399)
301 Moved Permanently: La URL del recurso solicitado ha sido cambiada permanentemente.
302 Found: El recurso solicitado se encuentra temporalmente en una URL diferente.
304 Not Modified: El recurso no ha sido modificado desde la última solicitud.
### Códigos de error del cliente (400-499)
400 Bad Request: El servidor no puede procesar la solicitud debido a un error del cliente.
401 Unauthorized: La solicitud requiere autenticación del usuario.
403 Forbidden: El servidor entiende la solicitud, pero se niega a autorizarla.
404 Not Found: El recurso solicitado no se ha encontrado.
405 Method Not Allowed: El método de solicitud no está permitido para el recurso solicitado.
409 Conflict: La solicitud no puede ser completada debido a un conflicto con el estado actual del recurso.
422 Unprocessable Entity: El servidor entiende el tipo de contenido de la solicitud, pero no puede procesar las instrucciones contenidas en ella.
### Códigos de error del servidor (500-599)
500 Internal Server Error: El servidor ha encontrado una condición inesperada que le impide cumplir con la solicitud.
501 Not Implemented: El servidor no reconoce el método de solicitud y no puede soportarlo.
502 Bad Gateway: El servidor, actuando como una puerta de enlace o proxy, recibió una respuesta inválida del servidor ascendente.
503 Service Unavailable: El servidor no está disponible temporalmente, generalmente debido a mantenimiento o sobrecarga.
504 Gateway Timeout: El servidor, actuando como una puerta de enlace o proxy, no recibió una respuesta a tiempo del servidor ascendente.
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### Uso de interfaz !IMPORTANT!
```typescript
import { Request } from "express";
export interface ExtendsRequest extends Request {
  user?: Auth; //remember that should be optional because "extends" from another interface
}
interface Auth {
  id: string;
}
```
### Ahora procedemos a lo siguiente...
```typescript
import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt";
import { ExtendsRequest } from "../interfaces/request.interface";

export const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Not found token, auth denied" });
  const user = await verifyAccessToken(token) as { id: string };
  if (!user.id) return res.status(401).json({ message: "Invalid token" });
  req.user = user;
  next();
};
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### Expresiones de tipo:
**Verificación del tipo de dato**:
   ```typescript
   if (typeof decoded === 'object' && decoded !== null)
   ```
   Aquí estamos verificando si el valor de `decoded` es un objeto y no es `null`.
   
**Conversión de tipo usando `as`**:
   ```typescript
   const { id, exp } = decoded as jwt.JwtPayload;
    //or 
   resolve(decoded as { id: string });
   ```
   Esta línea está utilizando TypeScript para "asegurarle" que `decoded` es del tipo `jwt.JwtPayload`.


En Mongoose, al habilitar `timestamps`, se agregan automáticamente dos campos a cada documento: `createdAt` y `updatedAt`. Sin embargo, para que estos campos sean accesibles, debes asegurarte de que el esquema y los tipos estén correctamente definidos y que estés accediendo a los campos correctos en tu código.
Asegúrate de que tu interfaz `User` incluya los campos `createdAt` y `updatedAt`:
```typescript
export default interface User {
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
//See status
   ```powershell
   Get-ExecutionPolicy
   ```

//Unlock
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```

//Lock
   ```powershell
   Set-ExecutionPolicy Restricted
   ```

### Orden de Middleware
El orden en que se define el middleware en Express es crucial porque las solicitudes se procesan en el mismo orden en que se definen los middlewares y rutas. 

```javascript
const express = require('express');
const app = express();

app.use(middleware1);
app.use(middleware2);
app.get('/route', routeHandler);
```
En este ejemplo, cuando una solicitud llega a `/route`:
1. **`middleware1`** se ejecuta primero.
2. Si `middleware1` llama a `next()`, entonces **`middleware2`** se ejecuta.
3. Si `middleware2` llama a `next()`, entonces **`routeHandler`** se ejecuta.

### Middleware Específicos
#### `express.json()`
Este middleware analiza cuerpos de solicitud JSON. Si no se añade antes de tus rutas, `req.body` no estará disponible y será `undefined`.
#### `cors()`
Este middleware habilita CORS (Cross-Origin Resource Sharing), lo que permite o restringe las solicitudes de recursos en un servidor desde un origen diferente. Esto es especialmente útil para permitir que tu API sea accesible desde diferentes dominios.

### Conclusión
El orden de los middlewares en Express es crucial para asegurar que las solicitudes sean procesadas correctamente. Los middlewares como `express.json()` y `cors()` preparan la solicitud antes de que llegue a las rutas, garantizando que los datos estén disponibles y que las políticas de seguridad se apliquen correctamente.
### ---------------------------------------------------------------------------------------------------- ###