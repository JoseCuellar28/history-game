"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import WorldMap from "@/components/WorldMap"


export default function GameMenu() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "chapters" | "lobby" | "questions" | "bimestre-complete">("menu")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [chapterProgress, setChapterProgress] = useState<{[key: string]: {completed: boolean, score: number, totalQuestions: number}}>({})
  const [totalScore, setTotalScore] = useState(0)
  const [completedBimestre, setCompletedBimestre] = useState<number | null>(null)

  if (currentScreen === "questions") {
    return (
      <GameQuestions 
        onBack={() => setCurrentScreen("lobby")} 
        chapter={selectedChapter}
        onComplete={(score: number, totalQuestions: number) => {
          const minimumScore = Math.ceil(totalQuestions * 0.6) // 60% mínimo
          
          if (score < minimumScore) {
            // No completar el capítulo si no alcanza el puntaje mínimo
            setCurrentScreen("lobby")
            return
          }
          
          // Guardar progreso del capítulo
          const newProgress = {
            ...chapterProgress,
            [selectedChapter]: { completed: true, score, totalQuestions }
          }
          setChapterProgress(newProgress)
          setTotalScore(prev => prev + score * 50) // 50 puntos por respuesta correcta
          
          // Verificar si se completó el bimestre
          const bimestres = {
            1: ["La Prehistoria", "El Paleolítico", "El Neolítico", "La Edad de los Metales"],
            2: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"],
            3: ["Grecia", "Roma", "El Imperio Romano", "La Caída del Imperio"],
            4: ["Culturas Preincas", "Los Incas", "El Tahuantinsuyo", "La Conquista"],
          }
          
          for (const [bimestreNum, chapters] of Object.entries(bimestres)) {
            if (chapters.includes(selectedChapter)) {
              const allCompleted = chapters.every(chapter => 
                newProgress[chapter]?.completed || chapter === selectedChapter
              )
              if (allCompleted) {
                setCompletedBimestre(parseInt(bimestreNum))
                setCurrentScreen("bimestre-complete")
                return
              }
            }
          }
          
          setCurrentScreen("lobby")
        }}
      />
    )
  }

  if (currentScreen === "bimestre-complete") {
    return (
      <BimestreComplete 
        bimestre={completedBimestre!}
        totalScore={totalScore}
        onBackToMenu={() => {
          setCurrentScreen("chapters")
          setCompletedBimestre(null)
        }}
      />
    )
  }

  if (currentScreen === "lobby") {
    return (
      <GameLobby
        onBack={() => setCurrentScreen("chapters")}
        chapter={selectedChapter}
        onStartGame={() => setCurrentScreen("questions")}
        chapterProgress={chapterProgress}
        totalScore={totalScore}
        onSelectChapter={(chapter) => setSelectedChapter(chapter)}
      />
    )
  }

  if (currentScreen === "chapters") {
    return (
      <ChapterSelection
        onBack={() => setCurrentScreen("menu")}
        onContinue={(chapter) => {
          setSelectedChapter(chapter)
          setCurrentScreen("lobby")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-amber-200 via-orange-200 to-yellow-300">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: "url('/images/ancient-temple-background.png')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-orange-900/15 to-yellow-900/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-bold text-amber-900 mb-16 tracking-wider text-center"
          style={{
            textShadow:
              "3px 3px 0px #92400e, -1px -1px 0px #fbbf24, 1px -1px 0px #fbbf24, -1px 1px 0px #fbbf24, 1px 1px 0px #fbbf24",
            WebkitTextStroke: "2px #92400e",
          }}
        >
          HISTORY
        </h1>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button
            className="h-14 text-xl font-semibold bg-amber-800/90 hover:bg-amber-700 text-amber-100 border-2 border-amber-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => setCurrentScreen("chapters")}
          >
            PLAY
          </Button>

          <Button
            className="h-14 text-xl font-semibold bg-amber-800/90 hover:bg-amber-700 text-amber-100 border-2 border-amber-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => console.log("Configuration clicked")}
          >
            CONFIGURATION
          </Button>

          <Button
            className="h-14 text-xl font-semibold bg-amber-800/90 hover:bg-amber-700 text-amber-100 border-2 border-amber-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => console.log("Exit clicked")}
          >
            EXIT
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChapterSelection({ onBack, onContinue }: { onBack: () => void; onContinue: (chapter: string) => void }) {
  const [expandedBimestre, setExpandedBimestre] = useState<number | null>(1)
  const [selectedChapter, setSelectedChapter] = useState("")

  const bimestres = {
    1: {
      title: "BIMESTRE I",
      chapters: ["La Prehistoria", "El Paleolítico", "El Neolítico", "La Edad de los Metales"],
    },
    2: {
      title: "BIMESTRE II",
      chapters: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"],
    },
    3: {
      title: "BIMESTRE III",
      chapters: ["Grecia", "Roma", "El Imperio Romano", "La Caída del Imperio"],
    },
    4: {
      title: "BIMESTRE IV",
      chapters: ["Culturas Preincas", "Los Incas", "El Tahuantinsuyo", "La Conquista"],
    },
  }

  const chapterContent = {
    "La Prehistoria":
      "La prehistoria es el período de la historia humana que abarca desde la aparición de los primeros homínidos hasta la invención de la escritura. Durante este extenso período, los seres humanos desarrollaron herramientas, el fuego, el arte y las primeras formas de organización social.",
    "El Paleolítico":
      "El Paleolítico o Edad de Piedra Antigua fue el período más largo de la prehistoria humana. Los humanos eran cazadores-recolectores nómadas que utilizaban herramientas de piedra tallada y vivían en cuevas o refugios temporales.",
    "El Neolítico":
      "El Neolítico marcó una revolución en la historia humana con el desarrollo de la agricultura y la ganadería. Los humanos se volvieron sedentarios, construyeron las primeras aldeas y desarrollaron la cerámica y el tejido.",
    "La Edad de los Metales":
      "La Edad de los Metales se divide en tres períodos: Edad del Cobre, Edad del Bronce y Edad del Hierro. El dominio de la metalurgia revolucionó las herramientas, armas y la organización social.",
    Mesopotamia:
      "Mesopotamia: La Cuna de la Civilización. Conocida como la 'tierra entre los ríos' Tigris y Éufrates, Mesopotamia fue el lugar donde nacieron las primeras ciudades. Esta civilización fue pionera y nos dejó inventos que cambiaron el mundo para siempre. ¡Datos Clave! Escritura Cuneiforme: Inventaron uno de los primeros sistemas de escritura, usando tablillas de arcilla. El Código de Hammurabi: Crearon el primer gran conjunto de leyes para organizar su sociedad. La Rueda: Su invención revolucionó el transporte y la construcción.",
    Egipto:
      "El antiguo Egipto se desarrolló a orillas del río Nilo. Conocido por sus faraones, pirámides, momificación y jeroglíficos, fue una de las civilizaciones más duraderas de la historia antigua.",
    Esparta:
      "Esparta fue una ciudad-estado griega conocida por su sociedad militarista y disciplinada. Los espartanos se destacaron por su entrenamiento militar riguroso desde la infancia y su sistema político único basado en la diarquía.",
    Atenas:
      "Atenas fue la cuna de la democracia y el centro cultural e intelectual de la antigua Grecia. Destacó por sus filósofos, artistas, dramaturgos y por el desarrollo del pensamiento racional y científico.",
    "La Migración":
      "Las grandes migraciones humanas han sido fundamentales en la historia de la humanidad. Desde las primeras migraciones del Homo sapiens fuera de África hasta los movimientos de pueblos que transformaron civilizaciones enteras.",
    Grecia:
      "La antigua Grecia fue la cuna de la democracia, filosofía, teatro y ciencias. Las ciudades-estado como Atenas y Esparta marcaron el desarrollo del pensamiento occidental.",
    Roma: "Roma comenzó como una ciudad-estado y se convirtió en el imperio más grande del mundo antiguo. Su legado incluye el derecho romano, la ingeniería y la expansión del cristianismo.",
    "El Imperio Romano":
      "En su apogeo, el Imperio Romano se extendía desde Britania hasta Mesopotamia. Su organización militar, administrativa y cultural influyó profundamente en la civilización occidental.",
    "La Caída del Imperio":
      "La caída del Imperio Romano de Occidente en 476 d.C. marcó el fin de la Edad Antigua. Factores como las invasiones bárbaras, crisis económica y división del imperio contribuyeron a su declive.",
    "Culturas Preincas":
      "Antes de los incas, el Perú fue hogar de grandes civilizaciones como Chavín, Moche, Nazca, Tiahuanaco, Chimú y Chachapoya, cada una con sus propias características culturales y tecnológicas.",
    "Los Incas":
      "Los incas fueron la civilización más grande de América precolombina. Desarrollaron un imperio altamente organizado con avanzadas técnicas agrícolas, arquitectónicas y administrativas.",
    "El Tahuantinsuyo":
      "El Tahuantinsuyo fue el nombre del Imperio Inca, que significa 'las cuatro regiones'. Se extendía desde Ecuador hasta Chile y Argentina, unificado por una compleja red de caminos y administración.",
    "La Conquista":
      "La conquista española del Imperio Inca, liderada por Francisco Pizarro en 1532, marcó el fin del Tahuantinsuyo y el inicio del período colonial en América del Sur.",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      {/* Header */}
      <div className="bg-amber-900 border-4 border-amber-700 rounded-lg mb-6 p-4 shadow-2xl">
        <h1 className="text-4xl font-bold text-amber-100 text-center tracking-wider">HISTORIA</h1>
      </div>

      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-amber-800/90 border-4 border-amber-700 rounded-lg p-4 shadow-2xl">
          <div className="space-y-4">
            {Object.entries(bimestres).map(([bimestreNum, bimestre]) => (
              <div key={bimestreNum} className="space-y-2">
                <button
                  onClick={() => {
                    const num = Number(bimestreNum)
                    if (expandedBimestre === num) {
                      setExpandedBimestre(null)
                    } else {
                      setExpandedBimestre(num)
                      setSelectedChapter(bimestre.chapters[0])
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-between ${
                    expandedBimestre === Number(bimestreNum)
                      ? "bg-amber-600 text-amber-100 shadow-lg"
                      : "bg-amber-700/70 text-amber-200 hover:bg-amber-600/80 hover:text-amber-100"
                  }`}
                >
                  <span>{bimestre.title}</span>
                  <span className="text-xl">{expandedBimestre === Number(bimestreNum) ? "−" : "+"}</span>
                </button>

                {expandedBimestre === Number(bimestreNum) && (
                  <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {bimestre.chapters.map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`w-full text-left p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedChapter === chapter
                            ? "bg-amber-500 text-amber-100 shadow-md"
                            : "bg-amber-700/50 text-amber-200 hover:bg-amber-600/60 hover:text-amber-100"
                        }`}
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-amber-100 border-4 border-amber-700 rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">{selectedChapter}</h2>

          <div className="text-amber-800 text-lg leading-relaxed mb-8 font-medium">
            {chapterContent[selectedChapter as keyof typeof chapterContent]}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              className="px-8 py-3 text-lg font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 border-2 border-amber-600 shadow-lg transition-all duration-200 hover:scale-105"
            >
              VOLVER
            </Button>

            <Button
              onClick={() => onContinue(selectedChapter)}
              className="px-8 py-3 text-lg font-semibold bg-amber-800 hover:bg-amber-700 text-amber-100 border-2 border-amber-600 shadow-lg transition-all duration-200 hover:scale-105"
            >
              CONTINUAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BimestreComplete({ bimestre, totalScore, onBackToMenu }: {
  bimestre: number;
  totalScore: number;
  onBackToMenu: () => void;
}) {
  const bimestreNames = {
    1: "BIMESTRE I - PREHISTORIA",
    2: "BIMESTRE II - CIVILIZACIONES ANTIGUAS", 
    3: "BIMESTRE III - GRECIA Y ROMA",
    4: "BIMESTRE IV - CULTURAS PERUANAS"
  }

  const motivationalMessages = {
    1: "¡Increíble! Has dominado la Prehistoria como un verdadero arqueólogo. ¡Ahora estás listo para explorar las grandes civilizaciones!",
    2: "¡Fantástico! Has conquistado las civilizaciones más antiguas del mundo. ¡Tu conocimiento crece como las pirámides de Egipto!",
    3: "¡Espectacular! Has explorado Grecia y Roma como un gran historiador. ¡Los dioses del Olimpo estarían orgullosos de ti!",
    4: "¡Extraordinario! Has completado tu viaje por las culturas peruanas. ¡Eres un verdadero explorador de la historia!"
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 border-8 border-yellow-400 rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl relative z-10">
        {/* Título de celebración */}
        <div className="text-6xl mb-6 animate-bounce">
          🎉🏆🎊
        </div>
        
        <h1 className="text-4xl font-bold text-purple-800 mb-4 animate-pulse">
          ¡FELICITACIONES!
        </h1>
        
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          ¡HAS COMPLETADO EL {bimestreNames[bimestre as keyof typeof bimestreNames]}!
        </h2>

        {/* Mensaje motivacional */}
        <div className="bg-white/80 rounded-2xl p-6 mb-6 border-4 border-yellow-300">
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            {motivationalMessages[bimestre as keyof typeof motivationalMessages]}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-yellow-400 rounded-full px-4 py-2 font-bold text-purple-800">
              ⭐ {totalScore} PUNTOS TOTALES
            </div>
            <div className="text-4xl animate-spin">
              🎯
            </div>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-2xl p-6 mb-6 border-4 border-yellow-500">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            👑 ¡EXCELENTE TRABAJO!
          </h3>
          <p className="text-lg text-yellow-700">
            Has completado el {bimestreNames[bimestre as keyof typeof bimestreNames]}. ¡Sigue así!
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onBackToMenu}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🏠 MENÚ PRINCIPAL
          </Button>
        </div>

        {/* Mensaje final motivacional */}
        <div className="mt-6 text-sm text-gray-600">
          <p>"El conocimiento es el tesoro más valioso que puedes encontrar" 📚✨</p>
        </div>
      </div>
    </div>
  )
}

function GameLobby({ onBack, chapter, onStartGame, chapterProgress, totalScore, onSelectChapter }: { 
  onBack: () => void; 
  chapter: string; 
  onStartGame: () => void;
  chapterProgress: {[key: string]: {completed: boolean, score: number, totalQuestions: number}};
  totalScore: number;
  onSelectChapter: (chapter: string) => void;
}) {
  // Definir la estructura de bimestres y capítulos
  const bimestres = {
    1: {
      title: "BIMESTRE I",
      chapters: ["La Prehistoria", "El Paleolítico", "El Neolítico", "La Edad de los Metales"],
    },
    2: {
      title: "BIMESTRE II", 
      chapters: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"],
    },
    3: {
      title: "BIMESTRE III",
      chapters: ["Grecia", "Roma", "El Imperio Romano", "La Caída del Imperio"],
    },
    4: {
      title: "BIMESTRE IV",
      chapters: ["Culturas Preincas", "Los Incas", "El Tahuantinsuyo", "La Conquista"],
    },
  }

  // Encontrar el bimestre actual basado en el capítulo seleccionado
  const getCurrentBimestre = () => {
    for (const [bimestreNum, bimestre] of Object.entries(bimestres)) {
      if (bimestre.chapters.includes(chapter)) {
        return { number: parseInt(bimestreNum), ...bimestre }
      }
    }
    return { number: 1, ...bimestres[1] } // Default al bimestre 1
  }

  const currentBimestre = getCurrentBimestre()
  const currentChapterIndex = currentBimestre.chapters.indexOf(chapter)
  
  // Calcular misiones completadas basado en el progreso real
  const completedMissions = currentBimestre.chapters.filter(chapterName => 
    chapterProgress[chapterName]?.completed
  ).length
  
  const totalMissions = currentBimestre.chapters.length
  const progressPercentage = (completedMissions / totalMissions) * 100
  
  // Verificar si el capítulo actual está completado
  const isCurrentChapterCompleted = chapterProgress[chapter]?.completed || false
  
  // Encontrar el siguiente capítulo disponible
  const getNextChapter = () => {
    const currentIndex = currentBimestre.chapters.indexOf(chapter)
    if (currentIndex < currentBimestre.chapters.length - 1) {
      return currentBimestre.chapters[currentIndex + 1]
    }
    return null
  }
  
  const nextChapter = getNextChapter()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/explorer-character-background.png')",
          imageRendering: "auto",
          WebkitBackfaceVisibility: "hidden",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-start gap-8 max-w-7xl mx-auto">
          {/* Left Side - Mission Board and Action Buttons */}
          <div className="space-y-6 flex-shrink-0">
            <div className="bg-gray-700/80 text-white px-4 py-2 rounded-lg font-bold text-center">
              TABLERO DE MISIONES - {currentBimestre.title}
            </div>
            
            {/* Mission Board Game */}
            <div className="bg-amber-100/90 border-4 border-amber-700 rounded-lg p-6 w-80 shadow-2xl">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Mission Path - Mostrar solo las misiones del bimestre actual */}
                {currentBimestre.chapters.map((chapterName, i) => {
                  const isCompleted = chapterProgress[chapterName]?.completed || false
                  const isCurrent = chapterName === chapter
                  const isLocked = !isCompleted && !isCurrent
                  
                  return (
                    <div
                      key={i}
                      className={`
                        w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-bold
                        transition-all duration-300 hover:scale-110 relative
                        ${
                          isCompleted
                            ? 'bg-green-500 border-green-600 text-white shadow-lg'
                            : isCurrent
                            ? 'bg-yellow-400 border-yellow-500 text-black shadow-lg animate-pulse'
                            : isLocked
                            ? 'bg-gray-300 border-gray-400 text-gray-500'
                            : 'bg-blue-400 border-blue-500 text-white'
                        }
                      `}
                      title={chapterName}
                    >
                      {isCompleted ? '✓' : i + 1}
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Chapter Names */}
              <div className="mb-4 space-y-1">
                {currentBimestre.chapters.map((chapterName, i) => {
                   const isCompleted = chapterProgress[chapterName]?.completed || false
                   const isCurrent = chapterName === chapter
                  
                  return (
                    <div
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        isCompleted
                          ? 'bg-green-100 text-green-800'
                          : isCurrent
                          ? 'bg-yellow-100 text-yellow-800 font-bold'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {i + 1}. {chapterName}
                    </div>
                  )
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="bg-gray-300 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-yellow-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Current Mission Info */}
              <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-600">
                <h4 className="font-bold text-amber-800 mb-1">Misión Actual:</h4>
                <p className="text-sm text-amber-700">{chapter || 'Selecciona un capítulo'}</p>
                <div className="flex items-center mt-2">
                  <div className="text-xs text-amber-600">
                    Progreso: {completedMissions}/{totalMissions} misiones
                  </div>
                  <div className="ml-auto text-yellow-600">⭐ {totalScore} pts</div>
                </div>
                {isCurrentChapterCompleted && (
                  <div className="mt-2 text-xs text-green-600 font-bold">
                    ✓ Capítulo completado: {chapterProgress[chapter]?.score}/{chapterProgress[chapter]?.totalQuestions} respuestas correctas
                  </div>
                )}
              </div>
              
              {/* Rewards Preview */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-yellow-200 border border-yellow-400 rounded p-2 text-center">
                  <div className="text-lg">🏆</div>
                  <div className="text-xs text-yellow-700">Trofeo</div>
                </div>
                <div className="bg-blue-200 border border-blue-400 rounded p-2 text-center">
                  <div className="text-lg">💎</div>
                  <div className="text-xs text-blue-700">Gema</div>
                </div>
                <div className="bg-purple-200 border border-purple-400 rounded p-2 text-center">
                  <div className="text-lg">🎖️</div>
                  <div className="text-xs text-purple-700">Medalla</div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Moved below Mission Board */}
            <div className="space-y-4 w-80">
              {!isCurrentChapterCompleted ? (
                <Button
                  onClick={onStartGame}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-2xl px-12 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 w-full"
                >
                  JUGAR
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={onStartGame}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🔄 REPETIR CAPÍTULO
                  </Button>
                  {nextChapter && (
                    <Button
                      onClick={() => onSelectChapter(nextChapter)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
                    >
                      ➡️ SIGUIENTE CAPÍTULO
                    </Button>
                  )}
                </div>
              )}

              <Button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-2 rounded-lg w-full"
              >
                VOLVER
              </Button>
            </div>
          </div>

          {/* Right Side - World Map */}
          <div className="flex-shrink-0 space-y-4">
            <div className="bg-gray-700/80 text-white px-4 py-2 rounded-lg font-bold text-center">
              MAPA DEL MUNDO ANTIGUO
            </div>
            <div className="w-[600px] h-[500px]">
              <WorldMap currentChapter={chapter} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameQuestions({ onBack, chapter, onComplete }: { 
  onBack: () => void; 
  chapter: string;
  onComplete: (score: number, totalQuestions: number) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const questions = {
    Mesopotamia: [
      {
        question: "¿QUÉ CIVILIZACIÓN MESOPOTÁMICA ES RECONOCIDA POR DESARROLLAR LA ESCRITURA CUNEIFORME?",
        options: ["SUMERIOS", "EGIPCIOS", "ROMANOS"],
        correct: 0,
      },
      {
        question: "¿CUÁL ERA LA CARACTERÍSTICA PRINCIPAL DE LA RELIGIÓN EN MESOPOTAMIA?",
        options: ["MONOTEÍSTA", "POLITEÍSTA", "ATEÍSTA (NO CREÍAN EN DIOSES)"],
        correct: 1,
      },
      {
        question: "¿QUÉ APORTES IMPORTANTES HIZO MESOPOTAMIA A LA HUMANIDAD?",
        options: ["LA BRÚJULA Y EL PAPEL MONEDA", "EL CÓDIGO DE HAMMURABI Y LA ESCRITURA CUNEIFORME", "EL CALENDARIO SOLAR Y LA IMPRENTA"],
        correct: 1,
      },
    ],
    Egipto: [
      {
        question: "¿CUÁL ES LA TUMBA MÁS VALIOSA DE EGIPTO?",
        options: ["Tutankamón", "Cleopatra", "Ramsés II"],
        correct: 0,
      },
      {
        question: "¿CUÁL FUE LA FUNCIÓN PRINCIPAL DE LAS PIRÁMIDES EGIPCIAS?",
        options: ["ALBERGAR TEMPLOS PARA CEREMONIAS RELIGIOSAS", "SERVIR COMO TUMBAS PARA FARAONES", "SER OBSERVATORIOS ASTRONÓMICOS", "RESIDENCIAS PARA LA NOBLEZA"],
        correct: 1,
      },
      {
        question: "¿QUÉ RÍO FUE VITAL PARA EL DESARROLLO DE LA CIVILIZACIÓN EGIPCIA?",
        options: ["RÍO AMAZONAS", "RÍO TIGRIS", "RÍO NILO", "RÍO YANGTSÉ"],
        correct: 2,
      },
    ],
    Esparta: [
      {
        question: "¿CUÁL ERA EL ENFOQUE PRINCIPAL DE LA EDUCACIÓN ESPARTANA?",
        options: ["FILOSOFÍA Y LITERATURA", "AGRICULTURA Y COMERCIO", "DISCIPLINA MILITAR Y OBEDIENCIA", "ARQUITECTURA Y ARTESANÍA"],
        correct: 2,
      },
      {
        question: "¿QUÉ GRUPO GOBERNABA ESPARTA JUNTO CON LOS REYES?",
        options: ["EL SENADO", "LOS ÉFOROS", "LOS TRIBUNOS", "LA ASAMBLEA POPULAR"],
        correct: 1,
      },
      {
        question: "¿POR QUÉ ESPARTA EVITABA EL USO DE MONEDAS DE ORO Y PLATA?",
        options: ["PARA PROMOVER EL COMERCIO EXTERIOR", "PORQUE NO TENÍAN MINAS DE METALES PRECIOSOS", "PARA DESALENTAR LA ACUMULACIÓN DE RIQUEZA", "PORQUE ERAN DIFÍCILES DE TRANSPORTAR"],
        correct: 2,
      },
    ],
    Atenas: [
      {
        question: "¿QUÉ SISTEMA POLÍTICO SE ORIGINÓ EN LA ANTIGUA ATENAS?",
        options: ["MONARQUÍA ABSOLUTA", "DEMOCRACIA DIRECTA", "OLIGARQUÍA MILITAR", "TEOCRACIA CENTRALIZADA"],
        correct: 1,
      },
      {
        question: "¿QUÉ FILÓSOFO ATENIENSE FUE CONDENADO A MUERTE POR CUESTIONAR LAS CREENCIAS ESTABLECIDAS?",
        options: ["PLATÓN", "ARISTÓTELES", "SÓCRATES", "PERICLES"],
        correct: 2,
      },
      {
        question: "¿QUÉ TIPO DE ESPECTÁCULOS SE REALIZABAN EN EL TEATRO ATENIENSE?",
        options: ["BATALLAS CON GLADIADORES", "OBRAS DRAMÁTICAS Y COMEDIAS", "RITUALES RELIGIOSOS SECRETOS", "COMPETICIONES DEPORTIVAS"],
        correct: 1,
      },
    ],
    "La Migración": [
      {
        question: "¿CUÁL DE LOS SIGUIENTES ES UN FACTOR DE EMPUJE COMÚN QUE MOTIVA LA MIGRACIÓN?",
        options: ["MEJORES OPORTUNIDADES EDUCATIVAS", "CONFLICTOS ARMADOS O PERSECUCIÓN", "CLIMA FAVORABLE", "REUNIFICACIÓN FAMILIAR"],
        correct: 1,
      },
      {
        question: "¿QUÉ TÉRMINO SE USA PARA DESCRIBIR LA MIGRACIÓN DENTRO DE UN MISMO PAÍS?",
        options: ["MIGRACIÓN INTERNACIONAL", "MIGRACIÓN FORZADA", "MIGRACIÓN INTERNA", "DIÁSPORA"],
        correct: 2,
      },
      {
        question: "¿CUÁL DE LOS SIGUIENTES EFECTOS POSITIVOS PUEDE TENER LA MIGRACIÓN EN EL PAÍS RECEPTOR?",
        options: ["SATURACIÓN DE SERVICIOS PÚBLICOS", "PÉRDIDA DE IDENTIDAD CULTURAL", "AUMENTO DE LA DIVERSIDAD CULTURAL Y LABORAL", "TENSIÓN POLÍTICA"],
        correct: 2,
      },
    ],
  }

  const currentQuestions = questions[chapter as keyof typeof questions] || questions["Mesopotamia"]
  const currentQ = currentQuestions[currentQuestion]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQ.correct) {
      setScore(score + 1)
    }

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
  }

  if (showResult) {
    const minimumScore = Math.ceil(currentQuestions.length * 0.6)
    const passed = score >= minimumScore
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 flex items-center justify-center p-6">
        <div className="bg-amber-100 border-4 border-amber-700 rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">
            {passed ? "¡Quiz Completado!" : "¡No te rindas!"}
          </h2>
          <div className="text-6xl mb-4">
            {passed 
              ? (score >= currentQuestions.length * 0.8 ? "🏆" : "⭐")
              : "💪"
            }
          </div>
          <p className="text-xl text-amber-800 mb-6">
            Puntuación: {score}/{currentQuestions.length}
          </p>
          <p className="text-lg text-amber-700 mb-8">
            {passed
              ? (score >= currentQuestions.length * 0.8
                  ? "¡Excelente! Dominas el tema."
                  : "¡Bien hecho! Sigue estudiando.")
              : `¡Vuelve a intentarlo! Necesitas al menos ${minimumScore} respuestas correctas para continuar. ¡Tú puedes lograrlo!`
            }
          </p>
          <div className="flex gap-4">
            <Button
              onClick={resetQuiz}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold py-3"
            >
              {passed ? "REINTENTAR" : "VOLVER A INTENTAR"}
            </Button>
            {passed && (
              <Button 
                onClick={() => {
                  onComplete(score, currentQuestions.length)
                }} 
                className="flex-1 bg-green-700 hover:bg-green-600 text-amber-100 font-bold py-3"
              >
                CONTINUAR
              </Button>
            )}
            <Button onClick={onBack} className="flex-1 bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold py-3">
              SALIR
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-6">
      {/* Header */}
      <div className="bg-amber-900 border-4 border-amber-700 rounded-lg mb-6 p-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-100">{chapter}</h1>
          <div className="text-amber-100">
            Pregunta {currentQuestion + 1} de {currentQuestions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-amber-700 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-yellow-400 h-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-amber-100 border-4 border-amber-700 rounded-lg p-8 max-w-4xl mx-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-900 mb-8 text-center">{currentQ.question}</h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 rounded-lg border-2 font-semibold text-left transition-all duration-200 ${
                selectedAnswer === index
                  ? "bg-amber-600 border-amber-700 text-amber-100 shadow-lg"
                  : "bg-amber-200 border-amber-400 text-amber-800 hover:bg-amber-300 hover:border-amber-500"
              }`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button onClick={onBack} className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-3">
            SALIR
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion < currentQuestions.length - 1 ? "SIGUIENTE" : "FINALIZAR"}
          </Button>
        </div>
      </div>
    </div>
  )
}
