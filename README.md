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
El error "MongoServerError: bad auth: authentication failed" indica que hay un problema con las credenciales de autenticación que estás usando para conectarte a MongoDB Atlas. Aquí hay algunos pasos que puedes seguir para resolver este problema:

### Pasos para Solucionar el Error de Autenticación en MongoDB Atlas
#### 1. Verifica las Credenciales
Asegúrate de que el nombre de usuario y la contraseña están correctamente ingresados en la cadena de conexión:
#### 2. Verifica los Permisos del Usuario
En MongoDB Atlas:
1. Ve a la sección **Database Access** en tu proyecto de MongoDB Atlas.
2. Asegúrate de que el usuario `avilesmaicol08` existe y tiene los permisos necesarios.
3. Si no, crea un nuevo usuario o edita los permisos del usuario existente.
#### 3. Verifica la Configuración de Red
En MongoDB Atlas:
1. Ve a la sección **Network Access**.
2. Asegúrate de que tu dirección IP está en la lista de IPs permitidas.
3. Añade tu dirección IP actual o permite el acceso desde cualquier IP (0.0.0.0/0) para pruebas (no recomendado para producción).