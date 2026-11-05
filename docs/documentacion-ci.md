# Caso de Estudio #3 – Integración Continua y Despliegue Continuo

## Persona 1 – Arquitectura y configuración del pipeline CI/CD

**Proyecto:** VT Solutions  
**Curso:** Calidad, Verificación y Validación de Software  
**Universidad:** CENFOTEC  
**Herramienta seleccionada:** GitHub Actions

### 1. Introducción

Como parte del Caso de Estudio #3, se implementó la infraestructura inicial de un proceso automatizado de integración continua (CI) para el proyecto VT Solutions, una aplicación de comercio electrónico desarrollada con Node.js, Express y MongoDB.

El objetivo de esta etapa fue establecer un entorno de automatización que permita preparar el proyecto y posteriormente incorporar la ejecución de pruebas API y el análisis estático de código con SonarQube.

La configuración inicial fue implementada y validada mediante ejecuciones exitosas en GitHub Actions.

### 2. Selección de la herramienta CI/CD

Se seleccionó **GitHub Actions** como herramienta de integración continua debido a su integración nativa con GitHub, donde se encuentra alojado el repositorio del proyecto.

Su elección se fundamentó en las siguientes características:

- Permite automatizar procesos mediante archivos YAML.
- Puede ejecutar workflows cuando se realizan cambios en el repositorio.
- Ofrece entornos de ejecución administrados, como Ubuntu.
- Permite instalar dependencias y ejecutar comandos de Node.js.
- Facilita la integración posterior de herramientas de pruebas y análisis de calidad.
- Proporciona registros de ejecución que permiten identificar errores y conservar evidencias.
- Dispone de opciones gratuitas sujetas a los límites y condiciones de uso de GitHub.

### 3. Arquitectura del pipeline

El pipeline se configuró mediante el archivo:

`.github/workflows/ci.yml`

Este archivo define los eventos que activan el workflow y las tareas que deben ejecutarse automáticamente.

**Eventos de activación:**

- `push`: cuando se publican cambios en la rama `main`.
- `pull_request`: cuando se crea o actualiza una solicitud de integración dirigida a `main`.
- `workflow_dispatch`: cuando se inicia manualmente el workflow desde GitHub.

**Entorno de ejecución:**

Se utiliza una máquina virtual administrada por GitHub Actions con la etiqueta `ubuntu-latest` y Node.js 22.

**Etapas implementadas:**

1. Descarga del código fuente mediante `actions/checkout@v5`.
2. Configuración de Node.js mediante `actions/setup-node@v5`.
3. Configuración de caché de npm utilizando los archivos `package-lock.json`.
4. Instalación de dependencias del backend mediante `npm ci`.
5. Instalación de dependencias del módulo `api-tests` mediante `npm ci`.
6. Confirmación de la preparación del entorno.

Estas etapas constituyen la base sobre la cual se integrarán posteriormente las pruebas automatizadas y SonarQube.

### 4. Organización del repositorio

El proyecto mantiene una estructura que permite separar las responsabilidades de desarrollo, pruebas y automatización.

| Directorio | Función |
|---|---|
| `.github/workflows/` | Almacena la configuración de GitHub Actions. |
| `backend/` | Contiene la aplicación backend desarrollada con Node.js y Express. |
| `api-tests/` | Contiene las pruebas API desarrolladas con Jest y Axios. |
| `frontend/` | Contiene la interfaz de la aplicación. |
| `database/` | Contiene recursos relacionados con la base de datos. |
| `docs/` | Almacena el diagrama y la documentación técnica del pipeline. |

La separación entre `backend` y `api-tests` permite instalar las dependencias de cada módulo de forma independiente.

### 5. Configuración y ejecución

La configuración inicial se creó en el repositorio local y posteriormente se publicó en GitHub mediante Git.

El primer commit de configuración fue:

`d37fc5e – ci: configurar pipeline inicial con GitHub Actions`

Después de su publicación, GitHub Actions ejecutó automáticamente el workflow y completó las etapas de preparación del entorno.

Durante la revisión se identificó una advertencia relacionada con el entorno de ejecución de Node.js 20 utilizado por las acciones de GitHub. Para atenderla, se actualizaron `actions/checkout` y `actions/setup-node` de la versión v4 a v5.

La actualización se publicó mediante un segundo commit y se verificó con una nueva ejecución.

### 6. Resultados obtenidos

Se realizaron dos ejecuciones del pipeline inicial:

| Ejecución | Resultado | Duración observada |
|---|---|---|
| Primera ejecución | Exitosa | 17 segundos |
| Segunda ejecución, con acciones v5 | Exitosa | 12 segundos |

En la segunda ejecución se verificó que las etapas de descarga del repositorio, configuración de Node.js e instalación de dependencias finalizaron correctamente.

También se comprobó que la advertencia relacionada con Node.js 20 desapareció.

Permaneció un aviso informativo de GitHub relacionado con la migración de la etiqueta `ubuntu-latest` a Ubuntu 26, sin afectar el resultado del workflow.

**Alcance de la validación:** estos resultados demuestran el funcionamiento de la preparación automatizada del entorno. Todavía no constituyen evidencia de ejecución exitosa de pruebas API ni de análisis con SonarQube.

### 7. Integraciones pendientes

El pipeline fue diseñado para permitir que los demás integrantes incorporen las siguientes etapas:

**Persona 2 – Pruebas API**

Integración de las pruebas automatizadas existentes, desarrolladas con Jest y Axios, y verificación de sus resultados dentro del workflow.

**Persona 3 – SonarQube**

Integración del análisis estático de código, recopilación de métricas de calidad y revisión de los resultados obtenidos.

Estas integraciones son necesarias para completar el alcance del Caso de Estudio #3.

### 8. Evidencias

Las evidencias de esta etapa incluyen:

- Archivo de configuración `.github/workflows/ci.yml`.
- Historial de commits correspondientes a la configuración y actualización del workflow.
- Captura de la ejecución exitosa de GitHub Actions.
- Diagrama del flujo de integración continua almacenado en `docs/diagrama-ci-cd.md`.

### 9. Conclusión

La implementación inicial de GitHub Actions permitió establecer una base funcional de integración continua para VT Solutions.

Se logró automatizar la descarga del repositorio, la configuración de Node.js y la instalación de las dependencias necesarias para el backend y el módulo de pruebas API.

Las ejecuciones exitosas permitieron comprobar que el entorno de automatización funciona y está preparado para incorporar las etapas adicionales de pruebas y análisis estático.

Este trabajo constituye la infraestructura inicial del pipeline, cuya implementación completa dependerá de la integración y validación de las actividades asignadas a los demás integrantes del equipo.
