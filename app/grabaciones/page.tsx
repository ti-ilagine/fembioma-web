'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { 
  Lock, Play, Pause, Volume2, VolumeX, AlertCircle, 
  ShieldCheck, LogOut, Film, KeyRound, Clock, User, CheckCircle2 
} from 'lucide-react'

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: any
  }
}

// ==========================================
// 1. PADRÓN DE PARTICIPANTES
// ==========================================
const PADRON_AUTORIZADO = [
  { dni: '44073684', correo: 'marlon@domoy.pe', codigo: 'FEM-2026-M44', nombre: 'Marlon Molina' },
  { dni: '12345678', correo: 'karwin@ilagine.com', codigo: 'FEM-VIP-2026', nombre: 'Karwin Alcántara' },
  { dni: '87654321', correo: 'doctor@fembioma.com', codigo: 'DOC-FEM-001', nombre: 'Médico Participante' }
]

// ==========================================
// 2. ESTRUCTURA DE JORNADAS Y PONENCIAS
// ==========================================
export interface Ponencia {
  id: string
  titulo: string
  ponente: string
  timestamp: string
  duracion: string
}

export interface Jornada {
  diaId: string
  tituloJornada: string
  fechaTexto: string
  youtubeId: string
  ponencias: Ponencia[]
}

const JORNADAS_CONGRESO: Jornada[] = [
  {
    diaId: 'dia-1',
    tituloJornada: 'Jornada Día 1',
    fechaTexto: 'Sábado 17 de Octubre, 2026',
    youtubeId: 'wBDsgXBt6W0',
    ponencias: [
      {
        id: 'd1-1',
        titulo: 'Apertura: Ecosistema de Salud Íntima Femenina y Nuevos Paradigmas',
        ponente: 'Karwin Alcántara (Dirección de Eventos)',
        timestamp: '00:02:40',
        duracion: '30 min'
      },
      {
        id: 'd1-2',
        titulo: 'Disbiosis Vaginal Recurrente y Restauración del Eje Lactobacillus',
        ponente: 'Dra. Valerie Sánchez (Ginecología Funcional)',
        timestamp: '00:30:15',
        duracion: '45 min'
      },
      {
        id: 'd1-3',
        titulo: 'Gestión Integral y Calidad en Servicios de Ginecología Regenerativa',
        ponente: 'Carlos Capcha (Auditoría Médica)',
        timestamp: '01:08:30',
        duracion: '35 min'
      },
      {
        id: 'd1-4',
        titulo: 'Terapia Tópica y Fórmulas Magistrales en Candidiasis Crónica',
        ponente: 'Nancy Contreras (Especialista en Fórmulas Magistrales)',
        timestamp: '01:42:10',
        duracion: '35 min'
      },
      {
        id: 'd1-5',
        titulo: 'Mesa de Discusión: Protocolos Clínicos de Diagnóstico Molecular Femenino',
        ponente: 'Panel Moderado por Victoria Gutiérrez',
        timestamp: '02:14:30',
        duracion: '30 min'
      },
      {
        id: 'd1-6',
        titulo: 'Innovación Tecnológica y Telemedicina en Ginecología de Precisión',
        ponente: 'Ing. Marlon Molina (Sistemas y Proyectos TI)',
        timestamp: '03:31:45',
        duracion: '40 min'
      },
      {
        id: 'd1-7',
        titulo: 'Eje Intestino-Microbioma Femenino: Impacto en Síndrome Metabólico',
        ponente: 'Adrián Díaz (Comité Científico)',
        timestamp: '04:06:20',
        duracion: '45 min'
      },
      {
        id: 'd1-8',
        titulo: 'Logística, Accesibilidad y Cumplimiento de Tratamientos Íntimos',
        ponente: 'Leidy Meléndez (Gestión Administrativa y Clínica)',
        timestamp: '04:46:20',
        duracion: '40 min'
      }
    ]
  },
  {
    diaId: 'dia-2',
    tituloJornada: 'Jornada Día 2',
    fechaTexto: 'Domingo 18 de Octubre, 2026',
    youtubeId: 'zDfIXmHDz0M',
    ponencias: [
      {
        id: 'd2-1',
        titulo: 'Bienvenida Jornada 2: Microbioma Vaginal y Medicina Reproductiva',
        ponente: 'Karwin Alcántara',
        timestamp: '00:10:00',
        duracion: '50 min'
      },
      {
        id: 'd2-2',
        titulo: 'Manejo Terapéutico de Vaginosis Bacteriana Recidivante con Ácido Bórico',
        ponente: 'Dra. Valerie Sánchez',
        timestamp: '01:15:30',
        duracion: '60 min'
      },
      {
        id: 'd2-3',
        titulo: 'Atención y Trazabilidad Asistencial en Teleconsultas de Salud Femenina',
        ponente: 'Victoria Gutiérrez (Coordinación Asistencial)',
        timestamp: '02:30:00',
        duracion: '55 min'
      },
      {
        id: 'd2-4',
        titulo: 'Regulación del pH Vaginal y Barreras Fisiológicas en la Perimenopausia',
        ponente: 'Adrián Díaz',
        timestamp: '03:45:00',
        duracion: '60 min'
      },
      {
        id: 'd2-5',
        titulo: 'Buenas Prácticas en Dispensación y Formulación Íntima para la Mujer',
        ponente: 'Nancy Contreras',
        timestamp: '05:00:15',
        duracion: '65 min'
      },
      {
        id: 'd2-6',
        titulo: 'Optimización de Procesos Financieros en Proyectos de Salud Femenina',
        ponente: 'Ivonne Melgarejo (Finanzas & Tesorería)',
        timestamp: '06:15:40',
        duracion: '45 min'
      },
      {
        id: 'd2-7',
        titulo: 'Seguridad Digital y Resguardo de Datos Clínicos de Pacientes Ginecológicas',
        ponente: 'Ing. Marlon Molina',
        timestamp: '07:10:00',
        duracion: '45 min'
      },
      {
        id: 'd2-8',
        titulo: 'Supervisión de Calidad, Cumplimiento Normativo y Auditoría en Salud',
        ponente: 'Carlos Capcha',
        timestamp: '08:00:20',
        duracion: '40 min'
      },
      {
        id: 'd2-9',
        titulo: 'Clausura Científica: Nuevas Directivas y Certificación Oficial CMP',
        ponente: 'Leidy Meléndez & Dirección Médica',
        timestamp: '08:45:00',
        duracion: '35 min'
      }
    ]
  }
]

const FECHA_LIMITE = new Date('2026-11-30T23:59:59')

const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

const formatSeconds = (totalSecs: number): string => {
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = Math.floor(totalSecs % 60)
  return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

// ==========================================
// 3. VISOR CON PROTECCIÓN DE CAPA INVISIBLE
// ==========================================
interface VisorProps {
  usuario: { nombre: string; dni: string; codigo: string }
  onLogout: () => void
}

const VisorSesiones = memo(function VisorSesiones({ usuario, onLogout }: VisorProps) {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada>(JORNADAS_CONGRESO[0])
  const [ponenciaActiva, setPonenciaActiva] = useState<Ponencia>(JORNADAS_CONGRESO[0].ponencias[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const playerRef = useRef<any>(null)
  const isReadyRef = useRef<boolean>(false)
  const timerIntervalRef = useRef<any>(null)

  useEffect(() => {
    let isMounted = true

    const initPlayer = () => {
      if (!isMounted || playerRef.current || !window.YT || !window.YT.Player) return

      playerRef.current = new window.YT.Player('yt-player-frame', {
        videoId: jornadaSeleccionada.youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 0, // Ocultamos controles nativos para que no puedan usar el botón de YouTube
          disablekb: 1, // Deshabilitar atajos de teclado que puedan abrir links
          fs: 1,        // Permitir pantalla completa controlada
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : ''
        },
        events: {
          onReady: (event: any) => {
            isReadyRef.current = true
            const startSecs = timeToSeconds(ponenciaActiva.timestamp)
            if (startSecs > 0) {
              event.target.seekTo(startSecs, true)
            }
          },
          onStateChange: (event: any) => {
            // 1: Playing, 2: Paused
            if (event.data === 1) setIsPlaying(true)
            if (event.data === 2) setIsPlaying(false)
          }
        }
      })
    }

    if (!window.YT) {
      const existingScript = document.getElementById('youtube-iframe-api')
      if (!existingScript) {
        const tag = document.createElement('script')
        tag.id = 'youtube-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = () => initPlayer()
    } else {
      initPlayer()
    }

    // Cronómetro para actualizar el tiempo actual
    timerIntervalRef.current = setInterval(() => {
      if (playerRef.current && isReadyRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(Math.floor(playerRef.current.getCurrentTime()))
      }
    }, 1000)

    return () => {
      isMounted = false
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
        playerRef.current = null
      }
      isReadyRef.current = false
    }
  }, [])

  const handleCambiarJornada = (jornada: Jornada) => {
    setJornadaSeleccionada(jornada)
    const primera = jornada.ponencias[0]
    setPonenciaActiva(primera)

    if (playerRef.current && isReadyRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById({
        videoId: jornada.youtubeId,
        startSeconds: timeToSeconds(primera.timestamp)
      })
    }
  }

  const handleSaltarAPonencia = (ponencia: Ponencia) => {
    setPonenciaActiva(ponencia)
    const segs = timeToSeconds(ponencia.timestamp)

    if (playerRef.current && isReadyRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(segs, true)
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  // Controles seguros propios
  const togglePlay = () => {
    if (!playerRef.current || !isReadyRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!playerRef.current || !isReadyRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-semibold text-white">Sesiones FEMBIOMA World Summit 2026</h2>
            <p className="text-xs text-slate-400">
              Participante: <span className="text-slate-200 font-medium">{usuario.nombre}</span> (Doc: {usuario.dni})
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Salir
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* Pestañas de Jornada */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {JORNADAS_CONGRESO.map((jornada) => (
              <button
                key={jornada.diaId}
                onClick={() => handleCambiarJornada(jornada)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  jornadaSeleccionada.diaId === jornada.diaId
                    ? 'bg-[#f06d84] text-white shadow-md shadow-[#f06d84]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{jornada.tituloJornada}</span>
                <span className="hidden sm:inline text-[11px] opacity-80 ml-2 font-normal">
                  ({jornada.fechaTexto.split(',')[0]})
                </span>
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* REPRODUCTOR CON CAPAS INVISIBLES DE PROTECCIÓN (OVERLAYS) */}
          {/* ========================================================= */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl select-none">
            {/* Contenedor Iframe YouTube */}
            <div id="yt-player-frame" className="w-full h-full pointer-events-none" />

            {/* CAPA 1: Escudo Central Transparente (Clic simple hace Play/Pause; Bloquea menú contextual) */}
            <div 
              onClick={togglePlay}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 z-20 cursor-pointer bg-transparent"
              title="Haz clic para reproducir o pausar"
            />

            {/* CAPA 2: Bloqueador Superior (Cubre zona de Título y Compartir de YouTube) */}
            <div 
              onContextMenu={(e) => e.preventDefault()}
              className="absolute top-0 left-0 w-full h-16 z-30 pointer-events-auto bg-transparent cursor-pointer"
              onClick={togglePlay}
            />

            {/* CAPA 3: Bloqueador Inferior Derecho (Cubre el logo "YouTube" y botones externos) */}
            <div 
              onContextMenu={(e) => e.preventDefault()}
              className="absolute bottom-0 right-0 w-44 h-16 z-30 pointer-events-auto bg-transparent cursor-pointer"
              onClick={togglePlay}
            />

            {/* Marca de agua institucional inviolable */}
            <div className="absolute top-3 right-3 z-30 pointer-events-none select-none bg-slate-950/85 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-md text-[10px] tracking-wide text-slate-300 font-mono shadow-sm">
              FEMBIOMA 2026 · Doc: {usuario.dni} · Acceso Personal
            </div>

            {/* BARRA DE CONTROLES PROPIA (Totalmente aislada de YouTube) */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-[#f06d84] hover:bg-[#e05a72] transition-colors shadow-sm"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                </button>

                <div className="text-xs font-mono text-slate-300">
                  <span className="text-[#f06d84] font-semibold">{formatSeconds(currentTime)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400">{ponenciaActiva.duracion}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sesión: <span className="text-white">{ponenciaActiva.titulo.slice(0, 35)}...</span>
              </div>
            </div>
          </div>

          {/* Ficha de la ponencia activa */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f06d84]/15 text-[#f06d84] text-xs font-semibold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Inicio: {ponenciaActiva.timestamp}
              </span>
              <span className="text-xs text-slate-400">· Duración estimada: {ponenciaActiva.duracion}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
              {ponenciaActiva.titulo}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <User className="w-3.5 h-3.5 text-[#f06d84]" />
              <span>{ponenciaActiva.ponente}</span>
            </div>
          </div>
        </div>

        {/* Panel lateral con las sesiones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#f06d84]" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Ponencias del {jornadaSeleccionada.tituloJornada}
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {jornadaSeleccionada.ponencias.length} Sesiones
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {jornadaSeleccionada.ponencias.map((p) => {
              const estaActiva = p.id === ponenciaActiva.id
              return (
                <button
                  key={p.id}
                  onClick={() => handleSaltarAPonencia(p)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    estaActiva
                      ? 'border-[#f06d84] bg-[#f06d84]/10 text-white shadow-sm'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      estaActiva ? 'bg-[#f06d84] text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#f06d84] font-mono font-medium">
                        <Clock className="w-3 h-3" />
                        {p.timestamp}
                      </span>
                      <span className="text-[10px] text-slate-500">{p.duracion}</span>
                    </div>
                    <p className="text-xs font-semibold leading-snug line-clamp-2 mt-1">
                      {p.titulo}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.ponente}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
            🔒 Los controles están protegidos dentro de la plataforma para garantizar la exclusividad del contenido.
          </div>
        </div>
      </main>
    </div>
  )
})

// ==========================================
// 4. PÁGINA PRINCIPAL Y AUTENTICACIÓN
// ==========================================
export default function GrabacionesPage() {
  const [dni, setDni] = useState('')
  const [correo, setCorreo] = useState('')
  const [codigoAcceso, setCodigoAcceso] = useState('')
  const [error, setError] = useState('')
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<{ nombre: string; dni: string; codigo: string } | null>(null)
  const [tiempoExpirado, setTiempoExpirado] = useState(false)

  useEffect(() => {
    if (new Date() > FECHA_LIMITE) setTiempoExpirado(true)

    const sesion = sessionStorage.getItem('fembioma_user')
    if (sesion) {
      try {
        setUsuarioAutenticado(JSON.parse(sesion))
      } catch {
        sessionStorage.removeItem('fembioma_user')
      }
    }

    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || (e.shiftKey && (e.key === 'I' || e.key === 'J'))))
      ) {
        e.preventDefault()
      }
    }

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const dniLimpio = dni.trim()
    const correoLimpio = correo.trim().toLowerCase()
    const codigoLimpio = codigoAcceso.trim().toUpperCase()

    const encontrado = PADRON_AUTORIZADO.find(
      (u) =>
        u.dni === dniLimpio &&
        u.correo.toLowerCase() === correoLimpio &&
        u.codigo.toUpperCase() === codigoLimpio
    )

    if (encontrado) {
      const data = { nombre: encontrado.nombre, dni: encontrado.dni, codigo: encontrado.codigo }
      setUsuarioAutenticado(data)
      sessionStorage.setItem('fembioma_user', JSON.stringify(data))
    } else {
      setError('Los datos ingresados no coinciden con el padrón oficial de participantes confirmados.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('fembioma_user')
    setUsuarioAutenticado(null)
    setDni('')
    setCorreo('')
    setCodigoAcceso('')
  }

  if (tiempoExpirado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Acceso Finalizado</h1>
          <p className="text-sm text-slate-400">
            El periodo oficial para la visualización de las grabaciones del FEMBIOMA World Summit 2026 ha concluido.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#f06d84]/30">
      {!usuarioAutenticado ? (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f06d84]/15 border border-[#f06d84]/30 text-[#f06d84] mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Sesiones FEMBIOMA World Summit 2026
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Ingreso exclusivo para participantes inscritos. Digita tu documento, correo y código de acceso.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
            >
              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    DNI o Documento de Identidad
                  </label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej. 12345678"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Correo Electrónico Registrado
                  </label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Código de Acceso
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={codigoAcceso}
                      onChange={(e) => setCodigoAcceso(e.target.value)}
                      placeholder="Ej. FEM-VIP-2026"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm uppercase tracking-wider font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-2 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-sm transition-all shadow-lg shadow-[#f06d84]/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Validar e Ingresar
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-500">
                  ¿Problemas con tu acceso? Contáctanos a <span className="text-slate-400">contacto@fembioma.com</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <VisorSesiones usuario={usuarioAutenticado} onLogout={handleLogout} />
      )}
    </div>
  )
}
