"use client"

import { Button } from "@/components/ui/button"
import { useMemo, useState, useEffect } from "react"
import WorldMap from "@/components/WorldMap"

// Tipos y configuración de niveles de dificultad
type Level = "elementary" | "lower" | "upper" | "high"

const difficultyConfig: Record<Level, {
  passRatio: number
  scorePerCorrect: number
  optionsLimit?: number
  shuffleOptions: boolean
}> = {
  elementary: { passRatio: 0.6, scorePerCorrect: 50, optionsLimit: undefined, shuffleOptions: false },
  lower: { passRatio: 0.6, scorePerCorrect: 50, optionsLimit: 3, shuffleOptions: true },
  upper: { passRatio: 0.7, scorePerCorrect: 60, optionsLimit: 4, shuffleOptions: true },
  high: { passRatio: 0.8, scorePerCorrect: 70, optionsLimit: 4, shuffleOptions: true },
}

type CourseId = "matematica" | "comunicacion" | "historia" | "ciencia"

const bimestreToCourse: Record<number, CourseId> = {
  1: "matematica",
  2: "historia", // Mantener Historia con sus preguntas reales
  3: "comunicacion",
  4: "ciencia",
}

const courseConfig: Record<CourseId, {
  name: string
  icon: string
  themeColor: string
  supportedLevels: Level[]
  description?: string
}> = {
  matematica: { name: "Matemática", icon: "📐", themeColor: "#10b981", supportedLevels: ["elementary", "lower", "upper", "high"] },
  comunicacion: { name: "Comunicación", icon: "✏️", themeColor: "#f59e0b", supportedLevels: ["elementary", "lower", "upper", "high"] },
  historia: { name: "Historia", icon: "📜", themeColor: "#8b5cf6", supportedLevels: ["elementary", "lower", "upper", "high"] },
  ciencia: { name: "Ciencia", icon: "🧪", themeColor: "#06b6d4", supportedLevels: ["elementary", "lower", "upper", "high"] },
}

// Temas sugeridos por curso (para alinear pestañas posteriormente)
const courseThemes: Record<CourseId, string[]> = {
  matematica: ["Numeración", "Sumas y restas", "Figuras geométricas", "Patrones"],
  comunicacion: ["Comprensión lectora", "Ortografía", "Sinónimos y antónimos", "Mayúsculas y puntuación"],
  historia: [], // Historia mantiene sus capítulos actuales más abajo
  ciencia: ["Ecosistemas", "Estados de la materia", "Cuerpo humano", "Energía y fuentes"],
}

type DifficultyRule = {
  passRatio: number
  scorePerCorrect: number
  optionsLimit?: number
  shuffleOptions: boolean
}

const difficultyByCourse: Partial<Record<CourseId, Partial<Record<Level, Partial<DifficultyRule>>>>> = {}

type Question = { question: string; options: string[]; correct: number }

const questionsByCourse: Record<CourseId, Record<string, Question[]>> = {
  matematica: {
    "Numeración": [
      { question: "¿Qué valor tiene el 5 en 352?", options: ["Cientos", "Decenas", "Unidades"], correct: 1 },
      { question: "¿Cuál es el número que sigue a 299?", options: ["300", "301", "298"], correct: 0 },
    ],
    "Sumas y restas": [
      { question: "7 + 6 =", options: ["11", "12", "13"], correct: 2 },
      { question: "15 − 9 =", options: ["6", "5", "7"], correct: 0 },
    ],
    "Figuras geométricas": [
      { question: "¿Cuántos lados tiene un triángulo?", options: ["3", "4", "5"], correct: 0 },
      { question: "¿Cuál es una figura con cuatro lados iguales?", options: ["Rectángulo", "Cuadrado", "Pentágono"], correct: 1 },
    ],
    "Patrones": [
      { question: "¿Qué sigue? 2, 4, 6, __", options: ["7", "8", "9"], correct: 1 },
      { question: "¿Qué sigue? ▲, ●, ▲, ●, __", options: ["▲", "■", "●"], correct: 0 },
    ],
  },
  comunicacion: {
    "Comprensión lectora": [
      { question: "\"El gato se escondió porque tenía miedo.\" ¿Por qué se escondió?", options: ["Porque tenía hambre", "Porque tenía miedo", "Porque quería jugar"], correct: 1 },
      { question: "¿Quién es el personaje?", options: ["Un perro", "Un gato", "Un ratón"], correct: 1 },
    ],
    "Ortografía": [
      { question: "Elige la correcta: \"B__olador\"", options: ["B", "V", "C"], correct: 0 },
      { question: "Elige la correcta: \"Ca__a\" (lugar de pesca)", options: ["S", "Z", "C"], correct: 2 },
    ],
    "Sinónimos y antónimos": [
      { question: "Sinónimo de \"feliz\"", options: ["Contento", "Triste", "Enojado"], correct: 0 },
      { question: "Antónimo de \"alto\"", options: ["Grande", "Pequeño", "Largo"], correct: 1 },
    ],
    "Mayúsculas y puntuación": [
      { question: "¿Dónde va mayúscula? \"__ima vez fui al parque.\"", options: ["Últ", "Última", "última"], correct: 1 },
      { question: "¿Qué signo falta? \"¿Cómo estás__\"", options: ["!", "?", "."], correct: 1 },
    ],
  },
  historia: {
    // Historia usa el banco actual definido más abajo en GameQuestions (Mesopotamia, Egipto, etc.)
  },
  ciencia: {
    "Ecosistemas": [
      { question: "¿Cuál es un ecosistema?", options: ["Desierto", "Casa", "Auto"], correct: 0 },
      { question: "¿Qué necesitan las plantas?", options: ["Luz y agua", "Azúcar y sal", "Metal y plástico"], correct: 0 },
    ],
    "Estados de la materia": [
      { question: "¿Qué estado es el agua del mar?", options: ["Sólido", "Líquido", "Gas"], correct: 1 },
      { question: "El vapor es agua en estado", options: ["Sólido", "Líquido", "Gaseoso"], correct: 2 },
    ],
    "Cuerpo humano": [
      { question: "¿Qué órgano bombea la sangre?", options: ["Pulmones", "Estómago", "Corazón"], correct: 2 },
      { question: "¿Para qué sirven los pulmones?", options: ["Para respirar", "Para comer", "Para pensar"], correct: 0 },
    ],
    "Energía y fuentes": [
      { question: "¿Cuál es una fuente renovable?", options: ["Petróleo", "Carbón", "Sol"], correct: 2 },
      { question: "¿Qué usamos para encender focos?", options: ["Electricidad", "Agua", "Aire"], correct: 0 },
    ],
  },
}


export default function GameMenu() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "chapters" | "lobby" | "questions" | "chapter-complete" | "bimestre-complete">("menu")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [chapterProgress, setChapterProgress] = useState<{[key: string]: {completed: boolean, score: number, totalQuestions: number}}>({})
  const [totalScore, setTotalScore] = useState(0)
  const [completedBimestre, setCompletedBimestre] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [nextChapter, setNextChapter] = useState<string | null>(null)
  const [lastCompletedChapter, setLastCompletedChapter] = useState<string | null>(null)

  if (currentScreen === "questions") {
    const effectiveLevel: Level = selectedLevel ?? "elementary"
    return (
      <GameQuestions 
        onBack={() => setCurrentScreen("lobby")} 
        chapter={selectedChapter}
        selectedLevel={effectiveLevel}
        onComplete={(score: number, totalQuestions: number) => {
          const { passRatio, scorePerCorrect } = difficultyConfig[effectiveLevel]
          const minimumScore = Math.ceil(totalQuestions * passRatio) 
          
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
          setTotalScore(prev => prev + score * scorePerCorrect)
          
          // Verificar bimestre y determinar siguiente capítulo usando el modelo dinámico por curso
          const bimestres: Record<number, string[]> = {
            1: courseThemes.matematica,
            2: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"], // Historia intacta
            3: courseThemes.comunicacion,
            4: courseThemes.ciencia,
          }

          for (const [bimestreNumStr, chapters] of Object.entries(bimestres)) {
            if (chapters.includes(selectedChapter)) {
              const bimestreNum = parseInt(bimestreNumStr)
              const allCompleted = chapters.every(ch => newProgress[ch]?.completed)
              if (allCompleted) {
                setCompletedBimestre(bimestreNum)
                setCurrentScreen("bimestre-complete")
                return
              }

              const idx = chapters.indexOf(selectedChapter)
              const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null
              setNextChapter(next)
              setLastCompletedChapter(selectedChapter)
              if (next) {
                setSelectedChapter(next)
              }
              setCurrentScreen("chapter-complete")
              return
            }
          }

          // Si no se encontró el bimestre (caso excepcional), regresar al lobby
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

  if (currentScreen === "chapter-complete") {
    return (
      <ChapterComplete
        current={lastCompletedChapter ?? ""}
        next={nextChapter}
        onContinueNext={() => {
          setCurrentScreen("questions")
          setLastCompletedChapter(null)
        }}
        onBackToLobby={() => {
          setCurrentScreen("lobby")
          setNextChapter(null)
          setLastCompletedChapter(null)
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
        selectedLevel={selectedLevel}
      />
    )
  }

  if (currentScreen === "chapters") {
    return (
      <ChapterSelection
        onBack={() => setCurrentScreen("menu")}
        selectedLevel={selectedLevel}
        onSelectLevel={(lvl) => setSelectedLevel(lvl)}
        onContinue={(chapter) => {
          setSelectedChapter(chapter)
          setCurrentScreen("lobby")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen relative overflow-auto bg-gradient-to-b from-[var(--brand-light)] via-[var(--brand-secondary)] to-[var(--brand-light)]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: "url('/images/ancient-temple-background.png')",
        }}
      />

      {/* Overlay más claro para evitar sensación de fondo negro */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-light)]/60 via-[var(--brand-accent)]/40 to-[var(--brand-light)]/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-8 pt-10">
        {/* Title dentro de un panel amarillo con borde lila */}
        <div className="bg-[var(--brand-accent)] border-4 border-[var(--brand-primary)] rounded-xl px-6 py-4 shadow-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider text-center text-[var(--brand-dark)]">
            APRENDE JUGANDO
          </h1>
        </div>

        {/* Logo debajo del título */}
        <div className="mt-4">
          <img
            src="/images/EduPlay.png"
            alt="EDU PLAY Logo"
            className="w-[80vw] max-w-[28rem] md:max-w-[24rem] lg:max-w-[28rem] h-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
          <Button
            className="h-14 text-xl font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white border-2 border-[var(--brand-accent)] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => setCurrentScreen("chapters")}
          >
            PLAY
          </Button>

          <Button
            className="h-14 text-xl font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white border-2 border-[var(--brand-accent)] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => console.log("Configuration clicked")}
          >
            CONFIGURATION
          </Button>

          <Button
            className="h-14 text-xl font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white border-2 border-[var(--brand-accent)] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => console.log("Exit clicked")}
          >
            EXIT
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChapterComplete({ current, next, onContinueNext, onBackToLobby }: {
  current: string
  next: string | null
  onContinueNext: () => void
  onBackToLobby: () => void
}) {
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [seconds, setSeconds] = useState(3)

  useEffect(() => {
    if (!next || !autoAdvance) return
    if (seconds <= 0) {
      onContinueNext()
      return
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [next, autoAdvance, seconds])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-light)] via-[var(--brand-accent)] to-[var(--brand-light)] flex items-center justify-center p-6">
      <div className="bg-[var(--brand-light)] border-4 border-[var(--brand-accent)] rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-[var(--brand-dark)] mb-4">¡Felicitaciones!</h2>
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-lg text-[var(--brand-primary)] mb-2">Has completado: <span className="font-bold">{current}</span></p>
        {next ? (
          <p className="text-lg text-[var(--brand-primary)] mb-6">Siguiente capítulo: <span className="font-bold">{next}</span></p>
        ) : (
          <p className="text-lg text-[var(--brand-primary)] mb-6">Continúa con más capítulos desde el lobby.</p>
        )}
        {next && autoAdvance && (
          <div className="text-sm text-[var(--brand-primary)] mb-4">Avanzando automáticamente en {seconds}s...</div>
        )}
        <div className="flex gap-4">
          {next && (
            <Button
              onClick={onContinueNext}
              className="flex-1 bg-[var(--brand-secondary)] hover:bg-[var(--brand-primary)] text-white font-bold py-3"
            >
              SEGUIR AL SIGUIENTE CAPÍTULO
            </Button>
          )}
          <Button
            onClick={onBackToLobby}
            className="flex-1 bg-[var(--brand-dark)] hover:bg-[var(--brand-primary)] text-[var(--brand-light)] font-bold py-3"
          >
            VOLVER AL LOBBY
          </Button>
        </div>
        {next && (
          <div className="mt-4">
            <Button
              onClick={() => setAutoAdvance(false)}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-light)] font-bold px-6 py-2"
            >
              CANCELAR AUTO-AVANCE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ChapterSelection({ onBack, onContinue, selectedLevel, onSelectLevel }: { onBack: () => void; onContinue: (chapter: string) => void; selectedLevel: Level | null; onSelectLevel: (level: Level | null) => void }) {
  // Bimestres dinámicos por curso; Historia se mantiene con sus capítulos reales
  const [expandedBimestre, setExpandedBimestre] = useState<number | null>(1)
  const [selectedChapter, setSelectedChapter] = useState("")

  const bimestres = {
    1: {
      title: "BIMESTRE I",
      chapters: courseThemes.matematica,
    },
    2: {
      title: "BIMESTRE II",
      chapters: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"],
    },
    3: {
      title: "BIMESTRE III",
      chapters: courseThemes.comunicacion,
    },
    4: {
      title: "BIMESTRE IV",
      chapters: courseThemes.ciencia,
    },
  }

  // Etiquetas visibles: mostrar cursos en los botones de bimestres (derivados del mapping)
  const courseNames: Record<number, string> = Object.fromEntries(
    Object.keys(bimestres).map((n) => {
      const num = Number(n)
      const course = bimestreToCourse[num]
      return [num, courseConfig[course].name]
    })
  ) as Record<number, string>

  // Íconos referenciales por curso
  const courseIcons: Record<number, string> = Object.fromEntries(
    Object.keys(bimestres).map((n) => {
      const num = Number(n)
      const course = bimestreToCourse[num]
      return [num, courseConfig[course].icon]
    })
  ) as Record<number, string>

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
    <div
      className="min-h-screen relative p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/clean-desert-background.jpg')" }}
    >
      {/* Overlay suave para mejorar legibilidad sobre la imagen */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-light)]/70 via-[var(--brand-accent)]/60 to-[var(--brand-light)]/70" />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-[var(--brand-primary)] border-4 border-[var(--brand-accent)] rounded-lg mb-6 p-4 shadow-2xl">
        <h1 className="text-4xl font-bold text-[var(--brand-light)] text-center tracking-wider">SELECCION DE CURSOS</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-[var(--brand-light)] border-4 border-[var(--brand-accent)] rounded-lg p-4 shadow-2xl">
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
                      onSelectLevel(null) // exigir re-selección de nivel por capítulo
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-between ${
                    expandedBimestre === Number(bimestreNum)
                      ? "bg-[var(--brand-secondary)] text-[var(--brand-light)] shadow-lg"
                      : "bg-[var(--brand-primary)]/70 text-[var(--brand-light)]/80 hover:bg-[var(--brand-secondary)]/80 hover:text-[var(--brand-light)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{courseIcons[Number(bimestreNum)]}</span>
                    <span>{courseNames[Number(bimestreNum)]}</span>
                  </span>
                  <span className="text-xl">{expandedBimestre === Number(bimestreNum) ? "−" : "+"}</span>
                </button>

                {expandedBimestre === Number(bimestreNum) && (
                  <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {bimestre.chapters.map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => { setSelectedChapter(chapter); onSelectLevel(null) }}
                        className={`w-full text-left p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedChapter === chapter
                            ? "bg-[var(--brand-secondary)] text-[var(--brand-light)] shadow-md"
                            : "bg-[var(--brand-primary)]/70 text-[var(--brand-light)]/90 hover:bg-[var(--brand-secondary)]/80 hover:text-[var(--brand-light)]"
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
        <div className="flex-1 bg-[var(--brand-light)] border-4 border-[var(--brand-accent)] rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-[var(--brand-dark)] mb-6 text-center">{selectedChapter || "Selecciona un capítulo"}</h2>

          <div className="text-[var(--brand-primary)] text-lg leading-relaxed mb-8 font-medium">
            {selectedChapter && chapterContent[selectedChapter as keyof typeof chapterContent]}
          </div>

          {/* Selector de Nivel */}
          <div className="mb-8">
            <div className="text-center mb-4 font-bold text-[var(--brand-dark)]">Selecciona nivel</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { key: "elementary", label: "Elemental", icon: "🎈" },
                { key: "lower", label: "Bajo", icon: "⬇️" },
                { key: "upper", label: "Medio", icon: "⬆️" },
                { key: "high", label: "Alto", icon: "🎓" },
              ] as { key: Level; label: string; icon: string }[]).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => onSelectLevel(key)}
                  title={`Nivel ${label}`}
                  aria-label={`Seleccionar nivel ${label}`}
                  className={`px-4 py-3 rounded-lg border-2 font-bold transition-all duration-200 flex items-center gap-2 ${
                    selectedLevel === key
                      ? "bg-[var(--brand-secondary)] border-[var(--brand-primary)] text-white shadow-lg"
                      : "bg-[var(--brand-light)] border-[var(--brand-secondary)] text-[var(--brand-dark)] hover:bg-[var(--brand-accent)]/30"
                  }`}
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--brand-accent)]/30 border border-[var(--brand-primary)] text-base">
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {!selectedLevel && (
              <div className="mt-2 text-center text-sm text-[var(--brand-primary)]">Selecciona un nivel para continuar</div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              className="px-8 py-3 text-lg font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-light)] border-2 border-[var(--brand-secondary)] shadow-lg transition-all duration-200 hover:scale-105"
            >
              VOLVER
            </Button>

            <Button
              onClick={() => onContinue(selectedChapter)}
              disabled={!selectedChapter || !selectedLevel}
              className="px-8 py-3 text-lg font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-light)] border-2 border-[var(--brand-secondary)] shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUAR
            </Button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-light)] via-[var(--brand-accent)] to-[var(--brand-light)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[var(--brand-accent)]/70 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="bg-gradient-to-br from-[var(--brand-light)] to-[var(--brand-accent)] border-8 border-[var(--brand-accent)] rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl relative z-10">
        {/* Título de celebración */}
        <div className="text-6xl mb-6 animate-bounce">
          🎉🏆🎊
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--brand-primary)] mb-4 animate-pulse">
          ¡FELICITACIONES!
        </h1>
        
        <h2 className="text-2xl font-bold text-[var(--brand-dark)] mb-6">
          ¡HAS COMPLETADO EL {bimestreNames[bimestre as keyof typeof bimestreNames]}!
        </h2>

        {/* Mensaje motivacional */}
        <div className="bg-white/80 rounded-2xl p-6 mb-6 border-4 border-[var(--brand-accent)]">
          <p className="text-lg text-gray-800 mb-4 leading-relaxed">
            {motivationalMessages[bimestre as keyof typeof motivationalMessages]}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-[var(--brand-accent)] rounded-full px-4 py-2 font-bold text-[var(--brand-primary)]">
              ⭐ {totalScore} PUNTOS TOTALES
            </div>
            <div className="text-4xl animate-spin">
              🎯
            </div>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="bg-gradient-to-r from-[var(--brand-light)] to-[var(--brand-accent)] rounded-2xl p-6 mb-6 border-4 border-[var(--brand-accent)]">
          <h3 className="text-xl font-bold text-[var(--brand-dark)] mb-3">
            👑 ¡EXCELENTE TRABAJO!
          </h3>
          <p className="text-lg text-[var(--brand-primary)]">
            Has completado el {bimestreNames[bimestre as keyof typeof bimestreNames]}. ¡Sigue así!
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onBackToMenu}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
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

// Panel visual por curso para reemplazar el mapa en cursos no Historia
function CoursePanel({ course, chapter }: { course: CourseId; chapter: string }) {
  const config = courseConfig[course]
  const headerStyle = { backgroundColor: `${config.themeColor}20`, borderColor: config.themeColor }

  return (
    <div className="w-full max-w-[600px] h-[65vh] sm:h-[60vh] md:h-[500px] min-h-[320px] bg-white/80 border-4 rounded-xl shadow-xl overflow-hidden flex flex-col" style={{ borderColor: config.themeColor }}>
      <div className="px-4 py-2 font-bold text-[var(--brand-dark)] border-b" style={headerStyle as any}>
        {config.icon} Panel de {config.name}
        <span className="ml-2 text-sm text-gray-600">Tema actual: {chapter}</span>
      </div>
      <div className="p-6 flex-1 grid place-items-center text-center">
        {course === "matematica" && (
          <div>
            <div className="text-6xl mb-4">📐🔢⬛️🔺🟦</div>
            <div className="text-[var(--brand-primary)] font-bold mb-2">Figuras, patrones y operaciones</div>
            <p className="text-sm text-gray-700">Explora {chapter} con retos visuales y prácticos.</p>
          </div>
        )}
        {course === "comunicacion" && (
          <div>
            <div className="text-6xl mb-4">📖✍️🔤</div>
            <div className="text-[var(--brand-primary)] font-bold mb-2">Lectura, ortografía y vocabulario</div>
            <p className="text-sm text-gray-700">Practica {chapter} con ejemplos claros y divertidos.</p>
          </div>
        )}
        {course === "ciencia" && (
          <div>
            <div className="text-6xl mb-4">🧪🌿💧🔥</div>
            <div className="text-[var(--brand-primary)] font-bold mb-2">Experimentos y observaciones</div>
            <p className="text-sm text-gray-700">Descubre {chapter} con ilustraciones y conceptos clave.</p>
          </div>
        )}
        {course === "historia" && (
          <div>
            <div className="text-6xl mb-4">📜🗺️🏛️</div>
            <div className="text-[var(--brand-primary)] font-bold mb-2">Historia</div>
            <p className="text-sm text-gray-700">Usa el mapa cuando estés en capítulos históricos.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GameLobby({ onBack, chapter, onStartGame, chapterProgress, totalScore, onSelectChapter, selectedLevel }: { 
  onBack: () => void; 
  chapter: string; 
  onStartGame: () => void;
  chapterProgress: {[key: string]: {completed: boolean, score: number, totalQuestions: number}};
  totalScore: number;
  onSelectChapter: (chapter: string) => void;
  selectedLevel: Level | null;
}) {
  // Bimestres dinámicos por curso; Historia se mantiene con sus capítulos reales
  const bimestres = {
    1: {
      title: "BIMESTRE I",
      chapters: courseThemes.matematica,
    },
    2: {
      title: "BIMESTRE II", 
      chapters: ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"],
    },
    3: {
      title: "BIMESTRE III",
      chapters: courseThemes.comunicacion,
    },
    4: {
      title: "BIMESTRE IV",
      chapters: courseThemes.ciencia,
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
  const historyChapters = ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"]
  const isHistoriaChapter = historyChapters.includes(chapter)
  const courseId = bimestreToCourse[currentBimestre.number as keyof typeof bimestreToCourse]
  
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
    <div className="min-h-screen relative overflow-auto">
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
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-7xl mx-auto">
          {/* Left Side - Mission Board and Action Buttons */}
          <div className="space-y-6 flex-shrink-0">
            <div className="bg-gray-700/80 text-white px-4 py-2 rounded-lg font-bold text-center">
              TABLERO DE MISIONES - {currentBimestre.title}
            </div>
            
            {/* Mission Board Game */}
            <div className="bg-[var(--brand-light)]/90 border-4 border-[var(--brand-secondary)] rounded-lg p-6 w-80 shadow-2xl">
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
                            ? 'bg-[var(--brand-accent)] border-[var(--brand-secondary)] text-black shadow-lg animate-pulse'
                          : isLocked
                            ? 'bg-gray-300 border-gray-400 text-gray-500'
                            : 'bg-[var(--brand-secondary)] border-[var(--brand-primary)] text-white'
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
                          ? 'bg-[var(--brand-light)] text-[var(--brand-dark)] font-bold'
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
                  className="bg-gradient-to-r from-[var(--brand-secondary)] to-[var(--brand-accent)] h-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Current Mission Info */}
              <div className="bg-white/80 rounded-lg p-3 border-2 border-[var(--brand-secondary)]">
                <h4 className="font-bold text-[var(--brand-primary)] mb-1">Misión Actual:</h4>
                <p className="text-sm text-[var(--brand-primary)]">{chapter || 'Selecciona un capítulo'}</p>
                <div className="flex items-center mt-2">
                  <div className="text-xs text-[var(--brand-secondary)]">
                    Progreso: {completedMissions}/{totalMissions} misiones
                  </div>
                  <div className="ml-auto text-[var(--brand-accent)]">⭐ {totalScore} pts</div>
                </div>
                <div className="mt-2 text-xs text-[var(--brand-primary)]">
                  Nivel seleccionado: <span className="font-bold">{selectedLevel ? ({ elementary: "Elemental", lower: "Bajo", upper: "Medio", high: "Alto" } as Record<Level, string>)[selectedLevel] : "No seleccionado"}</span>
                </div>
                {isCurrentChapterCompleted && (
                  <div className="mt-2 text-xs text-green-600 font-bold">
                    ✓ Capítulo completado: {chapterProgress[chapter]?.score}/{chapterProgress[chapter]?.totalQuestions} respuestas correctas
                  </div>
                )}
              </div>
              
              {/* Rewards Preview */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-[var(--brand-accent)]/40 border border-[var(--brand-accent)] rounded p-2 text-center">
                  <div className="text-lg">🏆</div>
                  <div className="text-xs text-[var(--brand-dark)]">Trofeo</div>
                </div>
                <div className="bg-[var(--brand-secondary)]/40 border border-[var(--brand-secondary)] rounded p-2 text-center">
                  <div className="text-lg">💎</div>
                  <div className="text-xs text-[var(--brand-dark)]">Gema</div>
                </div>
                <div className="bg-[var(--brand-primary)]/40 border border-[var(--brand-primary)] rounded p-2 text-center">
                  <div className="text-lg">🎖️</div>
                  <div className="text-xs text-[var(--brand-dark)]">Medalla</div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Moved below Mission Board */}
            <div className="space-y-4 w-80">
              {!isCurrentChapterCompleted ? (
                <Button
                  onClick={onStartGame}
                  className="bg-[var(--brand-accent)] hover:bg-[var(--brand-secondary)] text-black hover:text-white font-bold text-2xl px-12 py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 w-full"
                >
                  JUGAR
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={onStartGame}
                    className="w-full bg-gradient-to-r from-[var(--brand-secondary)] to-[var(--brand-primary)] hover:from-[var(--brand-primary)] hover:to-[var(--brand-primary)] text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🔄 REPETIR CAPÍTULO
                  </Button>
                  {nextChapter && (
                    <Button
                      onClick={() => onSelectChapter(nextChapter)}
                      className="w-full bg-gradient-to-r from-[var(--brand-secondary)] to-[var(--brand-primary)] hover:from-[var(--brand-primary)] hover:to-[var(--brand-primary)] text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
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

          {/* Right Side - Visual Panel / World Map */}
          <div className="flex-shrink-0 space-y-4">
            <div className="bg-gray-700/80 text-white px-4 py-2 rounded-lg font-bold text-center">
              {isHistoriaChapter ? (
                <>MAPA DEL MUNDO ANTIGUO</>
              ) : (
                <>
                  {courseConfig[courseId].icon} Panel de {courseConfig[courseId].name}
                </>
              )}
            </div>
            <div className="w-full max-w-[600px] h-[65vh] sm:h-[60vh] md:h-[500px] min-h-[320px]">
              {isHistoriaChapter ? (
                <WorldMap currentChapter={chapter} />
              ) : (
                <CoursePanel course={courseId} chapter={chapter} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameQuestions({ onBack, chapter, onComplete, selectedLevel }: { 
  onBack: () => void; 
  chapter: string;
  onComplete: (score: number, totalQuestions: number) => void;
  selectedLevel: Level;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const levelConfig = difficultyConfig[selectedLevel]

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

  const preparedQuestions = useMemo(() => {
    // Resolver curso por capítulo: Historia conserva sus capítulos reales
    const historyChapters = ["Mesopotamia", "Egipto", "Esparta", "Atenas", "La Migración"]
    const isHistory = historyChapters.includes(chapter)
    // Determinar curso
    const selectedCourse: CourseId = isHistory
      ? "historia"
      : courseThemes.matematica.includes(chapter)
        ? "matematica"
        : courseThemes.comunicacion.includes(chapter)
          ? "comunicacion"
          : courseThemes.ciencia.includes(chapter)
            ? "ciencia"
            : "historia"

    const raw = isHistory
      ? (questions[chapter as keyof typeof questions] || questions["Mesopotamia"])
      : (questionsByCourse[selectedCourse][chapter] || [])

    const shuffle = <T,>(arr: T[]) => {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    // Si no hay preguntas (caso excepcional), evitar romper el juego
    const base = raw.length > 0 ? raw : [{ question: "Contenido en construcción, ¡vuelve pronto!", options: ["Ok"], correct: 0 }]

    return base.map(q => {
      const entries = q.options.map((text, idx) => ({ text, idx }))
      const maybeShuffled = levelConfig.shuffleOptions ? shuffle(entries) : entries
      const limit = Math.min(levelConfig.optionsLimit ?? maybeShuffled.length, maybeShuffled.length)

      // Garantizar inclusión de la respuesta correcta
      const correctEntry = entries[q.correct]
      const selected: { text: string; idx: number }[] = []
      selected.push(correctEntry)
      for (const e of maybeShuffled) {
        if (selected.length >= limit) break
        if (e.idx === correctEntry.idx) continue
        selected.push(e)
      }

      // Reordenar para no dejar siempre la correcta al inicio si hay shuffle
      const finalOptions = levelConfig.shuffleOptions ? shuffle(selected) : selected
      const newOptions = finalOptions.map(o => o.text)
      const newCorrectIndex = finalOptions.findIndex(o => o.idx === correctEntry.idx)

      return { question: q.question, options: newOptions, correct: newCorrectIndex }
    })
  }, [chapter, selectedLevel])

  const currentQ = preparedQuestions[currentQuestion]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQ.correct) {
      setScore(score + 1)
    }

    if (currentQuestion < preparedQuestions.length - 1) {
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
    const minimumScore = Math.ceil(preparedQuestions.length * levelConfig.passRatio)
    const passed = score >= minimumScore
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--brand-light)] via-[var(--brand-accent)] to-[var(--brand-light)] flex items-center justify-center p-6">
        <div className="bg-[var(--brand-light)] border-4 border-[var(--brand-accent)] rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-[var(--brand-dark)] mb-6">
            {passed ? "¡Quiz Completado!" : "¡No te rindas!"}
          </h2>
          <div className="text-6xl mb-4">
            {passed 
              ? (score >= preparedQuestions.length * 0.8 ? "🏆" : "⭐")
              : "💪"
            }
          </div>
          <p className="text-xl text-[var(--brand-primary)] mb-6">
            Puntuación: {score}/{preparedQuestions.length}
          </p>
          <p className="text-lg text-[var(--brand-primary)] mb-8">
            {passed
              ? (score >= preparedQuestions.length * 0.8
                  ? "¡Excelente! Dominas el tema."
                  : "¡Bien hecho! Sigue estudiando.")
              : `¡Vuelve a intentarlo! Necesitas al menos ${minimumScore} respuestas correctas para continuar. ¡Tú puedes lograrlo!`
            }
          </p>
          <div className="flex gap-4">
            <Button
              onClick={resetQuiz}
              className="flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-light)] font-bold py-3"
            >
              {passed ? "REINTENTAR" : "VOLVER A INTENTAR"}
            </Button>
            {passed && (
              <Button 
                onClick={() => {
                  onComplete(score, preparedQuestions.length)
                }} 
                className="flex-1 bg-[var(--brand-secondary)] hover:bg-[var(--brand-primary)] text-white font-bold py-3"
              >
                CONTINUAR
              </Button>
            )}
            <Button onClick={onBack} className="flex-1 bg-[var(--brand-dark)] hover:bg-[var(--brand-primary)] text-[var(--brand-light)] font-bold py-3">
              SALIR
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-light)] via-[var(--brand-accent)] to-[var(--brand-light)] p-6">
      {/* Header */}
      <div className="bg-[var(--brand-primary)] border-4 border-[var(--brand-secondary)] rounded-lg mb-6 p-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--brand-light)]">{chapter}</h1>
          <div className="text-[var(--brand-light)]">
            Pregunta {currentQuestion + 1} de {preparedQuestions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[var(--brand-primary)] rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-[var(--brand-accent)] h-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / preparedQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-[var(--brand-light)] border-4 border-[var(--brand-accent)] rounded-lg p-8 max-w-4xl mx-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-[var(--brand-dark)] mb-8 text-center">{currentQ.question}</h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 rounded-lg border-2 font-semibold text-left transition-all duration-200 ${
                selectedAnswer === index
                  ? "bg-[var(--brand-secondary)] border-[var(--brand-primary)] text-white shadow-lg"
                  : "bg-[var(--brand-light)] border-[var(--brand-secondary)] text-[var(--brand-dark)] hover:bg-[var(--brand-accent)]/30 hover:border-[var(--brand-secondary)]"
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
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-[var(--brand-light)] font-bold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion < preparedQuestions.length - 1 ? "SIGUIENTE" : "FINALIZAR"}
          </Button>
        </div>
      </div>
    </div>
  )
}
