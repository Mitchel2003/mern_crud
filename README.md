En Mongoose, al habilitar `timestamps`, se agregan automáticamente dos campos a cada documento: `createdAt` y `updatedAt`. Sin embargo, para que estos campos sean accesibles, debes asegurarte de que el esquema y los tipos estén correctamente definidos y que estés accediendo a los campos correctos en tu código.

### 1. Actualiza tu Esquema para Usar Timestamps

Tu esquema ya está configurado correctamente para usar timestamps:

```typescript
import User from "../interfaces/user.interface";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('user', userSchema);
```

### 2. Define los Tipos en tu Interfaz

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

### 3. Accede a los Campos en tu Función

Al devolver el objeto JSON en tu función `validateCredentials`, asegúrate de acceder correctamente a los campos:

```typescript
import { Request, Response } from 'express';
import User from './models/User';  // Asegúrate de importar tu modelo de usuario
import { verified } from './utils/auth';  // Asegúrate de importar la función verified

async function validateCredentials(req: Request, res: Response) {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });

  if (!userFound) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await verified(password, userFound.password);

  if (isMatch) {
    return res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      updatedAt: userFound.updatedAt
    });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
}
```

### Explicación

1. **Interfaz Actualizada**: La interfaz `User` ahora incluye los campos `createdAt` y `updatedAt`.
2. **Acceso a Campos**: En la función `validateCredentials`, accedes al campo `updatedAt` usando `userFound.updatedAt`.

### Consideraciones Adicionales

- **Verificar los Campos**: Si `updatedAt` sigue sin estar disponible, asegúrate de que el documento en la base de datos tenga este campo. Puedes hacer esto inspeccionando el documento directamente en MongoDB.
- **Mongoose Document**: Los documentos de Mongoose tienen métodos y propiedades adicionales que no están presentes en los objetos JSON simples. Asegúrate de trabajar con estos correctamente en TypeScript.

Con estas modificaciones, deberías poder acceder y devolver el campo `updatedAt` correctamente en tu respuesta JSON.

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