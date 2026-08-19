# Reglas de Despliegue y Ramas (Pipelines)

Todos los pipelines de construcción y despliegue del proyecto deben seguir las siguientes políticas estrictas:

## 1. Modelo de Ramas (Branching)
Se deben mantener exactamente 4 ramas en el repositorio:
* **`develop`**: Rama activa de desarrollo.
* **`pre-release`**: Rama de integración y pruebas antes de publicar.
* **`main`** (o `master`): Rama de producción (Releases activos).
* **`backup`**: Rama que almacena el estado de la versión inmediatamente anterior para permitir rollbacks rápidos.

## 2. Flujo de Integración y Despliegue
Los cambios deben fluir obligatoriamente en el siguiente orden:
1. `develop` -> `pre-release`
2. Antes de fusionar `pre-release` a `main`:
   * Se debe actualizar la rama `backup` con el estado actual de `main` (la versión en producción antes de la actualización).
   * Se debe etiquetar (tag) la versión anterior en la rama `backup` (ej. `vX.Y.Z-backup-timestamp`).
3. `pre-release` -> `main`
4. Al actualizar `main`, se debe:
   * Crear un Tag de Git con la nueva versión (ej. `vX.Y.Z`).
   * Generar un **Release en GitHub** correspondiente al tag creado utilizando la API de GitHub.

## 3. Requisitos de Autenticación
* El servidor de despliegue debe contar con una clave SSH asociada a GitHub para gestionar las ramas y fusiones sin interactividad.
* El pipeline debe buscar un token de acceso de GitHub (PAT) en `/home/orangepi/.github_token` para automatizar la creación del Release en GitHub.
