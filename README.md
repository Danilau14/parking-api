# Parking API

## 📌 Descripción
Parking API es un sistema para gestionar estacionamientos, incluyendo el registro de vehículos, administración de socios y el envío de notificaciones por correo.

---

## Requisitos del proyecto
```bash
  - Node.js (v20.19.0)
  - npm (10.8.2)
  - postgresql(16)
```

## 🚀 Instalación

### 1️⃣ Clonar el repositorio
```bash
  git clone https://github.com/Danilau14/parking-api.git
  cd parking-api
```

### 2️⃣ Instalar dependencias
```bash
  npm install
```

### 3️⃣ Configurar variables de entorno
Crear un archivo `/env/.env.development` en la raíz del proyecto y definir las siguientes variables:
```env
PSQL_USERNAME=admin
PSQL_PASSWORD=password
PSQL_HOST=127.0.0.1
PSQL_PORT=5432
PSQL_DATABASE=parking-api
PORT=3000
PORT_MICROSERVICE=4000
HOST_MICROSERVICE=http://localhost
NODE_ENV=development
JWT_SECRET=mySuperSecretKey
JWT_EXPIRES_IN=6h
MAIL_HOST=mailhog
MAIL_PORT=1025
```

---

## 🐳 Configuración con Docker
Si deseas correr el servicio con Docker, usa:
```bash
  docker-compose up -d --build
```
Esto levantará la base de datos y MailHog para pruebas de correo.

---

## 🔥 Ejecución

### En modo desarrollo
```bash
  npm run start:dev
```
Cuando lo ejecutes te preguntará cuál de los dos microservicios deseas levantar.

---

## 🌱 Generación de datos iniciales (Seed)
Para poblar la base de datos con datos iniciales, ejecuta:
```bash
  npm run seed
```
Esto creará usuarios iniciales con contraseñas encriptadas y datos básicos necesarios para el funcionamiento del sistema.

Si estás en **Windows**, asegúrate de usar `cross-env` para evitar problemas de variables de entorno:
```json
  "scripts": {
    "seed": "cross-env NODE_ENV=development npx ts-node apps/parking-api/src/database/seed.ts"
  }
```
Además, puedes configurar Git para manejar correctamente los saltos de línea con:
```bash
  git config --global core.autocrlf true
```

---

## 🛠 Tecnologías Utilizadas
- **NestJS** como framework backend
- **PostgreSQL** como base de datos
- **TypeORM** para gestión de entidades
- **JWT** para autenticación
- **Docker** para despliegue y base de datos

---

## 🏗 Estructura del Proyecto
```
apps/
  ├── parking-api/    # API principal
  ├── sendEmail/      # Microservicio de notificación

src/
  ├── auth/           # Módulo de autenticación
  ├── users/          # Módulo de usuarios
  ├── vehicles/       # Módulo de vehículos
  ├── parking-lots/   # Módulo de parqueaderos
  ├── parking-history/# Módulo de Historial de registros
  ├── common/         # Decoradores y utilidades
```
📖 Documentación en Postman

Puedes importar la colección de Postman con los endpoints desde el siguiente enlace:
📌 **[Colección en Postman](https://documenter.getpostman.com/view/24949435/2sB2cSfNxf#4e58ae12-1910-4001-bce4-e0f4a16ba99e)**


Si deseas integrarlo con tu repo, sigue estos pasos en Postman:
1️⃣ Ve a Workspaces → New Workspace → Create workspace
2️⃣ Importa la colección JSON
3️⃣ Conéctalo con tu repo de GitHub desde la opción Integrations


