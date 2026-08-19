---
name: n8n-developer
description: Directrices y mejores prácticas para diseñar, construir y desplegar flujos de trabajo (workflows) profesionales, modulares y robustos en n8n (v2.x). Cubre el diseño defensivo de webhooks, manejo de errores, compatibilidad de versiones de nodos y manipulación de datos en nodos Code con Javascript.
license: MIT
metadata:
  author: Jose
  version: '1.0'
---

# n8n Developer Guidelines

Sigue estas directrices estrictas al diseñar y construir flujos de trabajo (workflows) profesionales en n8n.

---

## 1. Diseño Defensivo y Robustez en Webhooks

Al exponer webhooks que sirvan como APIs (especialmente para subir archivos o recibir datos externos), nunca asumas el "camino feliz".

* **Validación de Entradas:** Valida siempre la presencia de los parámetros requeridos (tanto JSON como binarios) al principio del workflow. Si falta algún parámetro, detén el flujo y responde inmediatamente con un error descriptivo.
* **Nodo `Respond to Webhook` (Recomendado):** Evita usar la opción predeterminada "Last Node" para responder solicitudes HTTP. En su lugar, usa el nodo `Respond to Webhook` (`n8n-nodes-base.respondToWebhook`) para controlar de forma explícita el código de estado HTTP (`200 OK`, `400 Bad Request`, `500 Server Error`) y el cuerpo JSON.
* **Respuestas Dinámicas:** Configura el nodo `Respond to Webhook` para usar respuestas personalizadas dinámicas basadas en los datos de entrada (ej: `{{ $json.statusCode }}` y `{{ JSON.stringify($json.body) }}`). Esto permite que un único nodo de respuesta maneje tanto flujos exitosos como de error.

---

## 2. Nomenclatura y Buenas Prácticas de Canvas

Un flujo profesional debe ser legible y fácil de mantener por otros desarrolladores.

* **Nombres de Nodos Claros:** Nombra cada nodo describiendo la acción de negocio que realiza, anteponiendo la categoría del nodo entre corchetes.
  * **Incorrecto:** `Spreadsheet File`, `Webhook`, `Code`
  * **Correcto:** `[Spreadsheet] Parsear IPs Propias`, `[Trigger] Webhook Recibir Archivos`, `[Code] Analizar y Cruzar IPs/CIDR`
* **Notas en Canvas:** Utiliza notas adhesivas (Sticky Notes) dentro del lienzo para documentar la lógica de negocio compleja, los endpoints esperados y las suposiciones del flujo.

---

## 3. Compatibilidad y Versionamiento de Nodos (`typeVersion`)

n8n evoluciona rápidamente. Al generar o modificar archivos JSON de workflows, asegúrate de utilizar los tipos y versiones correctos según la instancia de destino:

* **Webhook Node (`n8n-nodes-base.webhook`):** Usa la versión `2.1` o superior en instancias de n8n v2.x.
* **Spreadsheet File (`n8n-nodes-base.spreadsheetFile`):**
  * Para leer archivos (Read From File), la operación correcta es **`"fromFile"`** (en `typeVersion: 2`).
  * Para escribir archivos (Write to File), la operación correcta es **`"toFile"`** (en `typeVersion: 2`).
  * *Evita usar la operación obsoleta `"read"`.*
* **Extract from File (`n8n-nodes-base.extractFromFile`):**
  * Para extraer texto de archivos PDF, la propiedad `operation` debe valer **`"pdf"`**.
  * *Evita usar operaciones genéricas u obsoletas como `"extractText"`.*
* **Code Node (`n8n-nodes-base.code`):**
  * Para programar en Javascript (en `typeVersion: 2`), la propiedad `language` debe valer **`"javaScript"`** (CamelCase estricto con **`S`** mayúscula).

---

## 4. Manipulación de Datos en Nodos de Código (JavaScript)

El nodo `Code` es la herramienta más potente para automatizar lógica compleja en JS puro sin dependencias externas.

* **Formato de Salida de n8n:** n8n requiere que el nodo de código retorne una lista (Array) de objetos, donde cada objeto contiene una propiedad principal llamada `json`:
  ```javascript
  return [
    { json: { success: true, data: "ejemplo" } }
  ];
  ```
* **Acceder a Nodos Anteriores:** Utiliza la sintaxis recomendada para n8n v1/v2 para acceder a los datos de otros nodos de forma segura:
  ```javascript
  const datosExcel = $('[Spreadsheet] Parsear IPs Propias').all();
  const textoPdf = $('[File] Extraer Texto del PDF').first().json.text || '';
  ```
* **Operaciones de Red en JS Puro:** Para realizar validaciones de red como cruce de subredes CIDR sin usar módulos npm externos, convierte las direcciones IP a números enteros de 32 bits y aplica máscaras de bits:
  ```javascript
  function ipToLong(ip) {
    return ip.split('.').reduce((long, octet) => (long << 8) + parseInt(octet, 10), 0) >>> 0;
  }
  function isIpInSubnet(ip, subnet) {
    const [subnetIp, maskStr] = subnet.split('/');
    const mask = parseInt(maskStr, 10);
    const ipLong = ipToLong(ip);
    const subnetLong = ipToLong(subnetIp);
    if (mask === 32) return ipLong === subnetLong;
    const maskBits = (0xffffffff << (32 - mask)) >>> 0;
    return (ipLong & maskBits) === (subnetLong & maskBits);
  }
  ```
