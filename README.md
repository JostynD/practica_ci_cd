# Simple Deploy Demo — Práctica Jenkins + Docker (CI/CD)

Proyecto de demostración: cada push a `main` dispara un pipeline en Jenkins que
reconstruye la imagen Docker y relanza el contenedor con los cambios.

## 1. Subir el proyecto a GitHub

```bash
cd simple-deploy-demo
git init
git add .
git commit -m "Proyecto inicial: app + Dockerfile + Jenkinsfile"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/simple-deploy-demo.git
git push -u origin main
```

## 2. Levantar Jenkins (con acceso a Docker del host)

En tu máquina (necesitas Docker instalado):

```bash
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(which docker):/usr/bin/docker \
  --group-add $(stat -c '%g' /var/run/docker.sock) \
  jenkins/jenkins:lts
```

- `-v /var/run/docker.sock:...` permite que Jenkins ejecute comandos `docker`
  directamente sobre el Docker del host (necesario para que el pipeline
  construya y corra contenedores).
- Entra a `http://localhost:8080`, desbloquea con la contraseña inicial:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

- Instala los plugins sugeridos (incluye Git y Pipeline).

## 3. Crear el Pipeline Job

1. **Nueva Tarea** → nombre `simple-deploy-demo` → tipo **Pipeline**.
2. En **Pipeline**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/TU_USUARIO/simple-deploy-demo.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
3. En **Build Triggers**, marca **Poll SCM** y coloca:
   ```
   * * * * *
   ```
   (revisa cambios en `main` cada minuto; ideal para hacer la demo en vivo
   sin necesidad de exponer Jenkins a internet con un webhook).

   > Alternativa con webhook real: si tu Jenkins es accesible públicamente
   > (por ejemplo con `ngrok http 8080`), puedes usar el trigger
   > **GitHub hook trigger for GITScm polling** y configurar el webhook en
   > GitHub → Settings → Webhooks → Payload URL:
   > `http://TU_URL_NGROK/github-webhook/`.

4. Guarda.

## 4. Verificación presencial (para el docente)

1. Ejecuta el build manualmente una vez ("Build Now") para confirmar que
   todo funciona: abre `http://localhost:3000` y muestra el mensaje
   "Version 1 - Despliegue inicial".
2. En vivo, edita `app/index.js` y cambia el texto de `MENSAJE`, por ejemplo:
   ```js
   const MENSAJE = 'Version 2 - Despliegue automático funcionando';
   ```
3. Haz commit y push a `main`:
   ```bash
   git add .
   git commit -m "Actualizar mensaje de version"
   git push
   ```
4. Espera máximo 1 minuto (por el Poll SCM) y muestra cómo Jenkins dispara
   el build automáticamente (pestaña del job, "Build History").
5. Refresca `http://localhost:3000` — el mensaje nuevo debe aparecer sin que
   tocaras el servidor manualmente. Esa es la evidencia de despliegue
   automático.

## Evidencias a mostrar

- Repositorio en GitHub con el historial de commits.
- Jenkins con el job configurado (Poll SCM o webhook).
- Consola del build (`Console Output`) mostrando las 5 etapas del pipeline.
- Navegador mostrando el cambio reflejado tras el push.
