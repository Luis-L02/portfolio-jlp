---
name: orange-pi-ssh
description: Proporciona detalles de conexión, credenciales y métodos de ejecución SSH con el servidor Orange Pi.
license: MIT
metadata:
  author: Jose
  version: '2.0'
---

# Orange Pi SSH Connection Details

Utiliza la siguiente información para conectarte al servidor Orange Pi a través de SSH de forma automatizada cuando sea necesario.

## Credenciales de Acceso
* **Host/IP Principal:** `192.168.1.11` (IP activa en la red local; fallback: `192.168.1.16`)
* **Puerto:** `22`
* **Usuario:** `orangepi`
* **Contraseña:** `orangepi`

## Métodos de Conexión y Automatización

### 1. Ejecución mediante Script Node.js (`run_cmd_opi.js`)
El proyecto cuenta con el script [`run_cmd_opi.js`](file:///c:/Users/josel/OneDrive/Documentos/Portfolio%20JLP/run_cmd_opi.js) en la raíz para ejecutar comandos remotos sin interacción:

```bash
node run_cmd_opi.js "cd /media/almacenamiento/projects/repositories/Portfolio\ JLP && git status"
```

### 2. Conexión mediante `ssh2` en Scripts Node.js
Para scripts personalizados de sincronización SFTP o pipelines complejos:
```javascript
const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('comando', (err, stream) => {
    // Manejo de salida
  });
}).connect({
  host: '192.168.1.11',
  port: 22,
  username: 'orangepi',
  password: 'orangepi',
  readyTimeout: 10000
});
```

### 3. Comandos CLI directos (con `sshpass` en entornos compatibles)
```bash
sshpass -p "orangepi" ssh -o StrictHostKeyChecking=no orangepi@192.168.1.11 "comando"
```
