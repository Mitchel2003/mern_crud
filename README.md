Este error ocurre porque `express` espera una función de middleware con un tipo específico para el primer argumento `req`, pero `authRequired` está usando un tipo extendido `ExtendsRequest` que no coincide con lo que `express` espera. Para solucionar esto, necesitas ajustar la definición de tu middleware para que `express` lo acepte.

Aquí hay un ejemplo detallado de cómo puedes ajustar tu código para resolver este problema:

### Definir una Interfaz para el `Request` Extendido

Primero, define la interfaz extendida que incluye la propiedad `user`:

```typescript
// src/interfaces/extendsRequest.interface.ts
import { Request } from "express";

export interface ExtendsRequest extends Request {
  user?: { id: string; exp: number }; // ajusta según las propiedades que esperas
}
```

### Middleware `authRequired`

Asegúrate de que tu middleware usa la interfaz extendida:

```typescript
// src/middlewares/authRequired.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/jwt";
import { ExtendsRequest } from "../interfaces/extendsRequest.interface";

export const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Not found token, auth denied" });

  try {
    const user = await verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### Función `profile`

Asegúrate de que la función `profile` también usa la interfaz extendida:

```typescript
// src/controllers/profile.ts
import { ExtendsRequest } from "../interfaces/extendsRequest.interface";
import { Response } from "express";

export const profile = (req: ExtendsRequest, res: Response) => {
  console.log(req.user?.id);
  res.send('On profile...');
};
```

### Ruta de `auth.routes`

Finalmente, ajusta tu ruta para usar el middleware y la función del controlador:

```typescript
// src/routes/auth.routes.ts
import { Router } from "express";
import { authRequired } from "../middlewares/authRequired";
import { profile } from "../controllers/profile";

const router = Router();

router.get('/profile', authRequired, profile);

export default router;
```

### Verificación del Token

Asegúrate de que tu función de verificación de token devuelve el tipo correcto:

```typescript
// src/libs/jwt.ts
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";

export async function verifyAccessToken(token: string): Promise<{ id: string; exp: number }> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return reject(error);
      }

      // Verifica que el payload decodificado es un objeto
      if (typeof decoded === 'object' && decoded !== null) {
        const { id, exp } = decoded as jwt.JwtPayload;
        resolve({ id, exp });
      } else {
        reject(new Error('Invalid token payload'));
      }
    });
  });
}
```

### Explicación

1. **Interfaz Extendida**: Definimos `ExtendsRequest` para extender `Request` con la propiedad `user`.
2. **Middleware `authRequired`**: Usamos `ExtendsRequest` para que `req.user` sea reconocido.
3. **Función `profile`**: Usamos `ExtendsRequest` para acceder a `req.user`.
4. **Ajuste de Ruta**: La ruta usa el middleware y el controlador.
5. **Verificación del Token**: La función `verifyAccessToken` devuelve un objeto con `id` y `exp`.

Esto debería resolver el error de tipos y asegurarse de que el middleware y las rutas funcionen correctamente con TypeScript.










### Expresiones de tipo:
**Verificación del tipo de dato**:
   ```typescript
   if (typeof decoded === 'object' && decoded !== null)
   ```
   Aquí estamos verificando si el valor de `decoded` es un objeto y no es `null`.

**Conversión de tipo usando `as`**:
   ```typescript
   const { id, exp } = decoded as jwt.JwtPayload;
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
ya puedes acceder a los Campos en tu Función

- **Mongoose Document**: Los documentos de Mongoose tienen métodos y propiedades adicionales que no están presentes en los objetos JSON simples. Asegúrate de trabajar con estos correctamente en TypeScript.

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