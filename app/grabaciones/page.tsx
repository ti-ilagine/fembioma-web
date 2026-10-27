'use client'

import { useState, useEffect, useRef, memo, useMemo } from 'react'
import { 
  Lock, Play, Pause, Volume2, VolumeX, AlertTriangle, 
  ShieldCheck, LogOut, Film, KeyRound, Clock, User, CheckCircle2, 
  Mail, Loader2, Eye, EyeOff, X, ArrowRight,
  Maximize, Minimize, Gauge, Search, ShieldAlert, Sparkles, HelpCircle
} from 'lucide-react'

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: any
  }
}

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

const FRASES_TRANSICION = [
  'Accediendo a la plataforma oficial...',
  'Validando credenciales y registrando sesión...',
  'Sincronizando conferencias y ponencias magistrales...',
  'Dejando todo listo para tu experiencia...'
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

function obtenerIdDispositivo(): string {
  if (typeof window === 'undefined') return 'servidor'
  let devId = localStorage.getItem('fembioma_device_id')
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36)
    localStorage.setItem('fembioma_device_id', devId)
  }
  return devId
}

interface VisorProps {
  usuario: { correo: string; nombre: string; sessionToken: string }
  onLogout: () => void
  onExpulsado: () => void
}

const VisorSesiones = memo(function VisorSesiones({ usuario, onLogout, onExpulsado }: VisorProps) {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada>(JORNADAS_CONGRESO[0])
  const [ponenciaActiva, setPonenciaActiva] = useState<Ponencia>(JORNADAS_CONGRESO[0].ponencias[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [velocidad, setVelocidad] = useState<number>(1)
  const [busqueda, setBusqueda] = useState('')

  const playerRef = useRef<any>(null)
  const contenedorVideoRef = useRef<HTMLDivElement>(null)
  const isReadyRef = useRef<boolean>(false)
  const timerIntervalRef = useRef<any>(null)
  const heartbeatIntervalRef = useRef<any>(null)

  const mostrarMarcaAgua = currentTime > 15 && (currentTime % 300) < 6

  const ponenciasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return jornadaSeleccionada.ponencias
    const q = busqueda.toLowerCase().trim()
    return jornadaSeleccionada.ponencias.filter(
      (p) => p.titulo.toLowerCase().includes(q) || p.ponente.toLowerCase().includes(q)
    )
  }, [jornadaSeleccionada, busqueda])

  useEffect(() => {
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/verificar-sesion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correo: usuario.correo,
            sessionToken: usuario.sessionToken,
          }),
        })
        const data = await res.json()
        if (res.ok && data.activa === false) {
          if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo()
          }
          onExpulsado()
        }
      } catch {}
    }, 30000)

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
    }
  }, [usuario, onExpulsado])

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
          fs: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : ''
        },
        events: {
          onReady: (event: any) => {
            isReadyRef.current = true
            setDuration(Math.floor(event.target.getDuration() || 0))
            const startSecs = timeToSeconds(ponenciaActiva.timestamp)
            if (startSecs > 0) event.target.seekTo(startSecs, true)
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

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    timerIntervalRef.current = setInterval(() => {
      if (playerRef.current && isReadyRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const cur = Math.floor(playerRef.current.getCurrentTime())
        setCurrentTime(cur)
        const dur = Math.floor(playerRef.current.getDuration() || 0)
        if (dur > 0 && dur !== duration) setDuration(dur)
      }
    }, 1000)

    return () => {
      isMounted = false
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
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
    setBusqueda('')
    const primera = jornada.ponencias[0]
    setPonenciaActiva(primera)

    if (playerRef.current && isReadyRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById({
        videoId: jornada.youtubeId,
        startSeconds: timeToSeconds(primera.timestamp)
      })
      playerRef.current.setPlaybackRate(velocidad)
    }
  }

  const handleSaltarAPonencia = (ponencia: Ponencia) => {
    setPonenciaActiva(ponencia)
    const segs = timeToSeconds(ponencia.timestamp)

    if (playerRef.current && isReadyRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(segs, true)
      playerRef.current.playVideo()
      playerRef.current.setPlaybackRate(velocidad)
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

  const handleCambiarVelocidad = () => {
    if (!playerRef.current || !isReadyRef.current) return
    const nuevaVelocidad = velocidad === 1 ? 1.5 : velocidad === 1.5 ? 2 : 1
    playerRef.current.setPlaybackRate(nuevaVelocidad)
    setVelocidad(nuevaVelocidad)
  }

  const toggleFullscreen = () => {
    if (!contenedorVideoRef.current) return

    if (!document.fullscreenElement) {
      contenedorVideoRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoSegundo = Number(e.target.value)
    setCurrentTime(nuevoSegundo)
    if (playerRef.current && isReadyRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(nuevoSegundo, true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 animate-in fade-in duration-700">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-300">
              FEMBIOMA World Summit 2026 · Sesión Activa: <span className="text-white font-mono">{usuario.correo}</span>
            </h2>
          </div>
          <h1 className="text-lg sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-300 to-amber-200 mt-0.5">
            ¡Bienvenido(a), {usuario.nombre}!
          </h1>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          Salir
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
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

          <div 
            ref={contenedorVideoRef}
            className={`relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl select-none ${
              isFullscreen ? 'w-screen h-screen flex flex-col justify-center' : 'aspect-video'
            }`}
          >
            <div id="yt-player-frame" className="w-full h-full pointer-events-none" />

            {/* MARCA DE AGUA PERIÓDICA AL CENTRO */}
            {mostrarMarcaAgua && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none select-none animate-in fade-in zoom-in duration-300">
                <div className="px-5 py-3 rounded-2xl bg-slate-950/75 border border-slate-700/80 backdrop-blur-md shadow-2xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Contenido Protegido · FEMBIOMA 2026</span>
                  </div>
                  <p className="text-xs font-mono text-slate-200 font-semibold tracking-wider">
                    Uso exclusivo para: <span className="text-white">{usuario.correo}</span>
                  </p>
                  <p className="text-[9px] text-slate-400 tracking-tight">
                    Prohibida la captura, retransmisión o duplicación total o parcial.
                  </p>
                </div>
              </div>
            )}

            <div 
              onClick={togglePlay} 
              onContextMenu={(e) => e.preventDefault()} 
              className="absolute inset-0 z-20 cursor-pointer bg-transparent" 
            />

            <div 
              onContextMenu={(e) => e.preventDefault()} 
              className="absolute top-0 left-0 w-full h-14 z-30 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent px-4 flex items-center justify-between pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-serif text-xs sm:text-sm font-bold tracking-widest uppercase text-white drop-shadow">
                  FEMBIOMA WORLD SUMMIT 2026
                </span>
              </div>
              <div className="select-none bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded text-[10px] tracking-wide text-slate-300 font-mono">
                {usuario.correo}
              </div>
            </div>

            <div 
              onClick={togglePlay} 
              onContextMenu={(e) => e.preventDefault()} 
              className="absolute bottom-0 right-0 w-44 h-16 z-30 pointer-events-auto bg-transparent cursor-pointer" 
            />

            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3 pt-6 flex flex-col gap-2 text-white">
              <div className="flex items-center gap-2 w-full">
                <span className="text-[11px] font-mono text-rose-400 shrink-0 font-medium w-14 text-right">
                  {formatSeconds(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeekSlider}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f06d84]"
                />
                <span className="text-[11px] font-mono text-slate-400 shrink-0 font-medium w-14">
                  {formatSeconds(duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
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

                  <button
                    onClick={handleCambiarVelocidad}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors text-xs font-mono font-bold text-slate-200 border border-slate-700/60 flex items-center gap-1"
                    title="Velocidad de reproducción"
                  >
                    <Gauge className="w-3.5 h-3.5 text-[#f06d84]" />
                    <span>{velocidad}x</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white border border-slate-700/60"
                    aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  Sesión: <span className="text-white font-semibold">{ponenciaActiva.titulo}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f06d84]/15 text-[#f06d84] text-xs font-semibold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Inicio en video: {ponenciaActiva.timestamp}
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

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#f06d84]" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {jornadaSeleccionada.tituloJornada}
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {ponenciasFiltradas.length} de {jornadaSeleccionada.ponencias.length}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por tema o expositor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84]"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {ponenciasFiltradas.length > 0 ? (
              ponenciasFiltradas.map((p) => {
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
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                No se encontraron ponencias con ese criterio.
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Aviso legal:</span> Contenido médico confidencial de uso exclusivo para el asistente registrado. Prohibida su retransmisión, grabación o distribución sin autorización expresa de FEMBIOMA e ILAGINE.
          </div>
        </div>
      </main>
    </div>
  )
})

export default function GrabacionesPage() {
  const [correo, setCorreo] = useState('')
  const [codigoAcceso, setCodigoAcceso] = useState('')
  const [mostrarCodigo, setMostrarCodigo] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<{ correo: string; nombre: string; sessionToken: string } | null>(null)
  const [tiempoExpirado, setTiempoExpirado] = useState(false)
  const [sesionDuplicada, setSesionDuplicada] = useState(false)

  // ESTADOS DE LA TRANSICIÓN CINEMÁTICA DE 8 SEGUNDOS
  const [mostrandoTransicion, setMostrandoTransicion] = useState(false)
  const [indiceFrase, setIndiceFrase] = useState(0)
  const [progresoTransicion, setProgresoTransicion] = useState(0)
  const [datosPendientes, setDatosPendientes] = useState<any>(null)

  // Modal de recuperación
  const [modalRecuperarAbierto, setModalRecuperarAbierto] = useState(false)
  const [correoRecuperar, setCorreoRecuperar] = useState('')
  const [cargandoRecuperar, setCargandoRecuperar] = useState(false)
  const [errorRecuperar, setErrorRecuperar] = useState('')
  const [codigoRecuperado, setCodigoRecuperado] = useState<{ nombre: string; codigo: string } | null>(null)

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

  // Secuencia de 8 segundos (cambio de frases cada 2s y progreso suave)
  useEffect(() => {
    if (!mostrandoTransicion) return

    setIndiceFrase(0)
    setProgresoTransicion(5)

    const fraseInterval = setInterval(() => {
      setIndiceFrase((prev) => {
        if (prev < FRASES_TRANSICION.length - 1) return prev + 1
        return prev
      })
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgresoTransicion((prev) => {
        if (prev >= 98) return 98
        return prev + 1.25
      })
    }, 100)

    const timeoutFinal = setTimeout(() => {
      setProgresoTransicion(100)
      setTimeout(() => {
        setMostrandoTransicion(false)
        if (datosPendientes) {
          setUsuarioAutenticado(datosPendientes)
          sessionStorage.setItem('fembioma_user', JSON.stringify(datosPendientes))
        }
      }, 500)
    }, 8000)

    return () => {
      clearInterval(fraseInterval)
      clearInterval(progressInterval)
      clearTimeout(timeoutFinal)
    }
  }, [mostrandoTransicion, datosPendientes])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const devId = obtenerIdDispositivo()

      const res = await fetch('/api/validar-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          codigo: codigoAcceso.trim().toUpperCase(),
          deviceId: devId,
        }),
      })

      const data = await res.json()

      if (res.ok && data.valido) {
        const payload = { correo: data.correo, nombre: data.nombre, sessionToken: data.sessionToken }
        setDatosPendientes(payload)
        setSesionDuplicada(false)
        setMostrandoTransicion(true)
      } else {
        setError(data.error || 'El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.')
      }
    } catch {
      setError('El correo o el código de acceso no son válidos. Si cree que es un error contacte a eventos@fembioma.com.')
    } finally {
      setCargando(false)
    }
  }

  const handleExpulsadoPorConcurrencia = () => {
    sessionStorage.removeItem('fembioma_user')
    setUsuarioAutenticado(null)
    setSesionDuplicada(true)
  }

  const handleAbrirModalRecuperar = () => {
    setErrorRecuperar('')
    setCodigoRecuperado(null)
    setCorreoRecuperar(correo.trim())
    setModalRecuperarAbierto(true)
  }

  const handleRecuperarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorRecuperar('')
    setCodigoRecuperado(null)
    setCargandoRecuperar(true)

    try {
      const res = await fetch('/api/recuperar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoRecuperar.trim().toLowerCase() }),
      })
      const data = await res.json()

      if (res.ok && data.exito) {
        setCodigoRecuperado({ nombre: data.nombre, codigo: data.codigo })
      } else {
        setErrorRecuperar(data.error || 'El correo ingresado no figura en el padrón activo.')
      }
    } catch {
      setErrorRecuperar('Error al consultar. Por favor intente nuevamente.')
    } finally {
      setCargandoRecuperar(false)
    }
  }

  const aplicarCodigoRecuperado = () => {
    if (!codigoRecuperado) return
    setCorreo(correoRecuperar.trim().toLowerCase())
    setCodigoAcceso(codigoRecuperado.codigo)
    setModalRecuperarAbierto(false)
    setError('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('fembioma_user')
    setUsuarioAutenticado(null)
    setCorreo('')
    setCodigoAcceso('')
  }

  if (tiempoExpirado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
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
      
      {/* PANTALLA DE TRANSICIÓN CINEMÁTICA DE 8 SEGUNDOS */}
      {mostrandoTransicion && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-500">
          <div className="relative max-w-sm w-full flex flex-col items-center text-center">
            
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
                <img
                  src="/logo-fembioma.png"
                  alt="FEMBIOMA World Summit 2026"
                  className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(240,109,132,0.45)]"
                />
              </div>
            </div>

            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#f06d84] mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Plataforma Oficial de Grabaciones</span>
            </span>

            <div className="h-12 flex items-center justify-center my-2">
              <p 
                key={indiceFrase}
                className="text-base sm:text-lg font-serif font-medium text-white animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {FRASES_TRANSICION[indiceFrase]}
              </p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden mt-6 mb-3 p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-[#f06d84] to-amber-300 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progresoTransicion}%` }}
              />
            </div>

            <p className="text-[11px] font-mono text-slate-500 tracking-wide">
              Preparando tu entorno exclusivo...
            </p>
          </div>
        </div>
      )}

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
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5"
            >
              {sesionDuplicada && (
                <div className="p-4 rounded-xl border-2 border-rose-500/80 bg-rose-950/50 flex items-start gap-3 text-rose-200 text-xs shadow-lg animate-in fade-in">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold block text-white">Sesión iniciada en otro dispositivo</span>
                    Se ha detectado un nuevo ingreso con tu cuenta. Para continuar aquí, vuelve a ingresar tus credenciales.
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border-2 border-amber-500/70 bg-amber-950/40 flex items-start gap-3 text-amber-200 text-xs shadow-lg">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <span className="leading-relaxed font-medium">{error}</span>
                </div>
              )}

              {/* CAMPO: CORREO */}
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

              {/* BOTÓN PROMINENTE Y DESTACADO: OBTENER CÓDIGO */}
              <div className="p-3.5 rounded-2xl bg-[#f06d84]/10 border border-[#f06d84]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#f06d84]" />
                    ¿No tienes tu código a la mano?
                  </p>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Consulta tu clave de 5 caracteres con tu correo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAbrirModalRecuperar}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] text-white text-xs font-bold transition-all shadow-md shadow-[#f06d84]/20 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Obtener mi código</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CAMPO: CÓDIGO */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Código Personal (5 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={mostrarCodigo ? 'text' : 'password'}
                    required
                    maxLength={5}
                    value={codigoAcceso}
                    onChange={(e) => setCodigoAcceso(e.target.value.toUpperCase())}
                    placeholder="Ej. CS9TG"
                    autoComplete="off"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06d84] focus:ring-1 focus:ring-[#f06d84] text-sm uppercase tracking-widest font-mono text-center font-bold"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setMostrarCodigo(!mostrarCodigo)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {mostrarCodigo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* BOTÓN INGRESAR */}
              <button
                type="submit"
                disabled={cargando || mostrandoTransicion}
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

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-500">
                  ¿Problemas con tu acceso? Contáctanos a <span className="text-slate-400">eventos@fembioma.com</span>
                </p>
              </div>
            </form>
          </div>

          {/* MODAL DE RECUPERACIÓN / CONSULTA DE CÓDIGO */}
          {modalRecuperarAbierto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
              <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <button
                  onClick={() => setModalRecuperarAbierto(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <div className="inline-flex p-2.5 bg-[#f06d84]/15 text-[#f06d84] rounded-xl mb-2">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">Consulta tu Código</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingresa el correo con el que te registraste en el "Fembioma World Summit 2026" para recuperar tu código personal de 5 caracteres.
                  </p>
                </div>

                {errorRecuperar && (
                  <div className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-200 text-xs">
                    {errorRecuperar}
                  </div>
                )}

                {!codigoRecuperado ? (
                  <form onSubmit={handleRecuperarCodigo} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      value={correoRecuperar}
                      onChange={(e) => setCorreoRecuperar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-[#f06d84] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={cargandoRecuperar}
                      className="w-full py-2.5 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {cargandoRecuperar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Consultar Código'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3 text-center bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-2xl">
                    <p className="text-xs text-emerald-300 font-medium">¡Hola, {codigoRecuperado.nombre}!</p>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Tu código de acceso:</span>
                      <span className="text-2xl font-mono font-bold tracking-widest text-[#f06d84]">
                        {codigoRecuperado.codigo}
                      </span>
                    </div>
                    <button
                      onClick={aplicarCodigoRecuperado}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <span>Usar y Volver al Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <VisorSesiones 
          usuario={usuarioAutenticado} 
          onLogout={handleLogout} 
          onExpulsado={handleExpulsadoPorConcurrencia}
        />
      )}
    </div>
  )
}
