### 1. **Asegurarse de que las cookies no son `HttpOnly`**
- Las cookies configuradas con la opción `HttpOnly` **no** pueden ser accesibles mediante JavaScript en el frontend. Si estás utilizando cookies para manejar el token de autenticación y las marcas como `HttpOnly`, estas no estarán disponibles para su lectura en `document.cookie` o `js-cookie`.
- Si **no necesitas** que las cookies sean accesibles en el frontend, puedes seguir usando `HttpOnly` y enviar las cookies automáticamente en cada solicitud HTTP al backend (usando en las peticiones `fetch` o `axios`).

### 2. **Asegurarse de que las cookies están configuradas correctamente con CORS**

Si el frontend y el backend están en dominios diferentes, debes asegurarte de que tanto el servidor como el frontend permiten el uso compartido de cookies a través de solicitudes CORS:

- **Backend (Express):** Deberías tener algo como esto en tu configuración de CORS:
  
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL, // La URL del frontend
    credentials: true // Permitir cookies
  }));
  ```

- **Frontend (Axios o Fetch):** Asegúrate de que estás enviando las credenciales con cada petición. Por ejemplo, en `fetch`:

  ```javascript
  fetch('http://backend-url/api/tasks', {
    method: 'GET',
    credentials: 'include' // Esto asegura que las cookies se envíen
  });
  ```

  Y con `axios`:

  ```javascript
  axios.get('http://backend-url/api/tasks', {
    withCredentials: true // Habilita el envío de cookies
  });
  ```

### 3. **Revisar las propiedades `SameSite` y `Secure` de las cookies**

Si las cookies están configuradas con la propiedad `SameSite` incorrectamente, o si estás en un entorno `http` y la cookie tiene la propiedad `Secure`, entonces el navegador puede bloquear las cookies.

- **En producción**, si el frontend y el backend están en diferentes dominios, asegúrate de usar `SameSite=None` y `Secure=true`. Esto debe configurarse en tu servidor backend.
  
  ```javascript
  res.cookie('token', token, {
    httpOnly: false, // Si necesitas acceder a la cookie desde el frontend
    secure: process.env.NODE_ENV === 'production', // 'true' si usas HTTPS
    sameSite: 'None', // Para que las cookies funcionen en diferentes dominios
  });
  ```

- **En desarrollo**, podrías deshabilitar temporalmente `Secure` y usar `SameSite=Lax`.

### 4. **Probar las cabeceras de la respuesta del servidor**

Verifica en las herramientas de desarrollo de tu navegador (sección "Network" o "Red") que las cookies estén siendo enviadas correctamente desde el backend. Debes buscar en la respuesta HTTP de la solicitud de inicio de sesión para asegurarte de que la cookie del token se está enviando en las cabeceras de respuesta. La cabecera debe verse algo como esto:

```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR...; Path=/; HttpOnly; Secure; SameSite=None
```

Si no ves esta cabecera o si las propiedades de la cookie son incorrectas, puede que ahí esté el problema.

### 5. **Depuración adicional**

1. **Verificar la existencia de cookies desde `document.cookie` directamente**:
   - Asegúrate de que las cookies se estén estableciendo correctamente inspeccionando directamente `document.cookie` en la consola del navegador:
     ```javascript
     console.log(document.cookie);
     ```
   
2. **Revisar las políticas del navegador:**
   - Asegúrate de que el navegador no esté bloqueando cookies de terceros debido a configuraciones de privacidad.
   - Algunas extensiones de navegador pueden estar bloqueando cookies, asegúrate de probar en un navegador limpio.

---

### Alternativa sin cookies `HttpOnly` (utilizando Local Storage)

Si las cookies están siendo un problema por el acceso, puedes considerar almacenar el token en **LocalStorage** o **SessionStorage**, aunque esta no es la forma más segura comparado con `HttpOnly` cookies (ya que las cookies con `HttpOnly` no pueden ser accedidas por scripts, protegiendo un poco más el token). Sin embargo, es una opción en términos de manejo simple:

```javascript
localStorage.setItem('token', token); // Guarda el token
const token = localStorage.getItem('token'); // Obtiene el token
```

### Conclusión:
Es importante verificar cómo las cookies están siendo configuradas en el backend y asegurarse de que se estén manejando correctamente las configuraciones de CORS, `SameSite`, y `Secure`. Si las cookies deben ser accesibles en el frontend, no deben ser `HttpOnly`.

### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
  //add this for GPT4
  """necesito lograr esto de la manera mas profesional posible, usando patrones de diseño, optimizaciones de codigo y de rendimiento, eficiciencia en cuanto empleo de macanismos profesionales,
  
  siempre opto por las maneras mas profesionales y esteticas de conseguirlo, recuerda que siempre busco maneras de hacer mejor las cosas, necesito la forma mas optima en cuanto a rendimiento y escalabilidad, eficiente en cuanto a codigo y profesional en cuanto a empleo de codigo limpio, mejores practicas y patrones de diseño, por favor, dame lo mas profesional que tengas; que cuando el CEO vea mi codigo, se impresione por el modelo de desestructurar datos tan bonita, !VAMOS!"""
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### **Enfoque Usando `MutationObserver`**:
El `MutationObserver` puede observar cambios en el DOM, y aunque no hay una API nativa para observar directamente cambios en las cookies, podemos detectar cambios en el atributo `document.cookie` observando el nodo del documento. Aquí tienes una implementación limpia y profesional:

### **Código para Implementar `MutationObserver` en React:**

```javascript
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => { observerCookies() }, []);
  useEffect(() => { if (token) getTasks() }, [token]);

  const observerCookies = () => {
    const observer = new MutationObserver(() => {
      const cookies = document.cookie;
      const match = cookies.match(/token=([^;]*)/);
      if (match && match[1]) setToken(match[1])
    });
    observer.observe(document, { subtree: true, attributes: true, attributeFilter: ['cookie'] });
    return () => observer.disconnect();
  }
}
```
1. **MutationObserver**: 
   - Se usa para observar cambios en el DOM, específicamente en el atributo `document.cookie`. Cada vez que hay un cambio, el observador se activa y lee el valor de `document.cookie`.
   - Busca la cookie `token` en el documento y, si está presente, la guarda en el estado `token`.

3. **Escalabilidad y Eficiencia**:
   - **Escalable**: No usamos ningún tipo de temporizador, lo que minimiza la sobrecarga y mejora el rendimiento. Este método es completamente reactivo, basado en eventos del DOM.
   - **Eficiente**: Como el `MutationObserver` es un enfoque basado en cambios, no desperdicia recursos revisando periódicamente el estado de las cookies.

4. **Patrones de Diseño**:
   - **Observador**: El patrón `Observer` utilizado aquí es excelente para cuando se necesitan detectar cambios sin intervención manual.
   - **Código Limpio**: separacion clara entre la detección de cookies y lógica de la solicitud de tareas

## Tambien podemos usar setInterval (not recomended)

**Monitorear las Cookies con un Intervalo Temporal Controlado**:
   ```javascript
   const [token, setToken] = useState<Token>(null);

  useEffect(() => { listenCookies() }, []);
  useEffect(() => { getTasks() }, [token]);

  const listenCookies = () => {
    const interval = setInterval(() => checkToken(), 100);
    return () => clearInterval(interval); //when its on avaliable
  }

  const checkToken = () => {
    const cookies = Cookies.get();
    if (token) { setToken(cookies.token) }
  };
   ```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Partials < >
```typescript
import { useTasks } from "../../context/TaskContext";
import { TaskCardProps, createTask } from "../../interfaces/props.interface";

export type Task = { 
  _id: string; 
  title: string; 
  description: string; 
  date: Date;
};

export const createTask = (overrides: Partial<Task> = {}): Task => ({
  _id: '',
  title: '',
  description: '',
  date: new Date(),
  ...overrides
});

function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useTasks();
  const taskWithDefaults = createTask(task);
  return (
    <>
      <h1 className="text-2xl font-bold"> Title: {taskWithDefaults.title} </h1>
    </>
  );
}

export default TaskCard;
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### 1. Uso de Default Values en el Tipado
Podrías aprovechar los valores por defecto en la desestructuración directamente en el componente. Esto ayuda a evitar que tengas que hacer chequeos adicionales para cada propiedad.
```typescript
export type Task = { 
  _id?: string, 
  title?: string, 
  description?: string, 
  date?: Date 
}
function TaskCard({ task = {} as Task }: TaskCardProps) {
  return (
    <h1 className="text-2xl font-bold"> Title: {task.title ?? 'No Title'} </h1>
    <div className="flex gap-x-2 items-center">
      <button onClick={() => deleteTask(task._id ?? '')}>Delete</button>
      <button>Edit</button>
    </div>
  )
}
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Usar Genéricos y Tipos Opcionales

Puedes definir un genérico para tu función `setAuthStatus` y usar tipos opcionales para la respuesta de Axios. Esto te permitirá mantener la flexibilidad y reutilizar la función en diferentes escenarios.

#### Solución Propuesta
Define tu función `setAuthStatus` como un genérico:
```typescript
const setAuthStatus = <T = {}>(res: AxiosResponse<T> | undefined) => {
  setUser(res?.data ?? {});
  setIsAuth(Boolean(res?.data));
  setLoading(false);
};

const verifyToken = async () => {
  if (!Cookies.get().token) return setAuthStatus<{}>(undefined); // Pasando un valor vacío o undefined

  try {
    const res = await tokenCredentialsRequest();
    setAuthStatus(res); // Aquí el tipo es inferido automáticamente
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) setErrors([e.response?.data]);
    setAuthStatus<{}>(undefined);
  }
};
```
Cuando utilices la función dentro de `verifyToken`, puedes beneficiarte de la flexibilidad del tipo genérico:
**Explicación:**
- `T = {}`: Esto indica que el tipo genérico por defecto es un objeto vacío `{}`. Sin embargo, puedes sobrescribir este tipo cuando llamas a la función si esperas una estructura de datos diferente.
- `AxiosResponse<T> | undefined`: Maneja tanto la respuesta de Axios con datos como una posible respuesta `undefined` (cuando no se recibe respuesta o está vacía).

## Usar Tipo Personalizado
Si quieres asegurar que la estructura de la respuesta sea más clara, puedes definir un tipo específico y reutilizarlo:

```typescript
type AuthResponse = { user?: object; token?: string };

const setAuthStatus = (res?: AxiosResponse<AuthResponse>) => {
  setUser(res?.data?.user ?? {});
  setIsAuth(Boolean(res?.data?.user));
  setLoading(false);
};

// Uso en verifyToken
setAuthStatus(res);
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Usar useNavigate() or <Navigate>
### Navigate (Componente):
Navigate es un componente de React Router que redirige automáticamente a una ruta específica cuando se renderiza.
Se usa principalmente cuando necesitas redirigir de forma declarativa, es decir, basado en condiciones dentro del JSX.
Es ideal cuando la redirección depende del resultado de una condición lógica directamente en la estructura de los componentes.
```typescript
if (!isAuth) return <Navigate to="/login" replace />;//El componente Navigate tiene la ventaja de ser conciso y declarativo, ideal para redirecciones inmediatas dentro de la estructura del JSX.
```
### useNavigate (Hook):
useNavigate es un hook de React Router que te permite realizar redirecciones de manera programática desde funciones y efectos (useEffect), dándote más control sobre cuándo y cómo ocurre la redirección.
Se usa principalmente cuando necesitas realizar una navegación como respuesta a eventos, funciones asíncronas, o después de ejecutar lógica adicional.
```typescript
useEffect(() => { if (isAuth) navigate('/tasks') }, [isAuth]);//useNavigate es muy útil en flujos complejos donde la redirección depende de múltiples factores que no puedes determinar solo con JSX.
```
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Uso de Casting (... as Task) ===> ! Prevención !
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
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
### Tipificando las Respuestas en Express:
Es posible que desees controlar el tipo de datos que respondes en res.json. Considera definir una respuesta estructurada con interfaces:
```typescript
interface ResponseData { message: string, data?: string[] }
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

export const tokenCredentialsRequest = async (): Promise<AxiosResponse<UserCredentials>> => axios.get<UserCredentials>('/verify');

//useEffect
useEffect(() => {
    try {
      const res = await tokenCredentialsRequest();
      setUser(res.data);
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) return;
      const errorResponse = e.response?.data as ErrorResponse;
      setErrors(errorResponse.errors)
    }
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
## Retorno de multiples resultados en un unico retorno
### Tipo seguro = res + error opcional
### Tipo funcional = (Result Types o either) => (boolean) + res + error
### Promise<something = {data? error?}>, Promise<Result<> = T | error>

### 1. **Separar la Lógica de Autenticación del Controlador HTTP:**
   ```typescript
   //El controlador HTTP, en cambio, manejaría la lógica de la respuesta.
   async function verifyCredentials(email: string, password: string): Promise<User | null> {// Autenticación (pura lógica)
     const userFound = await User.findOne({ email });
     const isMatch = await verified(password, userFound?.password);
     return isMatch ? userFound : null;
   }
   export const login = async (req: Request, res: Response) => {// Controlador HTTP
       const { email, password } = req.body;
       const user = await verifyCredentials(email, password);
       if (!user) return res.status(403).json(["Invalid credentials"]);
   }
   ```
### 2. **Retornar un Objeto de Resultado con un Tipo Seguro:**
   ```typescript
   //Si prefieres mantener una única función que devuelva más de un tipo de resultado, puedes usar un objeto que envíe de vuelta tanto el usuario como un posible mensaje de error:
   interface CredentialsJWT extends JwtPayload { id?: Schema.Types.ObjectId, error?: string }
   export async function verifyAccessToken(token: string = 'none'): Promise<CredentialsJWT> {
     const access = jwt.verify(token, TOKEN_SECRET) as CredentialsJWT;
     if (!access.id) return { error: 'Invalid token' };
     return access
   }
   const authRequired = async (req: ExtendsRequest, res: Response, next: NextFunction) => {
     const access = await verifyAccessToken(req.cookies.token);
     if ('error' in access) return res.status(401).json([access.error]);
     req.user = access;
     next();
   }
   ```
### 3. **Uso de Result Types o Either (Tipo Funcional):**
   ```typescript
   //Puedes aplicar un patrón funcional que separa claramente los resultados exitosos de los fallidos usando un tipo `Either` o `Result`.
   type Result<T, E> = { ok: true, value: T } | { ok: false, error: E };
   //alternative
   type Result<T, E> = { value: T } | { error: E };

   async function verifyCredentials(email: string, password: string): Promise<Result<User, string>> {
     const userFound = await User.findOne({ email });
     if (!userFound) return { ok: false, error: "User not found" };
     return { ok: true, value: userFound };
   }
   export const login = async (req: Request, res: Response) => {
       const { email, password } = req.body;
       const result = await verifyCredentials(email, password);
       if (!result.ok) return res.status(403).json([result.error]);
       //alternative (Destructuración del `Result`)
       if ('error' in user) return res.status(403).json([user.error]);

   }
   ```
- **Primera opción (separación de responsabilidades)**: Mantiene la lógica simple y desacoplada, permitiendo pruebas más sencillas y código reutilizable.
- **Segunda opción (objeto de resultado)**: Flexibilidad para manejar múltiples resultados dentro de un único retorno, ideal para casos más complejos.
- **Tercera opción (result types o either)**: Profesional y con un enfoque funcional, mejora la claridad y reduce la ambigüedad en los tipos retornados.
### ---------------------------------------------------------------------------------------------------- ###

### ---------------------------------------------------------------------------------------------------- ###
## Type Guard (`e is ErrorResponse`)
Un **type guard** es una función que ayuda a refinar el tipo de una variable en TypeScript, permitiéndote validar si un valor desconocido cumple con una estructura específica.
```typescript
(e: unknown): e is ErrorResponse
```
- **`e: unknown`**: Esto indica que el parámetro `e` es de tipo `unknown`, que es el tipo más genérico y seguro para recibir valores desconocidos. Este tipo requiere que hagas validaciones explícitas antes de tratar con el valor.
- **`e is ErrorResponse`**: Aquí es donde se define el **type guard**. Este patrón le dice a TypeScript que, si la función devuelve `true`, entonces `e` se debe considerar del tipo `ErrorResponse`. Esto es crucial, porque permite a TypeScript inferir el tipo dentro de la función donde se use este guardián.

El uso de un **type guard** como este te permite trabajar con valores de tipos desconocidos de forma segura y con las garantías de TypeScript. Una vez que TypeScript sabe que un valor es de un tipo específico, puedes acceder a sus propiedades sin problemas.
```typescript
function isErrorResponse(e: unknown): e is ErrorResponse {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    typeof (e as any).response === "object" &&
    "data" in (e as any.response)
  )
}
//Tal vez estés más familiarizado con una sintaxis más simple, como esta
function isErrorResponse(e: unknown): boolean {
  return (e as ErrorResponse).response !== undefined;
}
```
El problema con esta aproximación es que asume que "e" es un ErrorResponse sin realizar las validaciones necesarias. Esto puede llevar a errores si el objeto no tiene la estructura correcta, causando posibles fallos en tiempo de ejecución.

## Type Assertion (`e as any`)
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
   - `interface` no permite uniones directamente pero puede ser extendida o implementada.
   - `type` permite definir uniones y tuplas directamente, lo cual es útil en ciertos casos.

3. **Uso en bibliotecas y definiciones de API**:
   - `interface` es generalmente preferida en definiciones de bibliotecas públicas y APIs debido a su capacidad de declaración incremental.
   - `type` es más flexible y se suele usar en definiciones más específicas o internas.

4. **Composición**:
   - Ambos pueden ser compuestos, pero con sintaxis ligeramente diferentes. `interface` usa `extends` y `type` usa intersecciones (`&`).
```typescript
type PropsWithChildren<P> = P & { children?: ReactNode }
type User = { id: string, name: string, email: string } | {}

interface AuthContextType {
  user: User;
  signin: (user: object) => Promise<void>;
  signup: (user: object) => Promise<void>;
}
```
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