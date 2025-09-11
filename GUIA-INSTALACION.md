# Guía de Instalación - History Game

## 📋 Requisitos del Sistema

Antes de instalar el proyecto, asegúrate de tener instalado:

### 1. Node.js (versión 18 o superior)
- **Windows**: Descarga desde [nodejs.org](https://nodejs.org/)
- **macOS**: Usa Homebrew: `brew install node`
- **Linux**: `sudo apt install nodejs npm` (Ubuntu/Debian)

### 2. Gestor de Paquetes
- **npm** (incluido con Node.js)
- **pnpm** (recomendado): `npm install -g pnpm`

## 🚀 Instalación del Proyecto

### Opción 1: Transferir desde USB/Carpeta

1. **Copia la carpeta completa del proyecto** a tu nueva PC
2. **Abre terminal/cmd** en la carpeta del proyecto:
   ```bash
   cd ruta/a/history-game
   ```

### Opción 2: Desde Git (si tienes repositorio)

```bash
git clone [URL_DEL_REPOSITORIO]
cd history-game
```

## 📦 Instalación de Dependencias

### Con pnpm (recomendado):
```bash
pnpm install
```

### Con npm:
```bash
npm install
```

## ▶️ Ejecutar el Proyecto

### Modo Desarrollo:
```bash
# Con pnpm
pnpm dev

# Con npm
npm run dev
```

### Modo Producción:
```bash
# Construir el proyecto
pnpm build
# o
npm run build

# Ejecutar en producción
pnpm start
# o
npm start
```

## 🌐 Acceder a la Aplicación

Una vez ejecutado, abre tu navegador en:
- **Desarrollo**: http://localhost:3000
- **Producción**: http://localhost:3000 (o el puerto configurado)

## 🔧 Solución de Problemas Comunes

### Error: "node_modules not found"
```bash
# Elimina node_modules y reinstala
rm -rf node_modules
pnpm install
# o
npm install
```

### Error: "Port 3000 already in use"
```bash
# Mata el proceso en el puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Error: "Module not found"
```bash
# Limpia caché y reinstala
pnpm store prune
pnpm install
# o
npm cache clean --force
npm install
```

### Problemas con TypeScript
```bash
# Verifica la configuración de TypeScript
npx tsc --noEmit
```

## 📁 Estructura del Proyecto

```
history-game/
├── app/                 # Páginas de Next.js
├── components/          # Componentes React
├── public/             # Archivos estáticos
├── styles/             # Estilos CSS
├── package.json        # Dependencias del proyecto
└── next.config.mjs     # Configuración de Next.js
```

## 🔍 Verificar Instalación

Para verificar que todo funciona correctamente:

1. ✅ **Node.js instalado**: `node --version`
2. ✅ **npm/pnpm instalado**: `pnpm --version` o `npm --version`
3. ✅ **Dependencias instaladas**: Debe existir carpeta `node_modules/`
4. ✅ **Servidor ejecutándose**: Mensaje "Ready - started server on 0.0.0.0:3000"
5. ✅ **Aplicación cargando**: Abrir http://localhost:3000 en el navegador

## 📞 Soporte

Si encuentras problemas:
1. Verifica que Node.js esté actualizado (v18+)
2. Elimina `node_modules` y reinstala dependencias
3. Revisa que no haya otros procesos usando el puerto 3000
4. Consulta los logs en la terminal para errores específicos

---

**¡Listo!** Tu proyecto History Game debería estar funcionando en la nueva PC. 🎉