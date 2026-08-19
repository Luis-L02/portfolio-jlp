---
name: portfolio-developer
description: Guía completa de arquitectura, desarrollo, sincronización y despliegue para el proyecto de portafolio web (Angular, Tailwind CSS, PrimeNG, Orange Pi, Cloudflare Tunnel).
license: MIT
metadata:
  author: Jose
  version: '1.0'
---

# Skill: Portfolio Developer & Architecture Guide

Esta skill proporciona las directrices técnicas, estructura de archivos y procedimientos recomendados para el desarrollo de nuevas funcionalidades, mantenimiento y despliegue del portafolio personal.

---

## 1. Stack Tecnológico & Arquitectura

* **Framework:** Angular (v20+ standalone components).
* **UI & Estilos:** Tailwind CSS v4 (`@tailwindcss/postcss`) combinado con componentes de PrimeNG (`@primeng/themes/aura`).
* **Internacionalización (i18n):** `@ngx-translate/core` y `@ngx-translate/http-loader` para soporte bilingüe (Español / Inglés).
* **Control de Versiones & Despliegue:** Flujo estricto de 4 ramas (`develop`, `pre-release`, `main`, `backup`) sobre el servidor Orange Pi y GitHub Releases.
* **Infraestructura de Producción:** Servidor local Orange Pi (`192.168.1.11`) ejecutando Nginx en el puerto `8085`, expuesto al público mediante Cloudflare Tunnel en [https://www.joselp.space/](https://www.joselp.space/).

---

## 2. Estructura de Archivos Clave

```
Portfolio JLP/
├── public/
│   ├── assets/
│   │   ├── i18n/
│   │   │   ├── es.json        # Traducciones en español
│   │   │   └── en.json        # Traducciones en inglés
│   │   └── images/            # Capturas y recursos visuales
│   └── CV_Jose_Luis_Lopez.pdf # Archivo CV descargable
├── src/
│   ├── app/
│   │   ├── app.config.ts      # Configuración de providers (i18n loader, temas)
│   │   ├── app.ts / app.html  # Componente raíz
│   │   └── components/
│   │       ├── header/        # Barra superior (Logo, Theme toggle, Selector de idioma)
│   │       ├── hero/          # Presentación principal (Nombre, CV, Botón contacto)
│   │       ├── dynamic-background/ # Efectos de fondo dinámicos
│   │       ├── workspace/     # Sección de Proyectos & Experiencia (Timeline & Carrusel)
│   │       └── footer/        # Pie de página
│   └── styles.css             # Estilos globales y temas CSS
├── run_cmd_opi.js             # Helper SSH para ejecutar comandos en la Orange Pi
└── package.json               # Dependencias y scripts de construcción
```

---

## 3. Guía de Modificación de Contenido

### Modificar Textos o Traducciones
1. Los textos visibles deben agregarse en ambos archivos: [`public/assets/i18n/es.json`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/public/assets/i18n/es.json) y [`public/assets/i18n/en.json`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/public/assets/i18n/en.json).
2. Mantener la consistencia de llaves en ambos idiomas.
3. Para evitar que los clientes sirvan versiones cacheadas del JSON, incrementa el parámetro `suffix` en [`src/app/app.config.ts`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/src/app/app.config.ts):
   ```typescript
   provideTranslateHttpLoader({
     prefix: './assets/i18n/',
     suffix: '.json?v=X.Y.Z'
   })
   ```

### Enlaces de Contacto y Archivo CV
* El correo de contacto oficial es **`Joselp.02@outlook.com`**, enlazado en [`hero.component.html`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/src/app/components/hero/hero.component.html) con `mailto:Joselp.02@outlook.com`.
* El currículum se ubica en [`public/CV_Jose_Luis_Lopez.pdf`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/public/CV_Jose_Luis_Lopez.pdf) y se descarga con `/CV_Jose_Luis_Lopez.pdf`.

---

## 4. Flujo de Construcción y Despliegue

### Paso 1: Validación Local
```bash
npm run build
```

### Paso 2: Sincronización y Despliegue en Orange Pi
Sincronizar los cambios locales con la ruta remota `/media/almacenamiento/projects/repositories/Portfolio JLP` y ejecutar el ciclo de 4 ramas (`develop` -> `pre-release` -> `backup` con tag de rollback -> `main` con nuevo tag y GitHub Release -> `npm run build` en servidor).
