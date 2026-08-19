---
name: orange-pi-deployment
description: Automatización y gestión del pipeline de despliegue, flujo de ramas (develop, pre-release, main, backup), compilación remota y releases en el servidor Orange Pi.
license: MIT
metadata:
  author: Jose
  version: '2.0'
---

# Skill: Despliegue en Orange Pi y Pipeline de Ramas

Esta skill automatiza y guía el flujo de trabajo integral para el desarrollo, integración, versionado y despliegue continuo del portafolio en el servidor Orange Pi.

---

## 1. Topología del Servidor e Infraestructura

* **Host / SSH:** `orangepi@192.168.1.11` (puerto `22`, contraseña `orangepi`).
* **Ruta del Repositorio Remoto:** `/media/almacenamiento/projects/repositories/Portfolio JLP`
* **Entorno Node.js (NVM):**
  ```bash
  export NVM_DIR="/home/orangepi/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  ```
* **Ruta de Archivos Compilados (Nginx Root):**
  `/media/almacenamiento/projects/repositories/Portfolio JLP/dist/portfolio-cv/browser`
* **Servidor Web Nginx:** Escucha en `127.0.0.1:8085` y sirve la aplicación SPA en `/index.html`.
* **Túnel Cloudflare (`cloudflared`):** Ejecutándose como servicio systemd, enrutando tráfico público desde `https://www.joselp.space/` y `https://portfolio.joselp.space/` hacia `127.0.0.1:8085`.
* **Token de GitHub:** Alojado en `/home/orangepi/.github_token` para la creación automática de Releases.

---

## 2. Política Estricta de 4 Ramas (Git Flow)

El repositorio mantiene exactamente 4 ramas activas:
1. **`develop`**: Rama activa de desarrollo e integración inicial.
2. **`pre-release`**: Rama de pruebas y consolidación previa a producción.
3. **`main`**: Rama de producción (Releases publicados).
4. **`backup`**: Rama histórica con el estado inmediatamente anterior a la versión activa en producción.

---

## 3. Secuencia Obligatoria de Despliegue

Cada despliegue debe seguir estrictamente este orden:

### Paso 1: Desarrollar y enviar a `develop`
```bash
cd "/media/almacenamiento/projects/repositories/Portfolio JLP"
git checkout develop
git add .
git commit -m "feat/fix: descripción de los cambios"
git push origin develop
```

### Paso 2: Integrar `develop` en `pre-release`
```bash
git checkout pre-release
git merge develop
git push origin pre-release
```

### Paso 3: Asegurar la rama `backup` (Antes de fusionar a `main`)
Se fusiona el estado actual de `main` (producción anterior) en `backup` y se etiqueta con timestamp:
```bash
git checkout backup
git merge main
BACKUP_TAG="vX.Y.Z-backup-$(date +%Y%m%d%H%M%S)"
git tag $BACKUP_TAG
git push origin backup --tags
```

### Paso 4: Fusionar a `main` y Etiquetar Nueva Versión
```bash
git checkout main
git merge pre-release
git push origin main
git tag vX.Y.Z
git push origin vX.Y.Z
```

### Paso 5: Generar GitHub Release mediante API (Python en Orange Pi)
Ejecutar en la Orange Pi:
```bash
python3 -c "
import urllib.request, json
with open('/home/orangepi/.github_token') as f:
    token = f.read().strip()
data = {
    'tag_name': 'vX.Y.Z',
    'name': 'Release vX.Y.Z',
    'body': 'Descripción de los cambios incluidos en esta versión.',
    'draft': False,
    'prerelease': False
}
req = urllib.request.Request(
    'https://api.github.com/repos/Luis-L02/portfolio-jlp/releases',
    data=json.dumps(data).encode('utf-8'),
    headers={
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OrangePi-Deployment'
    }
)
with urllib.request.urlopen(req) as resp:
    print('GitHub Release creado, status:', resp.status)
"
```

### Paso 6: Compilar la Aplicación Angular en Orange Pi
```bash
export NVM_DIR="/home/orangepi/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd "/media/almacenamiento/projects/repositories/Portfolio JLP"
npm run build
```
*Al compilar, Nginx y el túnel de Cloudflare sirven automáticamente los nuevos archivos sin necesidad de reiniciar servicios.*

---

## 4. Invalidación de Caché i18n
Para garantizar que los navegadores cliente descarguen las traducciones actualizadas inmediatamente:
* Actualizar el parámetro `suffix` en [`src/app/app.config.ts`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/src/app/app.config.ts) con una nueva versión (ejemplo: `suffix: '.json?v=X.Y.Z'`).
