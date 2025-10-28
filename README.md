# MathSEQ Backend - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
mathseq-backend/
├── src/                    # Código fuente principal
│   └── app.js             # Configuración de la aplicación Express
├── config/                 # Configuraciones
│   ├── index.js           # Configuración principal
│   └── database.js        # Configuración de base de datos
├── routes/                 # Definición de rutas
│   ├── index.js           # Rutas principales
│   ├── usuarioRoutes.js   # Rutas de usuarios
│   └── moduloRoutes.js    # Rutas de módulos
├── controllers/            # Lógica de negocio
│   ├── usuarioController.js   # Controlador de usuarios
│   └── moduloController.js    # Controlador de módulos
├── middleware/             # Middleware personalizado
│   ├── auth.js            # Autenticación y autorización
│   └── cors.js            # Configuración CORS
├── models/                 # Modelos de datos (futuro)
├── utils/                  # Utilidades y helpers
│   └── index.js           # Utilidades generales
├── server.js              # Punto de entrada principal
└── package.json           # Dependencias y scripts
```

## 🚀 Características Implementadas

### ✅ Estructura Modular
- Separación clara de responsabilidades
- Código organizado y escalable
- Fácil mantenimiento y testing

### ✅ Configuración Centralizada
- Variables de entorno manejadas correctamente
- Configuración de base de datos separada
- Configuración de seguridad centralizada

### ✅ Middleware Avanzado
- Autenticación JWT
- Autorización por roles
- Validación de datos
- Manejo de errores
- Logging de requests

### ✅ Rutas Modulares
- Rutas organizadas por funcionalidad
- Controladores separados
- Fácil adición de nuevas funcionalidades

### ✅ Utilidades
- Helpers para validación
- Utilidades de base de datos
- Sistema de logging
- Respuestas HTTP estandarizadas

## 🔧 Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Configura tus variables de base de datos

3. **Ejecutar el servidor:**
   ```bash
   npm start
   ```

4. **Modo desarrollo:**
   ```bash
   npm run dev
   ```

## 📋 Endpoints Disponibles

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios/register` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Login de usuario
- `GET /api/usuarios/login` - Login por query params

### Módulos
- `GET /api/modulos` - Obtener todos los módulos
- `GET /api/modulos/:id` - Obtener módulo por ID
- `POST /api/modulos` - Crear nuevo módulo
- `PUT /api/modulos/:id` - Actualizar módulo
- `DELETE /api/modulos/:id` - Eliminar módulo

### Sistema
- `GET /` - Estado del servidor
- `GET /health` - Health check del servidor

## 🔒 Seguridad

- Encriptación de contraseñas con bcrypt
- Validación de datos de entrada
- Manejo seguro de errores
- Configuración CORS personalizable
- Autenticación JWT (preparado para implementar)

## 🛠️ Próximas Mejoras

- [ ] Implementar autenticación JWT completa
- [ ] Agregar tests unitarios
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Logging a archivos
- [ ] Dockerización
- [ ] CI/CD pipeline
