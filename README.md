Usar el casting directo como `res.data as Tasks` es una técnica común, pero puede ser riesgosa si no estás completamente seguro del tipo de datos que recibirás. Aquí te explico algunas consideraciones y mejores prácticas para asegurar un código más robusto:
### 1. **Evitar el Casting Directo en Favor de la Validación**:
   El casting directo no garantiza que `res.data` tenga realmente el formato esperado. Si la API devuelve un objeto inesperado, podrías terminar con errores difíciles de detectar.
   Una manera más limpia es definir el tipo esperado cuando haces la petición con Axios:
   ```typescript
   interface Task {id: string, title: string, description: string, date: Date}
   type Tasks = Task[];
   import axios, { AxiosResponse } from 'axios';
   export const getTasksRequest = async (): Promise<AxiosResponse<Tasks>> => axios.get('/tasks');
   const getTasks = async () => {
     const res = await getTasksRequest();
     setTasks(res.data);
   };
   ```
   Así, `res.data` ya estará tipado correctamente y evitarás hacer un casting manual.
### 2. **Uso de Type Assertions con Precaución**:
   Si decides mantener el casting, ten en cuenta que es una "apuesta" sobre la estructura de los datos. A veces es inevitable, pero debería usarse solo cuando estés seguro de los datos:
   ```typescript
   setTasks(res.data as Tasks);
   ```
   Esto puede ser útil en prototipos o cuando controlas completamente la API, pero ten cuidado si trabajas con datos que pueden variar.
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### Tipificando las Respuestas en Express:
Es posible que desees controlar el tipo de datos que respondes en res.json. Considera definir una respuesta estructurada con interfaces:

```typescript
interface ResponseData {
  message: string;
  data?: string[]; // O un tipo más específico si el contenido varía.
}

res.status(200).json({ message: messageFormat(tasks) } as ResponseData);
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### Paso 1: Definir Tipos de Respuesta
```ts
interface UserCredentials {
  email: string;
  username: string;
}

import { AxiosResponse } from "axios";

export const tokenCredentialsRequest = async (): Promise<AxiosResponse<UserCredentials>> => {
  return axios.get<UserCredentials>('/verify');
};

//useEffect
useEffect(() => {
  const checkCredentials = async () => {
    try {
      const res = await tokenCredentialsRequest();
      setUser(res.data);
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) return;
      const errorResponse = e.response?.data as ErrorResponse;
      setErrors(errorResponse.errors);
      setIsAuth(false);
      setUser({});
    };

  checkCredentials();
}, []);
```
### Tipo Condicional para la Respuesta
```ts
type ApiResponse<T> = T | { errors: string[] };

export const tokenCredentialsRequest = async (): Promise<AxiosResponse<ApiResponse<UserCredentials>>> => {
  return axios.get<ApiResponse<UserCredentials>>('/verify');
};
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Opciones profesionales para trabajar con diferentes retornos
### 1. **Separar la Lógica de Autenticación del Controlador HTTP:**
   Una opción es hacer que `verifyCredentials` solo se encargue de verificar las credenciales y devolver el usuario si es válido o `null` si no lo es. El controlador HTTP, en cambio, manejaría la lógica de la respuesta.

   ```typescript
   // Autenticación (pura lógica)
   async function verifyCredentials(email: string, password: string): Promise<User | null> {
     const userFound = await User.findOne({ email });
     const isMatch = await verified(password, userFound?.password);
     return isMatch ? userFound : null;
   }

   // Controlador HTTP
   export const login = async (req: Request, res: Response) => {
     try {
       const { email, password } = req.body;
       const user = await verifyCredentials(email, password);
       if (!user) return res.status(403).json(["Invalid credentials"]);
       ...
     }
   }
   ```

### 2. **Retornar un Objeto de Resultado con un Tipo Seguro:**
   Si prefieres mantener una única función que devuelva más de un tipo de resultado, puedes usar un objeto que envíe de vuelta tanto el usuario como un posible mensaje de error:

   ```typescript
   interface VerifyCredentialsResult { user?: User, error?: string }

   async function verifyCredentials(email: string, password: string): Promise<VerifyCredentialsResult> {
     const userFound = await User.findOne({ email });
     if (!userFound) return { error: "User not found" };
     const isMatch = await verified(password, userFound.password);
     if (!isMatch) return { error: "Invalid credentials" };
     return { user: userFound };
   }

   export const login = async (req: Request, res: Response) => {
     try {
       const { email, password } = req.body;
       const { user, error } = await verifyCredentials(email, password);
       if (error) return res.status(403).json([error]);
       ...
     }
   }
   ```

### 3. **Uso de Result Types o Either (Tipo Funcional):**
   Puedes aplicar un patrón funcional que separa claramente los resultados exitosos de los fallidos usando un tipo `Either` o `Result`.Este enfoque es ideal si buscas un código altamente mantenible y limpio:

   ```typescript
   type Result<T, E> = { ok: true, value: T } | { ok: false, error: E };

   async function verifyCredentials(email: string, password: string): Promise<Result<User, string>> {
     const userFound = await User.findOne({ email });
     if (!userFound) return { ok: false, error: "User not found" };
     const isMatch = await verified(password, userFound.password);
     if (!isMatch) return { ok: false, error: "Invalid credentials" };
     return { ok: true, value: userFound };
   }

   export const login = async (req: Request, res: Response) => {
     try {
       const { email, password } = req.body;
       const result = await verifyCredentials(email, password);
       if (!result.ok) return res.status(403).json([result.error]);
       ...
     }
   }
   ```

- **Primera opción (separación de responsabilidades)**: Mantiene la lógica simple y desacoplada, permitiendo pruebas más sencillas y código reutilizable.
- **Segunda opción (objeto de resultado)**: Flexibilidad para manejar múltiples resultados dentro de un único retorno, ideal para casos más complejos.
- **Tercera opción (result types o either)**: Profesional y con un enfoque funcional, mejora la claridad y reduce la ambigüedad en los tipos retornados.

### Alternativas:
-**Segunda opcion** Podemos hacer un comportamiento similar a este:
```typescript
interface CredentialsJWT extends JwtPayload { id?: Schema.Types.ObjectId, error?: string }

export async function verifyAccessToken(token: string = 'none'): Promise<CredentialsJWT> {
  try {
    const access = jwt.verify(token, TOKEN_SECRET) as CredentialsJWT;
    if (token === 'none') return { error: 'Token not found, auth denied' };
    if (!access.id) return { error: 'Invalid token' };
    return access
  } catch (e) { return { error: 'Expired token' } }
}

const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
  const access = await verifyAccessToken(req.cookies.token);
  if ('error' in access) return res.status(401).json([access.error]);
  req.user = access;
  next();
}
```

-**Tercera opcion** Si prefieres algo más explícito y con menos validaciones, podrías usar una discriminated union (unión discriminada) en lugar de solo basarte en la existencia de las propiedades:
```typescript
   export type Result<T, E> = { success: true; value: T } | { success: false; error: E };
   //Con esto, el código sería:
   const user = await verifyCredentials(email, password);
   if (!user.success) return res.status(403).json([user.error]);
   return res.json({ id: user.value._id });

   //or

   //**Destructuración del `Result`:** Cuando uses esta estructura, asegúrate de manejarla con un patrón claro:    
   const result = await verifyCredentials(email, password);
   if ('error' in result) return console.error(result.error.message);
   const user = result.value;
```

### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## 1. **Type Guard (`e is ErrorResponse`)**
La clave en esta función es la parte `e is ErrorResponse` en la declaración:
Un **type guard** es una función que ayuda a refinar el tipo de una variable en TypeScript, permitiéndote validar si un valor desconocido cumple con una estructura específica.
```typescript
(e: unknown): e is ErrorResponse
```
- **`e: unknown`**: Esto indica que el parámetro `e` es de tipo `unknown`, que es el tipo más genérico y seguro para recibir valores desconocidos. Este tipo requiere que hagas validaciones explícitas antes de tratar con el valor.
- **`e is ErrorResponse`**: Aquí es donde se define el **type guard**. Este patrón le dice a TypeScript que, si la función devuelve `true`, entonces `e` se debe considerar del tipo `ErrorResponse`. Esto es crucial, porque permite a TypeScript inferir el tipo dentro de la función donde se use este guardián.

El uso de un **type guard** como este te permite trabajar con valores de tipos desconocidos de forma segura y con las garantías de TypeScript. Una vez que TypeScript sabe que un valor es de un tipo específico, puedes acceder a sus propiedades sin problemas.
```typescript
function isErrorResponse(e: unknown): e is ErrorResponse {
  return (typeof e === "object" && e !== null && "response" in e && typeof (e as any).response === "object" && "data" in (e as any.response);
}
function isErrorResponse(e: unknown): boolean {//Tal vez estés más familiarizado con una sintaxis más simple, como esta
  return (e as ErrorResponse).response !== undefined;
}
```
El problema con esta aproximación es que asume que "e" es un ErrorResponse sin realizar las validaciones necesarias. Esto puede llevar a errores si el objeto no tiene la estructura correcta, causando posibles fallos en tiempo de ejecución.

## 2. **Type Assertion (`e as any`)**
Por ejemplo puedes decirle a TypeScript que tratas a `e` como cualquier objeto para poder acceder a sus propiedades

Tenemos las siguientes situaciones
- **`typeof e === "object"`**: Esta validación comprueba si `e` es un objeto. En JavaScript y TypeScript, cualquier cosa que no sea `null`, `undefined`, o un tipo primitivo (como `string`, `number`, etc.) es considerada un objeto.
- **`e !== null`**: Aunque `null` es técnicamente un "objeto" en JavaScript, se añade esta condición para asegurarse de que `e` no sea `null`, evitando errores de acceso a propiedades.
- **`"response" in e`**: Aquí se usa la sintaxis `"propiedad" in objeto`, que verifica si la propiedad `response` existe dentro del objeto `e`. Es una forma eficiente y segura de comprobar la presencia de propiedades en un objeto.
- **`typeof (e as any).response === "object"`**: Una vez que se confirma que `response` existe, se asegura que `response` también sea un objeto. La parte `(e as any)` es un **type assertion** para decirle a TypeScript que tratas a `e` como cualquier objeto para poder acceder a sus propiedades.
- **`"data" in (e as any).response`**: Finalmente, verifica que la propiedad `data` esté dentro del objeto `response`.
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
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