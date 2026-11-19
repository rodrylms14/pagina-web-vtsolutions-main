## Entrega final — Automatización de pruebas de API

### Arquitectura e integración

El framework de automatización de VT Solutions utiliza JavaScript, Jest y Axios, con una estructura organizada por responsabilidades.

Los componentes principales son:

- `config/apiConfig.js`: centraliza la dirección de la API mediante la variable `API_BASE_URL`.
- `config/jestSetup.js`: ejecuta la validación del entorno antes de las pruebas.
- `config/testSafety.js`: restringe la ejecución a una API HTTP local en el puerto `4001`.
- `clients/httpClient.js`: proporciona un cliente Axios reutilizable, con un tiempo máximo de espera de 10 segundos y manejo explícito de códigos HTTP.
- `data/`: contiene datos reutilizables para las pruebas.
- `tests/`: organiza los casos automatizados por módulo funcional.
- `jest.entrega.config.cjs`: define la selección de pruebas y el tiempo máximo de ejecución para la entrega.
- `scripts/run-entrega.js`: automatiza la preparación, ejecución, generación de evidencias y limpieza del entorno.

Esta separación facilita la reutilización del código, el mantenimiento y la integración de nuevos casos de prueba.

### Módulos y casos automatizados

La configuración específica de la entrega final selecciona cuatro módulos:

| Módulo | Archivo | Casos declarados |
|---|---|---:|
| Autenticación | `auth.test.js` | 10 |
| Categorías | `categories.test.js` | 5 |
| Productos | `products.test.js` | 5 |
| Carrito | `cart.test.js` | 10 |
| **Total** | | **30** |

El conteo corresponde a los casos declarados en los archivos seleccionados para la entrega.

### Detalle de los casos de autenticación

El módulo de autenticación contiene 10 casos automatizados que verifican escenarios positivos y negativos de registro e inicio de sesión.

| ID | Caso de prueba | HTTP esperado |
|---|---|---|
| AUTH-01 | Registro exitoso | 201 |
| AUTH-02 | Registro sin nombre | 400 |
| AUTH-03 | Registro sin correo | 400 |
| AUTH-04 | Registro sin contraseña | 400 |
| AUTH-05 | Correo duplicado | 409 |
| AUTH-06 | Inicio de sesión exitoso | 200 |
| AUTH-07 | Inicio de sesión sin correo | 400 |
| AUTH-08 | Inicio de sesión sin contraseña | 400 |
| AUTH-09 | Usuario inexistente | 404 |
| AUTH-10 | Contraseña incorrecta | 401 |

Estos casos permiten validar tanto el funcionamiento esperado de los endpoints como el manejo de solicitudes inválidas y credenciales incorrectas.

### Requisitos previos

Para ejecutar la demostración local se requiere:

- Node.js y npm.
- MongoDB instalado y ejecutándose localmente en el puerto `27017`.
- Dependencias instaladas en las carpetas `backend` y `api-tests`.
- Puerto `4001` disponible.

Para instalar las dependencias del proyecto, ejecutar desde la raíz del repositorio:

**Backend:**

```powershell
cd backend
npm install
```

**Framework de pruebas:**

```powershell
cd ../api-tests
npm install
```

Estos comandos deben ejecutarse antes de utilizar el framework por primera vez o cuando cambien sus dependencias.

### Ejecución de la entrega final

Desde la carpeta `api-tests`, ejecutar:

```powershell
npm run demo:entrega
```

Este comando realiza automáticamente las siguientes operaciones:

1. Valida que el servidor MongoDB configurado sea local.
2. Genera una base de datos temporal con un identificador único.
3. Inicia el backend de VT Solutions en `127.0.0.1:4001`.
4. Ejecuta las pruebas seleccionadas mediante Jest.
5. Genera archivos de evidencia.
6. Cierra el servidor y elimina la base de datos temporal.
7. Registra información sobre la ejecución y la limpieza.

No es necesario iniciar manualmente el backend cuando se utiliza este procedimiento.

### Otros comandos disponibles

**Ejecución general:**

```powershell
npm test
```

Ejecuta Jest utilizando su configuración general. Requiere que el entorno de pruebas correspondiente esté preparado.

**Ejecución con configuración de entrega:**

```powershell
npm run test:entrega
```

Ejecuta los módulos seleccionados en `jest.entrega.config.cjs`. Este comando no inicia automáticamente el backend ni crea una base temporal.

**Demostración con fallo controlado:**

```powershell
npm run demo:entrega -- --fallo-controlado
```

Permite demostrar la detección de un fallo introducido intencionalmente. Esta ejecución debe producir un resultado fallido y se utiliza únicamente como evidencia de la capacidad de detección del framework.

### Medidas de seguridad

El framework incorpora distintas medidas para reducir riesgos durante la automatización:

- La configuración de Jest carga `jestSetup.js` antes de los archivos de prueba.
- `testSafety.js` permite únicamente conexiones HTTP a `localhost` o `127.0.0.1` en el puerto `4001`.
- El ejecutor de demostración acepta únicamente un servidor MongoDB local.
- Cada demostración utiliza una base de datos temporal independiente.
- Al finalizar, el ejecutor intenta eliminar esa base y verifica su eliminación.

La validación de la URL de la API no garantiza por sí sola el aislamiento de la base de datos. Por esta razón, se recomienda utilizar el ejecutor de demostración para las validaciones integradas de la entrega final.

### Evidencias generadas

El ejecutor almacena los resultados en:

`api-tests/evidencias/entrega30/`

Los archivos principales son:

- `entrega30.txt`: salida de la ejecución automatizada.
- `entrega30.json`: resultados detallados de Jest.
- `entrega30-entorno.json`: información del entorno, revisión de Git, resultado del proceso y verificación de limpieza.

### Resultados de validación local

Durante la validación de integración de la entrega final se obtuvo:

- **4 suites aprobadas.**
- **30 pruebas aprobadas.**
- **0 pruebas fallidas.**
- **Limpieza de la base temporal confirmada.**

Estos resultados corresponden a la ejecución local de `npm run demo:entrega` y no sustituyen la validación de otras configuraciones o entornos de ejecución.

### Estado de la entrega final

La arquitectura base del framework, la configuración de Jest y Axios, las validaciones de seguridad y la integración de los 30 casos seleccionados fueron verificadas localmente.

El proyecto dispone de un procedimiento reproducible para ejecutar las pruebas y generar evidencias de sus resultados.