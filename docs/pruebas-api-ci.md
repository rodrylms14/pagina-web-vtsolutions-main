# Persona 2: integración y validación de pruebas API

## Validación local realizada

El 9 de noviembre de 2026 se ejecutó validacion-local: 4 suites y 30 casos aprobados, código de salida 0. Luego validacion-fallo: los 30 casos funcionales aprobaron y las 4 assertions intencionales fallaron, código de salida 1. En ambas ejecuciones se comprobó la eliminación de la base temporal. Los archivos validacion-local* y validacion-fallo* conservan la evidencia. La verificación en GitHub Actions queda pendiente hasta publicar y observar las ejecuciones remotas.

## Flujo implementado

La primera ejecución remota falló antes de las pruebas: MongoDB rechazó el kernel del runner ubuntu-latest (SERVER-121912). Se fijó runs-on en ubuntu-22.04 para evitar esa incompatibilidad. Esta corrección requiere una nueva ejecución remota para confirmar el resultado.

GitHub Actions descarga el código, configura Node.js 22, inicia MongoDB 8 y espera su comprobación de salud. Instala las dependencias de backend y api-tests con npm ci y ejecuta npm run demo:entrega -- ci.

El ejecutor existente crea una base temporal con nombre único, conecta Mongoose, inicia Express en 127.0.0.1:4001 y ejecuta las cuatro suites de entrega: autenticación, categorías, productos y carrito (30 casos). Al terminar cierra la API, elimina solamente su base temporal y registra la limpieza.

## Variables

- TEST_MONGODB_SERVER: mongodb://127.0.0.1:27017, servidor local del contenedor de Actions.
- API_BASE_URL: http://127.0.0.1:4001, destino permitido por testSafety. El ejecutor también fija este valor para Jest.
- No se necesitan contraseñas ni secretos para esta base temporal local.

## Evidencias

El paso Guardar evidencias de pruebas API se ejecuta incluso si las pruebas fallan. Conserva ci.json (resultados Jest), ci.txt (salida de ejecución) y ci-entorno.json (revisión, base temporal, código de salida y limpieza) como artefacto descargable durante 14 días. Las ejecuciones locales demo no se confunden con evidencia remota.

## Verificación positiva

Publicar el commit en main activa el workflow; también se activa para pull requests a main. Abrir Actions, seleccionar VT Solutions - CI y revisar Ejecutar pruebas API. Se esperan 30 casos aprobados y limpieza comprobada. Descargar el artefacto y conservar una captura de la ejecución verde. La ejecución remota solo queda validada cuando Actions termina.

## Verificación negativa

En Actions seleccionar Run workflow y marcar fallo_controlado. Esto agrega una assertion intencional expect(200).toBe(201), sin modificar los casos funcionales. Jest devuelve un código distinto de cero; run-entrega.js lo transmite y Actions marca el paso y el workflow como fallidos. No se usa continue-on-error. Descargar las evidencias y conservar una captura roja. Después ejecutar otra vez sin marcar la opción para demostrar recuperación. La assertion de demostración se agrega en cada suite y no se cuenta como caso funcional del equipo.

## Ejecución local

Con MongoDB encendido y el puerto 4001 libre, desde api-tests:

```powershell
npm.cmd run demo:entrega -- validacion-local
npm.cmd run demo:entrega -- validacion-fallo --fallo-controlado
```

El segundo comando debe terminar con error por diseño. No iniciar otro backend: el ejecutor lo inicia automáticamente.
