'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { 
  Lock, Play, Pause, Volume2, VolumeX, AlertTriangle, 
  ShieldCheck, LogOut, Film, KeyRound, Clock, User, CheckCircle2, 
  Mail, Loader2, Eye, EyeOff, HelpCircle, X, ArrowRight,
  Maximize, Minimize, Gauge
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

interface VisorProps {
  usuario: { correo: string; nombre: string }
  onLogout: () => void
}

const VisorSesiones = memo(function VisorSesiones({ usuario, onLogout }: VisorProps) {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada>(JORNADAS_CONGRESO[0])
  const [ponenciaActiva, setPonenciaActiva] = useState<Ponencia>(JORNADAS_CONGRESO[0].ponencias[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Transición con el logo
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const [fadeSplash, setFadeSplash] = useState(false)

  // Controles de pantalla completa y velocidad
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [velocidad, setVelocidad] = useState<number>(1)

  const playerRef = useRef<any>(null)
  const contenedorVideoRef = useRef<HTMLDivElement>(null)
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

            // Transición cinemática con el logo
            setTimeout(() => {
              setFadeSplash(true)
              setTimeout(() => setMostrarSplash(false), 700)
            }, 1400)
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

    // Escuchar cambios de fullscreen del navegador
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

  // Alternar velocidades: 1x -> 1.5x -> 2x -> 1x
  const handleCambiarVelocidad = () => {
    if (!playerRef.current || !isReadyRef.current) return
    const nuevaVelocidad = velocidad === 1 ? 1.5 : velocidad === 1.5 ?
