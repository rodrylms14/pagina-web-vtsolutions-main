# VT Solutions – Pruebas de Rendimiento con Apache JMeter

## Caso de Estudio #2 – Universidad CENFOTEC

### 1. Descripción

Este proyecto tiene como objetivo realizar pruebas de rendimiento sobre la API REST de VT Solutions, una aplicación web de comercio electrónico.

Las pruebas se implementan mediante Apache JMeter, utilizando solicitudes HTTP, variables de configuración, validaciones de respuestas y extracción de datos JSON.

### 2. Tecnologías utilizadas

- Backend: Node.js y Express.
- Base de datos: MongoDB y Mongoose.
- Herramienta de pruebas: Apache JMeter 5.6.3.
- Java: versión 21.
- API local: `http://localhost:4000`.

### 3. Endpoints configurados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categories` | Consultar categorías |
| GET | `/api/products` | Consultar productos |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/cart/${USER_ID}` | Consultar carrito |
| GET | `/api/orders/${USER_ID}` | Consultar pedidos |

### 4. Configuración inicial de JMeter

El archivo principal es `VT_Solutions_Performance_Test.jmx`.

La configuración inicial utiliza:

- 5 usuarios virtuales.
- Ramp-up de 10 segundos.
- 1 iteración por usuario.
- Variables `HOST`, `PORT` y `USER_ID`.
- Validaciones de código HTTP 200.
- Validación JSON para el inicio de sesión.
- JSON Extractor para almacenar el ID del usuario autenticado en `LOGIN_USER_ID`.

### 5. Resultados de verificación inicial

Se realizó una ejecución técnica inicial con los siguientes resultados:

| Métrica | Resultado |
|---|---|
| Solicitudes HTTP | 25 |
| Errores | 0 (0.00%) |
| Tiempo promedio | 18 ms |
| Tiempo mínimo | 5 ms |
| Tiempo máximo | 134 ms |
| Throughput | 3.1 solicitudes/segundo |

Estos resultados corresponden a una verificación local inicial y no constituyen los resultados definitivos del estudio de rendimiento.

### 6. Trabajo pendiente

La Persona 2 continuará con la parametrización mediante CSV Data Set Config, la ejecución de escenarios de carga y el registro de resultados.

La Persona 3 utilizará las métricas obtenidas para elaborar el análisis, las conclusiones y la presentación del caso de estudio.

## 7. Preparación del entorno y restauración de MongoDB

### 7.1. Requisitos previos

Para ejecutar las pruebas se necesita:

- Node.js y npm.
- MongoDB Server 8.0 o una versión compatible.
- MongoDB Compass (opcional, para verificar los datos).
- MongoDB Database Tools (`mongorestore`).
- Apache JMeter 5.6.3.
- Java 21.

### 7.2. Iniciar MongoDB Server

Abrir PowerShell y ejecutar:

```powershell
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
```

Mantener abierta esta terminal mientras se realizan las pruebas.

La ruta corresponde a la instalación utilizada durante el desarrollo y puede variar en otras computadoras.

### 7.3. Restaurar la base de datos

El proyecto dispone de un respaldo de la base de datos `vt_solutions` en:

`database/backup/vt_solutions/`

El respaldo contiene cinco colecciones:

| Colección | Documentos |
|---|---:|
| categories | 2 |
| products | 2 |
| carts | 1 |
| users | 1 |
| orders | 1 |

**Importante:** restaurar preferiblemente sobre una base de datos nueva o vacía, para evitar conflictos con documentos existentes.

Desde la carpeta principal del proyecto, ejecutar:

```powershell
& "C:\Program Files\MongoDB\Tools\100\bin\mongorestore.exe" --uri="mongodb://localhost:27017" --nsInclude="vt_solutions.*" ".\database\backup"
```

No utilizar `--drop` sin comprobar previamente que la base de datos de destino puede eliminarse.

### 7.4. Verificar la base de datos

Abrir MongoDB Compass y conectarse a:

`mongodb://localhost:27017`

Verificar que exista la base de datos `vt_solutions` y que contenga las cinco colecciones indicadas.

### 7.5. Levantar el backend

Abrir otra terminal PowerShell desde la carpeta principal del proyecto y ejecutar:

```powershell
cd backend
npm install
npm run dev
```

El servidor debe quedar disponible en:

`http://localhost:4000`

Mantener abierta la terminal del backend durante las pruebas.

### 7.6. Comprobar la API

Desde otra terminal PowerShell, ejecutar:

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/categories" -Method Get
```

Se debe recibir una respuesta JSON con las categorías registradas.

Si el servidor responde correctamente, el entorno estará preparado para ejecutar las pruebas de JMeter.

## 8. Ejecución de pruebas con Apache JMeter

### 8.1. Preparar el entorno

Antes de ejecutar JMeter, verificar que:

- MongoDB Server esté funcionando.
- La base de datos `vt_solutions` contenga los registros de prueba.
- El backend esté ejecutándose en `http://localhost:4000`.
- Apache JMeter y Java estén instalados.
- El archivo `jmeter/VT_Solutions_Performance_Test.jmx` esté disponible.

### 8.2. Configuración del plan de pruebas

El plan contiene cinco solicitudes HTTP:

1. GET `/api/categories`
2. GET `/api/products`
3. POST `/api/auth/login`
4. GET `/api/cart/${USER_ID}`
5. GET `/api/orders/${USER_ID}`

La configuración inicial utiliza cinco usuarios virtuales, un ramp-up de diez segundos y una iteración.

Las variables `HOST`, `PORT` y `USER_ID` se encuentran definidas en el Test Plan y deben revisarse antes de ejecutar las pruebas en otro entorno.

El inicio de sesión utiliza la propiedad externa `password_prueba`, que no se almacena directamente en el archivo `.jmx`.

### 8.3. Ejecutar JMeter desde PowerShell

Abrir PowerShell desde la carpeta principal del proyecto.

Ejecutar los siguientes comandos, ajustando la ruta de JMeter según su instalación:

```powershell
$passwordPrueba = Read-Host "Contraseña del usuario de prueba"

$jmeter = "C:\Users\rodry\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat"

$plan = ".\jmeter\VT_Solutions_Performance_Test.jmx"

& $jmeter -n -t $plan "-Jpassword_prueba=$passwordPrueba"

Remove-Variable passwordPrueba
```

La contraseña debe corresponder al usuario ficticio utilizado en las pruebas. No debe incluirse en el repositorio ni en el README.

**Precaución:** al utilizar `-J`, la contraseña puede quedar visible temporalmente en los argumentos del proceso. Este procedimiento está destinado únicamente al entorno local de pruebas y a credenciales ficticias.

### 8.4. Interpretación de los resultados

Al finalizar, JMeter muestra un resumen con las principales métricas:

- **Samples:** cantidad de solicitudes ejecutadas.
- **Average:** tiempo promedio de respuesta en milisegundos.
- **Min:** tiempo mínimo de respuesta.
- **Max:** tiempo máximo de respuesta.
- **Throughput:** cantidad de solicitudes procesadas por segundo.
- **Error %:** porcentaje de muestras con errores.

En la ejecución inicial del 16 de octubre de 2026 se obtuvieron los siguientes resultados:

| Métrica | Resultado |
|---|---:|
| Solicitudes HTTP | 25 |
| Duración aproximada | 8 segundos |
| Tiempo promedio | 18 ms |
| Tiempo mínimo | 5 ms |
| Tiempo máximo | 134 ms |
| Throughput | 3.1 solicitudes/segundo |
| Errores | 0 (0.00%) |

Estos valores corresponden a una verificación inicial de funcionamiento y no representan los resultados definitivos de las pruebas de rendimiento.

### 8.5. Consideraciones para las siguientes etapas

La Persona 2 deberá incorporar archivos CSV mediante CSV Data Set Config, ejecutar escenarios de carga y almacenar los resultados para su posterior análisis.

La Persona 3 utilizará las métricas obtenidas para elaborar los reportes, las conclusiones y la presentación.

El sampler de diagnóstico `DEBUG - Verificar ID Extraido` debe permanecer deshabilitado durante las pruebas de rendimiento. También se recomienda deshabilitar el listener `View Results Tree` durante las ejecuciones de carga para reducir el consumo de recursos.

El archivo `.jmx` debe conservarse como base de trabajo para las siguientes etapas.