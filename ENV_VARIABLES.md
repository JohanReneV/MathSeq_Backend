# Variables de Entorno Requeridas

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno:

## Variables Obligatorias

### Base de Datos
- `DB_HOST`: Host de la base de datos (ej: localhost)
- `DB_USER`: Usuario de la base de datos
- `DB_PASS`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `DB_PORT`: Puerto de la base de datos (ej: 3306)

### Seguridad
- `JWT_SECRET`: Secreto para firmar tokens JWT (debe ser una cadena larga y aleatoria)

## Variables Opcionales

### Servidor
- `PORT`: Puerto del servidor (por defecto: 3000, **Render lo configura automáticamente**)
- `HOST`: Host del servidor (por defecto: localhost, **se configura automáticamente en producción**)
- `NODE_ENV`: Entorno de ejecución (development/production)

### CORS
- `CORS_ORIGIN`: Origen permitido para CORS (por defecto: *)

## Configuración para Render

Para el despliegue en Render, las siguientes variables se configuran automáticamente:
- `PORT`: Render asigna automáticamente un puerto
- `HOST`: Se configura automáticamente como `0.0.0.0` en producción
- `NODE_ENV`: Se establece como `production`

**Variables que DEBES configurar manualmente en Render:**
- `JWT_SECRET`: Genera un valor seguro (puedes usar el generador de Render)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configuración de tu base de datos

## Ejemplo de archivo .env

```env
# Configuración del servidor
PORT=3000
HOST=localhost
NODE_ENV=development

# Configuración de la base de datos
DB_HOST=localhost
DB_USER=tu_usuario_db
DB_PASS=tu_contraseña_db
DB_NAME=mathseq_db
DB_PORT=3306

# Configuración de seguridad
JWT_SECRET=tu-secreto-jwt-super-seguro-aqui

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000
```

## Nota Importante

**NUNCA** subas el archivo `.env` al repositorio. Asegúrate de que esté en tu `.gitignore`.
