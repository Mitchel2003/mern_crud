### Diferencias clave entre `type` e `interface`
1. **Extensibilidad**:
   - `interface` permite la declaración incremental, es decir, se pueden declarar múltiples interfaces con el mismo nombre y TypeScript las combinará automáticamente.
   - `type` no permite la declaración incremental. Sin embargo, puedes extender tipos usando intersecciones (`&`).

2. **Uso de Unión y Tuplas**:
   - `type` permite definir uniones y tuplas directamente, lo cual es útil en ciertos casos.
   - `interface` no permite uniones directamente pero puede ser extendida o implementada.

3. **Uso en bibliotecas y definiciones de API**:
   - `interface` es generalmente preferida en definiciones de bibliotecas públicas y APIs debido a su capacidad de declaración incremental.
   - `type` es más flexible y se suele usar en definiciones más específicas o internas.

4. **Composición**:
   - Ambos pueden ser compuestos, pero con sintaxis ligeramente diferentes. `interface` usa `extends` y `type` usa intersecciones (`&`).
```typescript
type PropsWithChildren<P> = P & { children?: ReactNode };
```
### ¿Cuál es más profesional?
Ambos enfoques son válidos y profesionales, y la elección depende del contexto y las preferencias del equipo. Sin embargo, aquí hay algunas recomendaciones de mejores prácticas:
- **Para definiciones simples y específicas**: Usar `type` es una buena opción debido a su flexibilidad.
- **Para definiciones públicas y extensibles**: Usar `interface` puede ser preferible debido a su capacidad de extensión incremental.


```typescript
interface User {
  // Define aquí las propiedades de tu usuario, por ejemplo:
  id: string;
  name: string;
  email: string;
  // Añade las propiedades necesarias
}

interface AuthContextType {
  user: User | null;
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
}
```

### Modificación del contexto y el proveedor
Luego, usa estos tipos en tu contexto y proveedor:

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const signin = async (user: object) => {
    const res = await loginRequest(user);
    setUser(res.data);
  }

  const signup = async (user: object) => {
    const res = await registerRequest(user);
    setUser(res.data);
  }

  return (
    <AuthContext.Provider value={{ user, signin, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Modificación del componente Register
Asegúrate de que el componente que consume el contexto esté utilizando el hook `useAuth` correctamente:

```typescript
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register, handleSubmit } = useForm();
  const { signup } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      await signup(data);
      // Manejar el registro exitoso aquí
    } catch (error) {
      // Manejar errores aquí
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      <input {...register('password')} type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
```

### Detalles de las mejoras:
1. **Tipos explícitos**: Definir `AuthContextType` asegura que TypeScript pueda verificar correctamente los tipos y prevenir errores como el que mencionaste.
2. **Manejo de estado con tipos claros**: Usar `User | null` para el estado `user` proporciona claridad sobre los posibles valores.
3. **Uso adecuado de contextos**: Proveer un tipo `undefined` inicial para `createContext` y luego lanzar un error en `useAuth` si el contexto no está definido asegura que el hook se use correctamente.

### Beneficios:
- **Menos errores en tiempo de desarrollo**: Gracias a los tipos, TypeScript te alertará sobre cualquier uso incorrecto del contexto.
- **Código más mantenible y legible**: Los tipos explícitos y las verificaciones claras hacen que el código sea más fácil de entender y mantener.
- **Buenas prácticas**: Este enfoque sigue las mejores prácticas para el uso de contextos y hooks en React con TypeScript.

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