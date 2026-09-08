# Despliegue — GitHub Pages

YACHAY ÑAN 3D es un sitio estático. GitHub Actions construye `dist/` y GitHub Pages lo sirve.

## Activar Pages (una vez)

1. Abre el repositorio en GitHub.
2. **Settings → Pages**.
3. En **Build and deployment → Source** elige **GitHub Actions** (no "Deploy from a branch").
4. Guarda. El entorno `github-pages` se crea al primer despliegue exitoso; si GitHub pide aprobar el entorno, apruébalo.

El workflow `.github/workflows/deploy.yml` se dispara en push a `main` y con **Run workflow** (`workflow_dispatch`).

Jobs:

1. `quality`: `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`
2. `deploy`: espera a `quality`, corre `npm run build`, sube el artefacto y publica con `actions/upload-pages-artifact` y `actions/deploy-pages`

Permisos del workflow: `contents: read`, `pages: write`, `id-token: write`. Hay `concurrency` de grupo `pages` para no solapar publicaciones (`cancel-in-progress: false` para no abortar un deploy a medias).

## Nombre del repositorio y `base`

Vite, en producción, usa:

```
base: '/yachay-nan-3d/'
```

Eso asume que el repo se llama **`yachay-nan-3d`**, de modo que la URL pública sea:

`https://<usuario-o-org>.github.io/yachay-nan-3d/`

Si el repo tiene otro nombre, cambia la constante `GITHUB_PAGES_BASE` en `vite.config.ts`. En desarrollo `base` es `'/'`.

`public/.nojekyll` evita que Pages ignore carpetas que empiezan por `_` (Vite puede emitir chunks con ese prefijo).

## Por qué hash routing

GitHub Pages sirve archivos. Una URL como `/yachay-nan-3d/actividad/braille` no existe como archivo y Pages responde 404. No hay servidor propio para reescribir rutas a `index.html`.

`createHashRouter` deja la ruta después de `#`:

`https://<usuario>.github.io/yachay-nan-3d/#/actividad/braille`

El servidor solo pide `/yachay-nan-3d/` (o `/yachay-nan-3d/index.html`). El cliente lee el hash y pinta la vista.

## Comprobar el despliegue

Tras un push a `main`:

1. Actions → workflow **Deploy to GitHub Pages** en verde
2. Settings → Pages muestra la URL
3. La landing carga, el título del documento no está vacío y el skip link responde a Tab
