163.172.189.23

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