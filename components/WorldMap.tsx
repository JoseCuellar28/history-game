'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importación dinámica para evitar errores de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface CivilizationLocation {
  name: string;
  lat: number; // Latitud real
  lng: number; // Longitud real
  description: string;
  color: string;
  chapter: string;
  unlocked: boolean;
  timeperiod?: string;
  image?: string;
  keyAchievement?: string;
}

interface WorldMapProps {
  currentChapter?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ currentChapter }) => {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Importar Leaflet dinámicamente
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Configurar iconos por defecto
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  // Ubicaciones reales de las civilizaciones (coordenadas geográficas)
  const civilizations: CivilizationLocation[] = [
    {
      name: "Mesopotamia",
      lat: 33.3152,
      lng: 44.3661,
      description: "Cuna de la civilización, entre los ríos Tigris y Éufrates",
      color: "#8B4513",
      chapter: "mesopotamia",
      unlocked: true,
      timeperiod: "3500 - 539 a.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Ziggurat_of_Ur_001.jpg",
      keyAchievement: "Primera escritura cuneiforme"
    },
    {
      name: "Egipto",
      lat: 26.8206,
      lng: 30.8025,
      description: "Tierra de faraones y pirámides",
      color: "#FFD700",
      chapter: "egipto",
      unlocked: false,
      timeperiod: "3100 - 30 a.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
      keyAchievement: "Pirámides de Giza"
    },
    {
      name: "Grecia",
      lat: 39.0742,
      lng: 21.8243,
      description: "Cuna de la democracia y la filosofía",
      color: "#4169E1",
      chapter: "grecia",
      unlocked: false,
      timeperiod: "800 - 146 a.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg",
      keyAchievement: "Democracia ateniense"
    },
    {
      name: "Roma",
      lat: 41.9028,
      lng: 12.4964,
      description: "El gran imperio que dominó el mundo mediterráneo",
      color: "#DC143C",
      chapter: "roma",
      unlocked: false,
      timeperiod: "753 a.C. - 476 d.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
      keyAchievement: "Derecho romano"
    },
    {
      name: "China",
      lat: 39.9042,
      lng: 116.4074,
      description: "Imperio milenario con grandes inventos",
      color: "#FF6347",
      chapter: "china",
      unlocked: false,
      timeperiod: "2070 a.C. - presente",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/20090529_Great_Wall_8185.jpg",
      keyAchievement: "Gran Muralla China"
    },
    {
      name: "India",
      lat: 28.6139,
      lng: 77.2090,
      description: "Tierra de religiones y conocimiento ancestral",
      color: "#FF8C00",
      chapter: "india",
      unlocked: false,
      timeperiod: "3300 - 550 d.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Lotus_Temple_in_New_Delhi_03-2016.jpg",
      keyAchievement: "Concepto del cero"
    },
    {
      name: "Maya",
      lat: 20.6843,
      lng: -88.5678,
      description: "Maestros de la astronomía y las matemáticas",
      color: "#32CD32",
      chapter: "maya",
      unlocked: false,
      timeperiod: "2000 a.C. - 1500 d.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Chichen_Itza_3.jpg",
      keyAchievement: "Calendario maya preciso"
    },
    {
      name: "Inca",
      lat: -13.1631,
      lng: -72.5450,
      description: "Imperio de los Andes con increíble arquitectura",
      color: "#9370DB",
      chapter: "inca",
      unlocked: false,
      timeperiod: "1200 - 1572 d.C.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
      keyAchievement: "Machu Picchu"
    }
  ];

  const isCurrentChapter = (chapter: string) => {
    return currentChapter === chapter;
  };

  const createCustomIcon = (color: string, unlocked: boolean) => {
    if (!L) return null;
    
    const iconHtml = `
      <div style="
        background-color: ${unlocked ? '#FFD700' : '#666'};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid ${unlocked ? '#FFA000' : '#333'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: ${unlocked ? '#000' : '#fff'};
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${unlocked ? 'animation: pulse 2s infinite;' : ''}
      ">
        🏛️
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  if (!isClient || !L) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-lg border-4 border-amber-700 overflow-hidden relative flex items-center justify-center">
        <div className="text-amber-800 font-bold">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg border-4 border-amber-700 overflow-hidden relative">
      {/* Mapa real de OpenStreetMap */}
      <MapContainer
        center={[35, 25]} // Centro en el Mediterráneo
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marcadores de civilizaciones */}
        {civilizations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.color, location.unlocked)}
          >
            <Popup>
              <div className="text-center w-64">
                {location.image ? (
                  <>
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                         const target = e.currentTarget;
                         target.style.display = 'none';
                         const placeholder = target.nextElementSibling as HTMLElement;
                         if (placeholder) placeholder.style.display = 'flex';
                       }}
                    />
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-gray-500 text-sm">🏛️ {location.name}</span>
                    </div>
                  </>
                 ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">🏛️ {location.name}</span>
                  </div>
                )}
                <h4 className="font-bold text-lg mb-1" style={{ color: location.color }}>
                  {location.name}
                </h4>
                {location.timeperiod && (
                  <p className="text-xs text-gray-500 italic mb-2">
                    {location.timeperiod}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-2">
                  {location.description}
                </p>
                {location.keyAchievement && (
                  <div className="bg-amber-50 p-2 rounded-md mb-3">
                    <p className="text-xs font-semibold text-amber-800">
                      🏆 {location.keyAchievement}
                    </p>
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    location.unlocked 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {location.unlocked ? '✅ Disponible' : '🔒 Bloqueado'}
                  </span>
                  {isCurrentChapter(location.chapter) && (
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                      📍 Actual
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-2 right-2 bg-amber-100 px-2 py-1 rounded-md border-2 border-amber-700 text-xs z-[1000]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
          <span className="text-amber-800 text-xs">Civilizaciones Antiguas</span>
        </div>
        {currentChapter && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-amber-800 text-xs">Actual: {currentChapter}</span>
          </div>
        )}
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default WorldMap;