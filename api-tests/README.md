# Automatización de Pruebas Funcionales de API REST – VT Solutions

## Descripción

Este proyecto implementa un framework de automatización de pruebas funcionales para la API REST de VT Solutions, utilizando JavaScript, Jest y Axios.

El objetivo es verificar el funcionamiento de los endpoints mediante casos de prueba positivos y negativos, validando códigos de estado HTTP y respuestas JSON.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Jest:** framework para ejecutar pruebas y validar resultados.
- **Axios:** cliente HTTP para consumir los endpoints.
- **Express:** framework utilizado por la API.
- **MongoDB:** base de datos de la aplicación.

## Arquitectura del framework

El proyecto utiliza una estructura organizada por responsabilidades:

- `config/`: configuración de la API, Jest y validaciones de seguridad.
- `clients/`: cliente HTTP reutilizable basado en Axios.
- `data/`: generación de datos de prueba.
- `tests/`: casos de prueba automatizados.
- `utils/`: espacio reservado para funciones auxiliares reutilizables.
- `evidencias/`: capturas de los resultados de ejecución.

Esta separación facilita el mantenimiento y la incorporación de nuevos casos de prueba.

## Configuración del entorno

El backend habitual utiliza el puerto `4000` y la base de datos `vt_solutions`.

Para las pruebas automatizadas se utiliza un entorno independiente:

- **Puerto:** `4001`
- **Base de datos:** `vt_solutions_test`
- **Archivo de configuración del backend:** `.env.test`

El framework incluye una validación que restringe la ejecución de pruebas al servidor local autorizado en el puerto `4001`.

## Instalación y ejecución

1. Tener Node.js y MongoDB instalados.
2. Iniciar MongoDB.
3. Iniciar el backend de pruebas desde la carpeta `backend`:

   ```powershell
   node --env-file=.env.test src/server.js
   ```

4. Abrir otra terminal en `api-tests` e instalar las dependencias:

   ```powershell
   npm install
   ```

5. Ejecutar las pruebas automatizadas:

   ```powershell
   npm test
   ```

## Casos de prueba de autenticación

| ID | Caso | HTTP esperado |
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

## Resultados obtenidos

En la ejecución de las pruebas de autenticación se obtuvo:

- **2 suites aprobadas.**
- **11 pruebas aprobadas.**
- **0 pruebas fallidas.**
- **Tiempo de ejecución:** 1,315 segundos.

Los resultados incluyen 10 casos funcionales de autenticación y una prueba adicional de configuración del entorno.

## Evidencias

Las capturas de ejecución se almacenan en la carpeta `evidencias/`.

## Consideraciones

Los usuarios de prueba se generan con correos electrónicos únicos para permitir ejecuciones repetidas.

Las pruebas de registro crean documentos en `vt_solutions_test`. Actualmente no se realiza limpieza automática de esos registros.

La validación del puerto es una medida de protección adicional y no sustituye la verificación de la base de datos del backend.

## Estado del proyecto

El módulo de autenticación y la infraestructura inicial están implementados y verificados. Los demás módulos funcionales deben integrarse y validarse como parte del trabajo del equipo.