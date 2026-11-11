# Demostración de Persona 3 en VT Solutions

Duración aproximada de cinco a siete minutos. Preparar la computadora, SonarQube y el túnel antes de iniciar la exposición.

## Preparación

Desde PowerShell ejecutar el script local preparar-demostracion.ps1 de la carpeta CVVS. El script inicia o comprueba SonarQube y MongoDB, reutiliza el túnel y actualiza SONAR_HOST_URL en GitHub. Confirmar el mensaje de ambiente listo. La contraseña del panel es la elegida por el usuario al configurar su cuenta.

Abrir el PR https://github.com/rodrylms14/pagina-web-vtsolutions-main/pull/2 y las ejecuciones guardadas. Los tokens se administran en GitHub como secretos. Comprobar espacio libre antes de reiniciar SonarQube.

## Introducción

“Mi responsabilidad fue integrar SonarQube, ejecutar el análisis estático e interpretar sus resultados. Reutilizamos las pruebas API del equipo y medimos el backend con c8 para generar un reporte LCOV.”

Mostrar sonar-project.properties y señalar fuentes, pruebas, exclusiones y sonar.javascript.lcov.reportPaths.

## Pipeline

Abrir [la ejecución normal](https://github.com/rodrylms14/pagina-web-vtsolutions-main/actions/runs/42973658804). Mostrar las pruebas con cobertura, el scanner y el paso que espera el Quality Gate. Abrir los artefactos para señalar el LCOV y report-task.txt.

“El workflow recibe cambios de GitHub, ejecuta las pruebas y envía la instantánea a nuestro SonarQube local mediante HTTPS. El código de salida del scanner comunica el Quality Gate al job.”

## Resultados

Abrir el proyecto vt-solutions. Mostrar el análisis local de referencia o la ejecución normal equivalente. Explicar las 20 vulnerabilidades, 11 bugs, 13 code smells, 49,8 % de cobertura global y 7,9 % de duplicación. Señalar que 60,06 % corresponde a las líneas del backend en c8 y que SonarQube calcula otra métrica sobre todo el ámbito analizado.

Abrir Sonar way y mostrar que sus condiciones se aplican al código nuevo. La primera ejecución estableció la referencia. Confirmar los datos actuales en el panel antes de citar una cifra durante la exposición.

## Hallazgos

Mostrar javascript:S5122 en app.js y explicar la revisión de orígenes CORS. Mostrar el bug del campo correo y el code smell de la etiqueta de contraseña. Mostrar detallecelular.html con 72,5 % de duplicación y los enlaces a detalle.html y detalleauriculares.html. Explicar la propuesta de reutilizar la navegación.

## Fallos y control de integración

Abrir [la ejecución con prueba fallida](https://github.com/rodrylms14/pagina-web-vtsolutions-main/actions/runs/42974143141). Mostrar la aserción controlada, el fallo del job y la limpieza de la base temporal. La aserción fallida se solicita mediante el parámetro fallo_controlado de la ejecución manual.

También se comprobó un Quality Gate fallido en una rama de demostración. Se agregó un formulario con una etiqueta sin asociación, se mantuvieron las pruebas API correctas y SonarQube rechazó las incidencias nuevas. La ejecución 42975017694 terminó en fallo en el paso del scanner. El archivo de demostración queda fuera de la rama de entrega.

[Ejecución con Quality Gate fallido](https://github.com/rodrylms14/pagina-web-vtsolutions-main/actions/runs/42975017694)

Mostrar que el propietario debe exigir el check Pruebas API y SonarQube en la protección de main. Distinguir el fallo comprobado del workflow y el estado de activación de la protección.

## Cierre

“La integración aporta resultados reproducibles y evidencia de las pruebas y del análisis estático. Priorizamos la revisión de CORS, la accesibilidad de formularios y la duplicación. La cobertura y las limitaciones de Community Build ayudan a delimitar qué se verificó.”

## Repetición de la demostración

En Actions elegir VT Solutions CI, seleccionar Run workflow y la rama caso3-sonarqube. Usar fallo_controlado=false para la ejecución normal y true para demostrar el fallo de una prueba. Para repetir el rechazo del Quality Gate, seleccionar la rama demo-caso3-quality-gate con fallo_controlado=false. Al terminar esa demostración, ejecutar nuevamente caso3-sonarqube para restaurar la instantánea de entrega en el panel. Mantener el túnel y SonarQube activos. Al recrear el túnel, preparar-demostracion.ps1 actualiza la URL del secreto.
