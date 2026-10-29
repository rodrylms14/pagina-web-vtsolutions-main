# Entrega: 30 pruebas funcionales de API

Esta integración conserva los 20 casos existentes del equipo y agrega 10 casos de carrito con factories y fixtures reutilizables. No cambia el backend, sus endpoints ni sus dependencias.

| Área | Casos | Origen |
| --- | --- | --- |
| Autenticación | AUTH-01 a AUTH-10 | Equipo, sin cambios |
| Categorías | CAT-01 a CAT-05 | Equipo, sin cambios |
| Productos | PROD-01 a PROD-05 | Equipo, sin cambios |
| Carrito | P3-CAR-01 a 07, 09, 10 y 12 | Persona 3; reutilizados de la suite local |
| **Total funcional** | **30** | **13 positivos y 17 negativos** |

## Ejecutar con el servidor de pruebas del equipo

Con el backend de pruebas aislado en `http://127.0.0.1:4001`, desde la raíz:

```powershell
npm --prefix api-tests ci
npm --prefix api-tests run test:entrega
```

La configuración selecciona únicamente los 30 casos funcionales. El `npm test` existente conserva su comportamiento y también descubre la comprobación adicional del entorno.

## Demostración con preparación y limpieza automáticas

Requisitos: Node.js, dependencias de backend/api-tests instaladas, MongoDB local disponible en `127.0.0.1:27017` y puerto 4001 libre. Desde la raíz:

```powershell
npm --prefix backend ci
npm --prefix api-tests ci
npm --prefix api-tests run demo:entrega
```

El ejecutor crea una base nueva `vt_solutions_entrega_test_<UUID>`, espera el índice único de usuario, inicia el app Express existente en 4001, ejecuta Jest y elimina exclusivamente la base que creó. Después comprueba su ausencia con listDatabases. Las fixtures eliminan únicamente sus propios carritos, productos y categorías; los usuarios se eliminan al borrar la base privada.

Este comando usa MongoDB local ya iniciado; no instala ni arranca MongoDB. No lee `.env` ni utiliza una conexión compartida del backend. Puede indicarse otro puerto de MongoDB mediante `TEST_MONGODB_SERVER`, limitado a mongodb://localhost o mongodb://127.0.0.1 sin usuario, contraseña ni nombre de base. Los resultados se guardan en `api-tests/evidencias/entrega30/entrega30.json`, `.txt` y `entrega30-entorno.json`.

Si se usa directamente `test:entrega` con el servidor de Persona 1, la base pertenece a ese servidor: las fixtures limpian sus recursos por ID y los usuarios sintéticos permanecen allí. Para comprobar limpieza final de usuarios, usar `demo:entrega` sobre el servidor MongoDB local y la base privada del ejecutor.

## Evidencia de la integración

Se ejecutaron **30/30 casos aprobados, 0 fallidos y 0 omitidos**, el 28/10/2026 a las 18:10, hora de Costa Rica, contra el backend de `main` en revisión `902aa26f5ab25ff745f55db7d4e0de6fa6d6ef2f`. Se cubrieron 13 combinaciones método/ruta y 9 formas de ruta. La base temporal se eliminó y se verificó su ausencia.

- [Matriz de los 30 escenarios](matriz.json).
- [Resumen comprobado](resultado.json).
- [Reporte original de Jest](../../evidencias/entrega30/github-30.json).
- [Salida de ejecución](../../evidencias/entrega30/github-30.txt).
- [Preparación y limpieza](../../evidencias/entrega30/github-30-entorno.json).

La comprobación reutilizó las dependencias instaladas (Jest 30.5.2 y Mongoose 9.11.2) y una instancia MongoDB temporal proporcionada por el entorno de verificación. El proceso bajo prueba ejecutó los archivos del backend original de main, sin cambios productivos; esa instancia proporcionó solamente un servidor MongoDB local al comando demo:entrega. La ejecución no utilizó la lógica productiva modificada de la copia local.

## Datos e independencia

Cada caso prepara sus propios usuario, categoría, producto y carrito cuando corresponde. Los emails y nombres usan UUID. No se comparten IDs ni se depende del orden. Se validan status y contenido de las respuestas; los casos de actualización consultan el recurso para comprobar persistencia. Los cuatro archivos de pruebas existentes del equipo se mantienen intactos.

La copia local tenía un contrato distinto para usuario sin carrito: 200 vacío. En main esa consulta devuelve 404. Para esta integración se eligieron diez escenarios ya implementados compatibles con el contrato del repositorio; se incluye P3-CAR-12 en lugar de P3-CAR-08. No se flexibilizaron assertions para aceptar ambos códigos ni se cambió el controlador.

Los 26 casos y evidencias locales anteriores se conservan en la carpeta original del usuario. Esta contribución integra únicamente los diez de carrito necesarios para completar los treinta del equipo; evita duplicar las categorías ya aportadas.
