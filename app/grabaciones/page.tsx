'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Play, AlertCircle, ShieldCheck, LogOut, Film, KeyRound, Clock, User, CheckCircle2 } from 'lucide-react'

// Tipos globales para la API Iframe de YouTube
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: any
  }
}

// ==========================================
// 1. PADRÓN DE PARTICIPANTES (Mock / Expandible)
// ==========================================
const PADRON_AUTORIZADO = [
  { dni: '44073684', correo: 'marlon@domoy.pe', codigo: 'FEM-2026-M44', nombre: 'Marlon Molina' },
  { dni: '12345678', correo: 'karwin@ilagine.com', codigo: 'FEM-VIP-2026', nombre: 'Karwin Alcántara' },
  { dni: '87654321', correo: 'doctor@fembioma.com', codigo: 'DOC-FEM-001', nombre: 'Médico Participante' }
]

// ==========================================
// 2. ESTRUCTURA ESCALABLE DEL CONGRESO (2 JORNADAS / 4 TIMESTAMPS POR DÍA)
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
    youtubeId: 'M7lc1UVf-VE', // Reemplazar con ID de YouTube real Día 1
    ponencias: [
      {
        id: 'p1-1',
        titulo: 'Sesión Inaugural: Avances en Microbiota Vaginal y Diagnóstico Molecular',
        ponente: 'Dr. Cristian Hidalgo Pajuelo',
        timestamp: '00:15:30',
        duracion: '50 min'
      },
      {
        id: 'p1-2',
        titulo: 'Mesa Redonda: Abordaje Clínico y Terapéutico de la Disbiosis Recurrente',
        ponente: 'Dra. María Elena Tapia (Panel de Gineco-Obstetricia)',
        timestamp: '01:45:00',
        duracion: '60 min'
      },
      {
        id: 'p1-3',
        titulo: 'Interacción Eje Intestino-Vagina: Rol de los Probióticos de Precisión',
        ponente: 'Dr. Roberto Mendoza (Expositor Internacional)',
        timestamp: '03:20:15',
        duracion: '55 min'
      },
      {
        id: 'p1-4',
        titulo: 'Protocolos de Aplicación Clínica de Ácido Bórico y Terapia Restauradora',
        ponente: 'Comité Científico Fembioma',
        timestamp: '05:10:45',
        duracion: '45 min'
      }
    ]
  },
  {
    diaId: 'dia-2',
    tituloJornada: 'Jornada Día 2',
    fechaTexto: 'Domingo 18 de Octubre, 2026',
    youtubeId: 'dQw4w9WgXcQ', // Reemplazar con ID de YouTube real Día 2
    ponencias: [
      {
        id: 'p2-1',
        titulo: 'Medicina de Precisión en la Salud Femenina y Biomarcadores Avanzados',
        ponente: 'Dra. Patricia Sotomayor',
        timestamp: '00:30:00',
        duracion: '50 min'
      },
      {
        id: 'p2-2',
        titulo: 'Terapia con Microbiota y Protocolos de Aplicación Personalizada',
        ponente: 'Dra. Juliana Gutiérrez',
        timestamp: '02:15:20',
        duracion: '60 min'
      },
      {
        id: 'p2-3',
        titulo: 'Casos Clínicos Complejos: Manejo Integral en Pacientes Recidivantes',
        ponente: 'Dra. Valerie Cárdenas & Panel Quirúrgico',
        timestamp: '03:45:00',
        duracion: '55 min'
      },
      {
        id: 'p2-4',
        titulo: 'Clausura Científica: Conclusiones, Certificación CMP y Nuevas Líneas',
        ponente: 'Dr. Cristian Hidalgo Pajuelo (Dirección Médica)',
        timestamp: '05:30:10',
        duracion: '40 min'
      }
    ]
  }
]

// Fecha límite de vigencia de acceso
const FECHA_LIMITE = new Date('2026-11-30T23:59:59')

// Convierte formato "HH:MM:SS" o "MM:SS" a segundos para la API
const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export default function GrabacionesPage() {
  const [dni, setDni] = useState('')
  const [correo, setCorreo] = useState('')
  const [codigoAcceso, setCodigoAcceso] = useState('')
  const [error, setError] = useState('')
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<{ nombre: string; dni: string; codigo: string } | null>(null)

  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada>(JORNADAS_CONGRESO[1]) // Inicia en Día 2 para testing
  const [ponenciaActiva, setPonenciaActiva] = useState<Ponencia>(JORNADAS_CONGRESO[1].ponencias[2]) // Dra. Juliana Gutiérrez / Casos clínicos
  const [tiempoExpirado, setTiempoExpirado] = useState(false)

  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (new Date() > FECHA_LIMITE) setTiempoExpirado(true)

    const sesionGuardada = sessionStorage.getItem('fembioma_user')
    if (sesionGuardada) {
      setUsuarioAutenticado(JSON.parse(sesionGuardada))
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

    // Cargar SDK de YouTube
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        if (usuarioAutenticado) {
          crearPlayer(jornadaSeleccionada.youtubeId)
        }
      }
    } else if (window.YT && window.YT.Player && usuarioAutenticado) {
      crearPlayer(jornadaSeleccionada.youtubeId)
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [usuarioAutenticado])

  const crearPlayer = (youtubeId: string) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(youtubeId)
      return
    }

    const container = document.getElementById('yt-player-frame')
    if (!container) return

    playerRef.current = new window.YT.Player('yt-player-frame', {
      videoId: youtubeId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: typeof window !== 'undefined' ? window.location.origin : ''
      },
      events: {
        onReady: (event: any) => {
          const segs = timeToSeconds(ponenciaActiva.timestamp)
          if (segs > 0) {
            event.target.seekTo(segs, true)
          }
        }
      }
    })
  }

  const handleCambiarJornada = (jornada: Jornada) => {
    setJornadaSeleccionada(jornada)
    const primera = jornada.ponencias[0]
    setPonenciaActiva(primera)

    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById({
        videoId: jornada.youtubeId,
        startSeconds: timeToSeconds(primera.timestamp)
      })
    }
  }

  const handleSaltarAPonencia = (ponencia: Ponencia) => {
    setPonenciaActiva(ponencia)
    const segs = timeToSeconds(ponencia.timestamp)

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(segs, true)
      playerRef.current.playVideo()
    }
  }

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
      const dataUsuario = { nombre: encontrado.nombre, dni: encontrado.dni, codigo: encontrado.codigo }
      setUsuarioAutenticado(dataUsuario)
      sessionStorage.setItem('fembioma_user', JSON.stringify(dataUsuario))
      setTimeout(() => {
        if (window.YT && window.YT.Player) {
          crearPlayer(jornadaSeleccionada.youtubeId)
        }
      }, 350)
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
    if (playerRef.current) {
      playerRef.current.destroy()
      playerRef.current = null
    }
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
        /* VISTA 1: FORMULARIO DE ACCESO */
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
        /* VISTA 2: VISOR INTERACTIVO Y TEMARIO */
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-sm font-semibold text-white">Sesiones FEMBIOMA World Summit 2026</h2>
                <p className="text-xs text-slate-400">
                  Participante: <span className="text-slate-200 font-medium">{usuarioAutenticado.nombre}</span> (Doc: {usuarioAutenticado.dni})
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {/* Selector de Jornada */}
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

              {/* Contenedor del Reproductor YouTube */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                <div id="yt-player-frame" className="w-full h-full" />

                {/* Marca de agua institucional */}
                <div className="absolute top-3 right-3 z-20 pointer-events-none select-none bg-slate-950/85 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-md text-[10px] tracking-wide text-slate-300 font-mono shadow-sm">
                  FEMBIOMA 2026 · Doc: {usuarioAutenticado.dni} · Acceso Personal
                </div>
              </div>

              {/* Ficha de Ponencia Activa */}
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

            {/* Índice de Capítulos / Ponencias */}
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

              <div className="space-y-2">
                {jornadaSeleccionada.ponencias.map((p) => {
                  const estaActiva = p.id === ponenciaActiva.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSaltarAPonencia(p)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
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
                💡 Haz clic sobre cualquier bloque para que el reproductor salte directamente a la intervención del expositor.
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
