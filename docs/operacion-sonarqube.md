# Operación del ambiente de SonarQube

La carpeta de trabajo es CVVS/vtsolutions-sonar. La rama de entrega es caso3-sonarqube. Los archivos .scannerwork y coverage se generan en cada ejecución y se ignoran en Git.

## Arranque en esta computadora

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Agggg\Documents\Codex\2026-10-20\CVVS\preparar-demostracion.ps1"
```

Este comando comprueba SonarQube para Windows y MongoDB, inicia o reutiliza el túnel y actualiza SONAR_HOST_URL en el repositorio. Requiere la cuenta colaboradora de Git configurada en esta computadora. El token de SonarQube ya está guardado como SONAR_TOKEN en GitHub. Antes de reiniciar el servidor se necesitan aproximadamente 23,8 GiB libres en C.

## Ejecución local de las pruebas con cobertura

Requisitos para otra computadora con Windows, Linux o macOS: Node.js 22 actualizado, npm, MongoDB 8 en 127.0.0.1 puerto 27017 y un servidor SonarQube accesible. Clonar el repositorio e instalar backend y api-tests con sus package-lock.json.

```powershell
npm.cmd ci --prefix ./backend
npm.cmd ci --prefix ./api-tests
npx.cmd --yes --package=c8@12.0.0 c8 --all --src=backend/src --include="backend/src/**/*.js" --reporter=text --reporter=lcov --reports-dir=coverage node api-tests/scripts/run-entrega.js sonar-cobertura
```

En Linux y macOS se usan npm y npx en lugar de npm.cmd y npx.cmd. El ejecutor crea una base temporal con nombre aleatorio y comprueba su eliminación. Un error de limpieza provoca un fallo de la ejecución. El frontend sigue dentro del ámbito del scanner y puede aportar cobertura mediante sus propias pruebas en una ampliación posterior.

## Análisis local

Instalar SonarScanner CLI 8.0.1.6346 para el sistema operativo. En PowerShell introducir el token sin almacenarlo en el archivo del proyecto.

```powershell
$tokenSeguro = Read-Host 'Token de SonarQube' -AsSecureString
$env:SONAR_TOKEN = [System.Net.NetworkCredential]::new('', $tokenSeguro).Password
$env:SONAR_HOST_URL = 'http://127.0.0.1:9000'
try {
    & '..\sonar-tools\sonar-scanner-8.0.1.6346-windows-x64\bin\sonar-scanner.bat' '-Dsonar.qualitygate.wait=true'
} finally {
    Remove-Item Env:\SONAR_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:\SONAR_HOST_URL -ErrorAction SilentlyContinue
    Remove-Variable tokenSeguro -ErrorAction SilentlyContinue
}
```

El informe LCOV debe existir en coverage/lcov.info antes de invocar el scanner. Guardar el resumen de pruebas, su registro de entorno y report-task.txt como evidencia. Coordinar los análisis locales con los de Actions porque el dashboard conserva la última instantánea del proyecto.

## Activación de la protección por el propietario

El propietario del repositorio debe iniciar sesión en GitHub CLI con su cuenta y ejecutar desde la raíz del repositorio, después de revisar el PR y de confirmar el check correcto.

```powershell
gh api --method PUT repos/rodrylms14/pagina-web-vtsolutions-main/branches/main/protection --input docs/proteccion-main.json
```

El archivo exige el check Pruebas API y SonarQube y actualizar la rama antes de integrar. Aplica el requisito también al propietario. La cuenta colaboradora que preparó la integración carece del permiso para activarlo. Revisar cualquier protección nueva del equipo antes de aplicar esta configuración.

## Cierre del túnel

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Agggg\Documents\Codex\2026-10-20\CVVS\iniciar-tunel-sonarqube.ps1" -Detener
```

Para consultar los resultados durante la demostración se utiliza la URL HTTPS que imprime preparar-demostracion.ps1 y una cuenta con permiso de lectura en el proyecto privado. Para utilizar otra computadora como servidor se instala Community Build y se adapta el arranque al sistema operativo. La configuración de fuentes y el workflow evitan rutas absolutas de esta computadora.
