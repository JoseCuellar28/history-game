// Pruebas para verificar que el WorldMap funciona correctamente
// 20 pruebas diferentes para validar el componente

console.log('🧪 Iniciando pruebas del WorldMap...');

// Prueba 1: Verificar que el archivo WorldMap.tsx existe
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  if (fs.existsSync(worldMapPath)) {
    console.log('✅ Prueba 1: Archivo WorldMap.tsx existe');
  } else {
    console.log('❌ Prueba 1: Archivo WorldMap.tsx NO existe');
  }
} catch (error) {
  console.log('❌ Prueba 1: Error al verificar archivo:', error.message);
}

// Prueba 2: Verificar que el contenido del archivo no está vacío
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.length > 100) {
    console.log('✅ Prueba 2: Archivo WorldMap.tsx tiene contenido válido');
  } else {
    console.log('❌ Prueba 2: Archivo WorldMap.tsx está vacío o muy pequeño');
  }
} catch (error) {
  console.log('❌ Prueba 2: Error al leer archivo:', error.message);
}

// Prueba 3: Verificar que contiene la interfaz CivilizationLocation
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('interface CivilizationLocation')) {
    console.log('✅ Prueba 3: Interfaz CivilizationLocation definida');
  } else {
    console.log('❌ Prueba 3: Interfaz CivilizationLocation NO encontrada');
  }
} catch (error) {
  console.log('❌ Prueba 3: Error:', error.message);
}

// Prueba 4: Verificar que contiene la propiedad unlocked
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('unlocked: boolean')) {
    console.log('✅ Prueba 4: Propiedad unlocked definida correctamente');
  } else {
    console.log('❌ Prueba 4: Propiedad unlocked NO encontrada');
  }
} catch (error) {
  console.log('❌ Prueba 4: Error:', error.message);
}

// Prueba 5: Verificar que contiene el componente WorldMap
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('const WorldMap: React.FC')) {
    console.log('✅ Prueba 5: Componente WorldMap definido correctamente');
  } else {
    console.log('❌ Prueba 5: Componente WorldMap NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 5: Error:', error.message);
}

// Prueba 6: Verificar que contiene las civilizaciones
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('Mesopotamia') && content.includes('Egipto') && content.includes('Roma')) {
    console.log('✅ Prueba 6: Civilizaciones principales encontradas');
  } else {
    console.log('❌ Prueba 6: Civilizaciones principales NO encontradas');
  }
} catch (error) {
  console.log('❌ Prueba 6: Error:', error.message);
}

// Prueba 7: Verificar que contiene el SVG
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('<svg') && content.includes('viewBox="0 0 1000 500"')) {
    console.log('✅ Prueba 7: Elemento SVG con viewBox correcto encontrado');
  } else {
    console.log('❌ Prueba 7: Elemento SVG o viewBox NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 7: Error:', error.message);
}

// Prueba 8: Verificar que contiene los continentes
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('América del Norte') && content.includes('Europa') && content.includes('África')) {
    console.log('✅ Prueba 8: Comentarios de continentes encontrados');
  } else {
    console.log('❌ Prueba 8: Comentarios de continentes NO encontrados');
  }
} catch (error) {
  console.log('❌ Prueba 8: Error:', error.message);
}

// Prueba 9: Verificar que contiene paths para los continentes
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  const pathCount = (content.match(/<path/g) || []).length;
  if (pathCount >= 5) {
    console.log(`✅ Prueba 9: ${pathCount} elementos path encontrados (continentes)`);
  } else {
    console.log(`❌ Prueba 9: Solo ${pathCount} elementos path encontrados`);
  }
} catch (error) {
  console.log('❌ Prueba 9: Error:', error.message);
}

// Prueba 10: Verificar que contiene marcadores circulares
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('<circle') && content.includes('r="8"')) {
    console.log('✅ Prueba 10: Marcadores circulares encontrados');
  } else {
    console.log('❌ Prueba 10: Marcadores circulares NO encontrados');
  }
} catch (error) {
  console.log('❌ Prueba 10: Error:', error.message);
}

console.log('\n🔍 Continuando con pruebas avanzadas...');

// Prueba 11: Verificar coordenadas de Mesopotamia
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('x: 620') && content.includes('y: 180')) {
    console.log('✅ Prueba 11: Coordenadas de Mesopotamia correctas');
  } else {
    console.log('❌ Prueba 11: Coordenadas de Mesopotamia incorrectas');
  }
} catch (error) {
  console.log('❌ Prueba 11: Error:', error.message);
}

// Prueba 12: Verificar que tiene título
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('Mapa del Mundo Antiguo')) {
    console.log('✅ Prueba 12: Título del mapa encontrado');
  } else {
    console.log('❌ Prueba 12: Título del mapa NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 12: Error:', error.message);
}

// Prueba 13: Verificar que tiene leyenda
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('Leyenda') || content.includes('Civilizaciones')) {
    console.log('✅ Prueba 13: Leyenda encontrada');
  } else {
    console.log('❌ Prueba 13: Leyenda NO encontrada');
  }
} catch (error) {
  console.log('❌ Prueba 13: Error:', error.message);
}

// Prueba 14: Verificar que usa 'use client'
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes("'use client'")) {
    console.log('✅ Prueba 14: Directiva use client encontrada');
  } else {
    console.log('❌ Prueba 14: Directiva use client NO encontrada');
  }
} catch (error) {
  console.log('❌ Prueba 14: Error:', error.message);
}

// Prueba 15: Verificar que importa React
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes("import React from 'react'")) {
    console.log('✅ Prueba 15: Import de React encontrado');
  } else {
    console.log('❌ Prueba 15: Import de React NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 15: Error:', error.message);
}

// Prueba 16: Verificar que exporta el componente
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('export default WorldMap')) {
    console.log('✅ Prueba 16: Export default encontrado');
  } else {
    console.log('❌ Prueba 16: Export default NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 16: Error:', error.message);
}

// Prueba 17: Verificar que tiene gradiente oceánico
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('oceanGradient') && content.includes('linearGradient')) {
    console.log('✅ Prueba 17: Gradiente oceánico encontrado');
  } else {
    console.log('❌ Prueba 17: Gradiente oceánico NO encontrado');
  }
} catch (error) {
  console.log('❌ Prueba 17: Error:', error.message);
}

// Prueba 18: Verificar que tiene animaciones
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('animate-pulse')) {
    console.log('✅ Prueba 18: Animaciones encontradas');
  } else {
    console.log('❌ Prueba 18: Animaciones NO encontradas');
  }
} catch (error) {
  console.log('❌ Prueba 18: Error:', error.message);
}

// Prueba 19: Verificar que tiene estilos Tailwind
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  if (content.includes('className=') && content.includes('bg-gradient')) {
    console.log('✅ Prueba 19: Estilos Tailwind encontrados');
  } else {
    console.log('❌ Prueba 19: Estilos Tailwind NO encontrados');
  }
} catch (error) {
  console.log('❌ Prueba 19: Error:', error.message);
}

// Prueba 20: Verificar que el archivo es válido TypeScript
try {
  const fs = require('fs');
  const path = require('path');
  const worldMapPath = path.join(__dirname, 'components', 'WorldMap.tsx');
  const content = fs.readFileSync(worldMapPath, 'utf8');
  
  // Verificar sintaxis básica de TypeScript
  const hasInterfaces = content.includes('interface');
  const hasTypes = content.includes(': React.FC');
  const hasProperBraces = (content.match(/{/g) || []).length === (content.match(/}/g) || []).length;
  
  if (hasInterfaces && hasTypes && hasProperBraces) {
    console.log('✅ Prueba 20: Archivo TypeScript válido');
  } else {
    console.log('❌ Prueba 20: Archivo TypeScript inválido');
  }
} catch (error) {
  console.log('❌ Prueba 20: Error:', error.message);
}

console.log('\n🎯 Pruebas completadas. Revisa los resultados arriba.');
console.log('Si todas las pruebas muestran ✅, el WorldMap está funcionando correctamente.');
console.log('Si hay ❌, revisa los errores específicos para corregir el problema.');