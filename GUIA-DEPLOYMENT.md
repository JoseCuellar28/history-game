# 🌐 Guía de Deployment - History Game

## 🎯 Opciones para Subir tu Proyecto a Internet

Tienes varias opciones **GRATUITAS** para que tu proyecto sea accesible desde cualquier lugar:

---

## 🚀 Opción 1: Vercel (RECOMENDADO)

**✅ Perfecto para Next.js | ✅ Gratis | ✅ Fácil configuración**

### Paso a paso:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con GitHub, GitLab o email

2. **Subir tu proyecto a GitHub** (si no lo tienes)
   ```bash
   # En tu carpeta del proyecto
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/history-game.git
   git push -u origin main
   ```

3. **Conectar con Vercel**
   - En Vercel, click "New Project"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `history-game`
   - Click "Deploy"

4. **¡Listo!** 🎉
   - Vercel detecta automáticamente que es Next.js
   - Te da una URL como: `https://history-game-tu-usuario.vercel.app`

### Configuración automática:
```json
// vercel.json (opcional)
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

---

## 🔧 Opción 2: Netlify

**✅ Gratis | ✅ Drag & Drop | ✅ CI/CD automático**

### Método 1: Drag & Drop
1. **Construir el proyecto**
   ```bash
   npm run build
   npm run export  # Si tienes configurado export
   ```

2. **Subir a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `out/` o `.next/` al área de deploy

### Método 2: Git Integration
1. Sube tu código a GitHub
2. Conecta Netlify con tu repositorio
3. Configuración:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

---

## 📱 Opción 3: GitHub Pages

**✅ Totalmente gratis | ✅ Integrado con GitHub**

### Configuración:

1. **Modificar next.config.mjs**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     },
     basePath: '/history-game', // Nombre de tu repositorio
     assetPrefix: '/history-game/'
   }
   
   export default nextConfig
   ```

2. **Crear workflow de GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

3. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`

---

## ☁️ Opción 4: Railway

**✅ Gratis (500 horas/mes) | ✅ Base de datos incluida**

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detecta automáticamente Next.js
4. Deploy automático

---

## 🔥 Opción 5: Firebase Hosting

**✅ Gratis | ✅ CDN global | ✅ SSL automático**

### Configuración:

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Configurar proyecto**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configurar firebase.json**
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [{
         "source": "**",
         "destination": "/index.html"
       }]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

## 🏆 Comparación de Opciones

| Servicio | Facilidad | Velocidad | Características |
|----------|-----------|-----------|----------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Optimizado para Next.js, Preview deployments |
| **Netlify** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Drag & drop, Forms, Functions |
| **GitHub Pages** | ⭐⭐⭐ | ⭐⭐⭐ | Gratis ilimitado, integrado con Git |
| **Railway** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Base de datos, Backend services |
| **Firebase** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | CDN global, Analytics |

---

## 🔧 Solución de Problemas

### Error: "Module not found" en producción
```bash
# Verificar dependencias
npm run build
# Si falla, revisar imports y rutas
```

### Error: Imágenes no cargan
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['upload.wikimedia.org']
  }
}
```

### Error: Rutas no funcionan
```javascript
// Para GitHub Pages
const nextConfig = {
  trailingSlash: true,
  output: 'export'
}
```

---

## 🎯 Recomendación Final

### Para principiantes: **Vercel**
- Más fácil configuración
- Optimizado para Next.js
- URL personalizada gratis
- Deploy automático desde Git

### Para máximo control: **GitHub Pages**
- Completamente gratis
- Sin límites de ancho de banda
- Integrado con tu código

### Comando rápido para Vercel:
```bash
# Instalar Vercel CLI
npm i -g vercel

# En tu proyecto
vercel
# Seguir las instrucciones
```

---

## 📱 URLs de Ejemplo

Una vez deployado, tu proyecto estará disponible en:
- **Vercel**: `https://history-game-usuario.vercel.app`
- **Netlify**: `https://amazing-name-123456.netlify.app`
- **GitHub Pages**: `https://usuario.github.io/history-game`
- **Railway**: `https://history-game-production.up.railway.app`

¡Elige la opción que más te convenga y comparte tu proyecto con el mundo! 🌍✨