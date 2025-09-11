# 🚀 Guía Completa: Conectar Vercel con GitHub

## 🎯 Objetivo
Deployar tu proyecto **History Game** automáticamente desde GitHub usando Vercel.

---

## 📋 Paso 1: Crear Cuenta en Vercel

### 1.1 Registro
1. Ve a **[vercel.com](https://vercel.com)**
2. Click en **"Sign Up"** (esquina superior derecha)
3. **IMPORTANTE**: Selecciona **"Continue with GitHub"**
   - Esto conecta automáticamente tu cuenta de GitHub
   - Es más fácil y seguro

### 1.2 Autorización
- GitHub te pedirá autorizar Vercel
- Click **"Authorize Vercel"**
- Vercel podrá acceder a tus repositorios públicos

---

## 🔗 Paso 2: Conectar Repositorio

### 2.1 Dashboard de Vercel
Una vez logueado, verás el dashboard principal:
- Click en **"New Project"** (botón azul)
- O **"Add New..."** → **"Project"**

### 2.2 Importar desde GitHub
1. **Buscar repositorio**:
   - Verás una lista de tus repositorios
   - Busca: **"history-game"**
   - Si no aparece, click **"Adjust GitHub App Permissions"**

2. **Seleccionar repositorio**:
   - Click **"Import"** junto a `history-game`

---

## ⚙️ Paso 3: Configuración del Proyecto

### 3.1 Configuración Automática
Vercel detecta automáticamente:
- ✅ **Framework**: Next.js
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `.next`
- ✅ **Install Command**: `npm install`

### 3.2 Configuración Manual (si es necesario)
Si necesitas ajustar algo:

```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install
# o si usas pnpm:
pnpm install

# Development Command
npm run dev
```

### 3.3 Variables de Entorno (opcional)
Si tu proyecto necesita variables:
- Click **"Environment Variables"**
- Agrega las que necesites
- Para este proyecto no son necesarias

---

## 🚀 Paso 4: Deploy

### 4.1 Primer Deploy
1. **Revisar configuración**
2. Click **"Deploy"** (botón azul)
3. **Esperar**: Vercel construirá tu proyecto
   - Verás logs en tiempo real
   - Proceso toma 1-3 minutos

### 4.2 Resultado del Deploy
Cuando termine:
- ✅ **Status**: "Ready"
- 🌐 **URL**: `https://history-game-git-main-josecuellar28.vercel.app`
- 🎉 **Proyecto live**: ¡Ya está en internet!

---

## 🌐 Paso 5: URLs y Dominios

### 5.1 URLs Automáticas
Vercel te da 3 URLs:
1. **Production**: `https://history-game-josecuellar28.vercel.app`
2. **Git Branch**: `https://history-game-git-main-josecuellar28.vercel.app`
3. **Deployment**: `https://history-game-abc123.vercel.app`

### 5.2 Dominio Personalizado (opcional)
Para usar tu propio dominio:
1. Ve a **Settings** → **Domains**
2. Click **"Add"**
3. Ingresa tu dominio: `tudominio.com`
4. Configura DNS según instrucciones

---

## 🔄 Paso 6: Deploy Automático

### 6.1 ¿Cómo funciona?
Cada vez que hagas cambios:

```bash
# En tu computadora
git add .
git commit -m "Nuevas mejoras"
git push
```

**¡Vercel automáticamente:**
- 🔍 Detecta el push
- 🏗️ Construye el proyecto
- 🚀 Deploya la nueva versión
- 📧 Te notifica por email

### 6.2 Branches y Preview
- **main/master**: Deploy a producción
- **otras branches**: Preview deployments
- Cada PR tiene su propia URL de preview

---

## 📊 Paso 7: Monitoreo y Analytics

### 7.1 Dashboard de Vercel
En tu dashboard puedes ver:
- 📈 **Analytics**: Visitantes, performance
- 🚀 **Deployments**: Historial de deploys
- ⚡ **Functions**: Uso de serverless functions
- 📊 **Speed Insights**: Métricas de velocidad

### 7.2 Logs y Debugging
- **Build Logs**: Ver errores de construcción
- **Function Logs**: Logs de runtime
- **Real-time**: Monitoreo en vivo

---

## 🛠️ Solución de Problemas

### Error: "Build Failed"
```bash
# Verificar localmente
npm run build

# Si falla, revisar:
# 1. Dependencias en package.json
# 2. Errores de TypeScript
# 3. Imports incorrectos
```

### Error: "Module not found"
```javascript
// Verificar rutas relativas
// ❌ Incorrecto
import Component from '../Component'

// ✅ Correcto
import Component from '../components/Component'
```

### Error: "Images not loading"
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['upload.wikimedia.org'],
    unoptimized: true
  }
}
```

### Error: "Environment Variables"
- Agregar variables en Vercel Dashboard
- Settings → Environment Variables
- Redeploy después de agregar

---

## ✅ Checklist Final

### Antes del Deploy:
- [ ] Proyecto funciona localmente (`npm run dev`)
- [ ] Build exitoso (`npm run build`)
- [ ] No hay errores de TypeScript
- [ ] Imágenes y assets funcionan
- [ ] Código subido a GitHub

### Después del Deploy:
- [ ] URL de Vercel funciona
- [ ] Todas las páginas cargan
- [ ] Imágenes se muestran correctamente
- [ ] Mapa interactivo funciona
- [ ] No hay errores en consola

---

## 🎯 Comandos Útiles

### Vercel CLI (opcional)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde terminal
vercel

# Deploy a producción
vercel --prod
```

### Git Workflow
```bash
# Hacer cambios
git add .
git commit -m "Descripción del cambio"
git push

# Vercel automáticamente deploya
```

---

## 🌟 Resultado Final

### Tu proyecto estará disponible en:
- **URL Principal**: `https://history-game-josecuellar28.vercel.app`
- **Accesible desde**: Cualquier dispositivo con internet
- **Actualizaciones**: Automáticas con cada push a GitHub
- **Performance**: Optimizado globalmente con CDN
- **SSL**: Certificado HTTPS automático

### Características incluidas:
- ✅ **Deploy automático** desde GitHub
- ✅ **Preview deployments** para branches
- ✅ **Analytics** y métricas
- ✅ **CDN global** para velocidad
- ✅ **SSL/HTTPS** automático
- ✅ **Rollback** fácil a versiones anteriores

---

## 🎉 ¡Felicitaciones!

Tu proyecto **History Game** ya está:
- 🌐 **En línea** y accesible mundialmente
- 🔄 **Actualizado automáticamente** con cada cambio
- ⚡ **Optimizado** para máxima velocidad
- 📱 **Responsive** en todos los dispositivos

**¡Comparte tu URL con el mundo!** 🚀