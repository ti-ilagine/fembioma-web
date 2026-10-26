'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { 
  Lock, Play, Pause, Volume2, VolumeX, AlertCircle, 
  ShieldCheck, LogOut, Film, KeyRound, Clock, User, CheckCircle2, Mail, Loader2 
} from 'lucide-react'

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: any
  }
}

// ==========================================
// 1. ESTRUCTURA DE JORNADAS Y PONENCIAS REALES
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
    youtubeId: 'uqLtZg3Hhlk',
    ponencias: [
      { id: 'd1-1', titulo: 'Palabras de Bienvenida e Inauguración del Congreso', ponente: 'Dr. Cristian Hidalgo Pajuelo', timestamp: '00:00:00', duracion: '19 min' },
      { id: 'd1-2', titulo: 'Futuro de la medicina Femenina: Del microbioma a la prevención', ponente: 'Dra. Annalisa Di Rocco // Dra. Valerie Sánchez', timestamp: '00:19:20', duracion: '24 min' },
      { id: 'd1-3', titulo: 'Bases del microbioma intestinal y su impacto sistémico', ponente: 'Dr. Marco Carvajal // Dra. Valerie Sánchez', timestamp: '00:43:40', duracion: '53 min' },
      { id: 'd1-4', titulo: 'Microbioma en crecimiento: Nutrición, inmunidad y desarrollo infantil', ponente: 'Dr. Roberto Somocurcio // Dra. Valerie Sánchez', timestamp: '01:36:57', duracion: '35 min' },
      { id: 'd1-5', titulo: 'El ecosistema microbiano femenino: Microbioma vaginal y endometrial', ponente: 'Dr. Cristian Hidalgo Pajuelo // Dra. María Gracia Costa', timestamp: '02:11:51', duracion: '34 min' },
      { id: 'd1-6', titulo: 'Transmisión Vertical Madre - Hijo durante la gestación y parto', ponente: 'Dr. Juan Miguel Rodríguez Gómez // Dra. María Gracia Costa', timestamp: '02:46:38', duracion: '40 min' },
      { id: 'd1-7', titulo: 'Leche materna: Arquitecta del microbioma infantil', ponente: 'Dra. Beatriz Espín // Dra. Yessica Quispe', timestamp: '03:26:55', duracion: '37 min' },
      { id: 'd1-8', titulo: 'Modulando el Microbioma Reproductivo y resultados clínicos', ponente: 'Dra. Inmaculada Moreno // Dra. Yessica Quispe', timestamp: '04:03:42', duracion: '40 min' },
      { id: 'd1-9', titulo: 'Más allá de la composición microbiana y metabolómica', ponente: 'Dr. David Cotán // Dra. Yessica Quispe', timestamp: '04:43:40', duracion: '46 min' },
      { id: 'd1-10', titulo: 'Nutrición en el microbioma femenino', ponente: 'Lic. Ariadna López // Dra. Karina Coricaza', timestamp: '05:29:30', duracion: '26 min' },
      { id: 'd1-11', titulo: 'Nutrición funcional, inflamación y metabolómica aplicada', ponente: 'Lic. Yolanda Quintero // Dra. Karina Coricaza', timestamp: '05:55:18', duracion: '39 min' },
      { id: 'd1-12', titulo: 'Suplementación como herramienta de modulación en microbiota', ponente: 'Dra. Miluska Montalvo // Dra. Alesandra Huerta', timestamp: '06:34:55', duracion: '33 min' },
      { id: 'd1-13', titulo: 'Implementación clínica de programas nutricionales', ponente: 'Lic. Karla Custodio // Dra. Alesandra Huerta', timestamp: '07:08:25', duracion: '44 min' },
      { id: 'd1-14', titulo: 'Mesa redonda: Nutrición, metabolismo y microbioma femenino', ponente: 'Panel de Especialistas del Bloque', timestamp: '07:52:25', duracion: '40 min' }
    ]
  },
  {
    diaId: 'dia-2',
    tituloJornada: 'Jornada Día 2',
    fechaTexto: 'Domingo 18 de Octubre, 2026',
    youtubeId: 'AYjDTb29ges',
    ponencias: [
      { id: 'd2-1', titulo: 'El microbioma en la menopausia: Hormonas y ecosistema', ponente: 'Dr. Fernando Losa // Dra. Allysson Montenegro', timestamp: '00:00:00', duracion: '38 min' },
      { id: 'd2-2', titulo: 'Impacto de los antibióticos en la microbiota intestinal y vaginal', ponente: 'Dr. Christian Boggio Marzet // Dra. Allysson Montenegro', timestamp: '00:38:38', duracion: '48 min' },
      { id: 'd2-3', titulo: 'Estudio del microbioma vaginal en el mundo y Perú (Proyecto Laura)', ponente: 'Dra. Sandra Condori // Dra. Liliana Díaz', timestamp: '01:27:10', duracion: '39 min' },
      { id: 'd2-4', titulo: 'Infecciones urinarias y microbioma urinario femenino', ponente: 'Dr. Cristian Hidalgo Pajuelo // Dra. Liliana Díaz', timestamp: '02:06:33', duracion: '53 min' },
      { id: 'd2-5', titulo: 'Microbiota en la endometriosis: Lactobacillus y epigenética', ponente: 'Dra. Annalisa Di Rocco // Dra. Valerie Sánchez', timestamp: '03:03:02', duracion: '43 min' },
      { id: 'd2-6', titulo: 'Infecciones vaginales: Candidiasis recurrente y biofilms', ponente: 'Dr. Cristian Hidalgo Pajuelo // Dra. Valerie Sánchez', timestamp: '03:46:21', duracion: '30 min' },
      { id: 'd2-7', titulo: 'Metabolismo del estrógeno y la microbiota (Estroboloma)', ponente: 'Dra. Annalisa Di Rocco // Dra. Sofia Saldaña', timestamp: '04:16:44', duracion: '28 min' },
      { id: 'd2-8', titulo: 'Salud emocional, estrés crónico y microbioma femenino', ponente: 'Dra. Verónica Morín // Dra. Sofia Saldaña', timestamp: '04:44:37', duracion: '54 min' }
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
// 2. VISOR CON PROTECCIÓN DE CAPA INVISIBLE
// ==========================================
interface VisorProps {
  correoUsuario: string
  onLogout: () => void
}

const VisorSesiones = memo(function VisorSesiones({ correoUsuario, onLogout }: VisorProps) {
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
          controls: 0,
          disablekb: 1,
          fs: 1,
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-semibold text-white">Grabaciones FEMBIOMA World Summit 2026</h2>
            <p className="text-xs text-slate-400">
              Sesión activa: <span className="text-[#f06d84] font-medium">{correoUsuario}</span>
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

          {/* REPRODUCTOR CON CAPAS PROTECTORAS */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl select-none">
            <div id="yt-player-frame" className="w-full h-full pointer-events-none" />

            <div onClick={togglePlay} onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 z-20 cursor-pointer bg-transparent" title="Haz clic para reproducir o pausar" />
            <div onClick={togglePlay} onContextMenu={(e) => e.preventDefault()} className="absolute top-0 left-0 w-full h-16 z-30 pointer-events-auto bg-transparent cursor-pointer" />
            <div onClick={togglePlay} onContextMenu={(e) => e.preventDefault()} className="absolute bottom-0 right-0 w-44 h-16 z-30 pointer-events-auto bg-transparent cursor-pointer" />

            {/* Marca de agua institucional */}
            <div className="absolute top-3 right-3 z-30 pointer-events-none select-none bg-slate-950/85 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-md text-[10px] tracking-wide text-slate-300 font-mono shadow-sm">
              FEMBIOMA 2026 · {correoUsuario}
            </div>

            {/* Controles propios */}
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

        {/* Panel lateral con minutero interactivo */}
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
// 3. PÁGINA PRINCIPAL Y AUTENTICACIÓN DINÁMICA
// ==========================================
export default function GrabacionesPage() {
  const [correo, setCorreo] = useState('')
  const [codigoAcceso, setCodigoAcceso] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<string | null>(null)
  const [tiempoExpirado, setTiempoExpirado] = useState(false)

  useEffect(() => {
    if (new Date() > FECHA_LIMITE) setTiempoExpirado(true)

    const sesion = sessionStorage.getItem('fembioma_user_email')
    if (sesion) {
      setUsuarioAutenticado(sesion)
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const res = await fetch('/api/validar-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          codigo: codigoAcceso.trim().toUpperCase(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.valido) {
        setUsuarioAutenticado(data.correo)
        sessionStorage.setItem('fembioma_user_email', data.correo)
      } else {
        setError(data.error || 'Credenciales incorrectas en el padrón.')
      }
    } catch {
      setError('Error al conectar con el servidor de validación. Inténtalo nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('fembioma_user_email')
    setUsuarioAutenticado(null)
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
                Grabaciones FEMBIOMA 2026
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Ingreso exclusivo para participantes. Digita tu correo registrado y tu código personal de 5 caracteres.
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
                    Correo Electrónico Registrado
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Código de Acceso Personal (5 caracteres)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={codigoAcceso}
                      onChange={(e) => setCodigoAcceso(e.target.value.toUpperCase())}
                      placeholder="Ej. CS9TG"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm uppercase tracking-widest font-mono text-center font-bold"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-4 mt-2 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-sm transition-all shadow-lg shadow-[#f06d84]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cargando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validando en el padrón...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ingresar a las Grabaciones</span>
                    </>
                  )}
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
        <VisorSesiones correoUsuario={usuarioAutenticado} onLogout={handleLogout} />
      )}
    </div>
  )
}
