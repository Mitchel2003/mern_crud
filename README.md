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


Entiendo que quieres conectar tu aplicación a MongoDB utilizando `mongosh` (MongoDB Shell). `mongosh` es una herramienta de línea de comandos que te permite interactuar con MongoDB. Aquí te proporcionaré una guía para instalar `mongosh`, conectarte a tu base de datos MongoDB local y luego usar esos detalles para configurar la conexión en tu aplicación.

### Instalación de `mongosh`

#### 1. Descargar `mongosh`

Puedes descargar `mongosh` desde el sitio web oficial de MongoDB: [Descargar MongoDB Shell](https://www.mongodb.com/try/download/shell)

Selecciona el paquete correspondiente a tu sistema operativo y sigue las instrucciones de instalación.

#### 2. Conectar a MongoDB con `mongosh`

Una vez instalado, puedes usar `mongosh` para conectarte a tu instancia de MongoDB local:

```sh
mongosh
```

Esto abrirá el shell de MongoDB. Si tu MongoDB está corriendo en el puerto predeterminado (27017), `mongosh` se conectará automáticamente. Si no, puedes especificar la URL de conexión manualmente:

```sh
mongosh "mongodb://localhost:27017"
```

### Crear Conexión con MongoDB en tu Aplicación

#### 1. Asegúrate de que MongoDB está corriendo

Si estás usando MongoDB localmente, asegúrate de que el servidor MongoDB esté en ejecución. Puedes iniciarlo usando:

- **Windows:**
  ```sh
  mongod
  ```

- **macOS/Linux:**
  ```sh
  sudo service mongod start
  ```

#### 2. Conectar tu Aplicación a MongoDB

Utilizando Mongoose en tu proyecto TypeScript para conectar a MongoDB:

1. **Instalar Mongoose y sus tipos**:

   ```sh
   npm install mongoose
   npm install @types/mongoose --save-dev
   ```

2. **Configurar la conexión en tu aplicación**:

   - **db.ts**:
     ```typescript
     import mongoose from 'mongoose';

     export const connectionDB = async () => {
       try {
         await mongoose.connect('mongodb://localhost:27017/mern-crud-db', {
           useNewUrlParser: true,
           useUnifiedTopology: true,
         });
         console.log("Connection successful");
       } catch (e) {
         console.log("Error trying to connect with database: " + e);
       }
     };
     ```

   - **index.ts**:
     ```typescript
     import { connectionDB } from './db';
     import app from './app';

     connectionDB();
     app.listen(3000, () => {
       console.log('Server running on port 3000');
     });
     ```

### Verificación de la Conexión

Para verificar que tu aplicación se conecta correctamente a MongoDB:

1. Asegúrate de que `mongod` (el servidor MongoDB) está corriendo.
2. Ejecuta tu aplicación:
   ```sh
   npm start
   ```
3. Verifica en los logs de tu aplicación que ves el mensaje "Connection successful".

### Troubleshooting

Si sigues teniendo problemas, aquí hay algunos pasos adicionales:

- **Verifica el estado de MongoDB**:
  ```sh
  mongosh
  ```

- **Verifica la URL de conexión**: Asegúrate de que estás usando la URL correcta (`mongodb://localhost:27017/mern-crud-db`).

- **Logs de MongoDB**: Revisa los logs de MongoDB para ver si hay algún error específico.

Siguiendo estos pasos, deberías poder conectarte a MongoDB localmente y configurar tu aplicación para interactuar con la base de datos.