'use client'

import { useState, useEffect } from 'react'
import { Lock, Play, AlertCircle, ShieldCheck, LogOut, Film } from 'lucide-react'

// 1. PADRÓN DE PARTICIPANTES (Mock inicial / Se puede reemplazar con fetch a Google Sheets)
const PADRON_AUTORIZADO = [
  { dni: '44073684', correo: 'marlon@domoy.pe', nombre: 'Marlon Molina' },
  { dni: '12345678', correo: 'karwin@ilagine.com', nombre: 'Karwin Alcántara' },
  { dni: '87654321', correo: 'doctor@fembioma.com', nombre: 'Médico Participante' }
]

// 2. LISTA DE VIDEOS (YouTube Unlisted / Ocultos)
// Usamos videos random/demo de medicina y congresos para la prueba
const VIDEOS_CONGRESO = [
  {
    id: 'demo-1',
    titulo: 'Sesión Inaugural: Avances en Microbiota Vaginal y Diagnóstico de Precisión',
    duracion: '45 min',
    fecha: 'Día 1 - Bloque Mañana',
    youtubeId: 'M7lc1UVf-VE' // Video demo de prueba
  },
  {
    id: 'demo-2',
    titulo: 'Mesa Redonda: Abordaje Clínico de Disbiosis Recurrente',
    duracion: '55 min',
    fecha: 'Día 1 - Bloque Tarde',
    youtubeId: 'dQw4w9WgXcQ' // Video demo de prueba
  }
]

// 3. FECHA DE EXPIRACIÓN DEL ACCESO (Ejemplo: 45 días)
const FECHA_LIMITE = new Date('2026-11-30T23:59:59')

export default function GrabacionesPage() {
  const [dni, setDni] = useState('')
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<{ nombre: string; dni: string } | null>(null)
  const [videoActivo, setVideoActivo] = useState(VIDEOS_CONGRESO[0])
  const [tiempoExpirado, setTiempoExpirado] = useState(false)

  // Deshabilitar clic derecho en toda la sección de videos
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear Ctrl+U (ver fuente), Ctrl+Shift+I (inspeccionar), F12
      if (
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || (e.shiftKey && (e.key === 'I' || e.key === 'J'))))
      ) {
        e.preventDefault()
      }
    }

    // Verificar si expiró la fecha
    if (new Date() > FECHA_LIMITE) {
      setTiempoExpirado(true)
    }

    // Recuperar sesión guardada
    const sesionGuardada = sessionStorage.getItem('fembioma_user')
    if (sesionGuardada) {
      setUsuarioAutenticado(JSON.parse(sesionGuardada))
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

    const encontrado = PADRON_AUTORIZADO.find(
      (u) => u.dni === dniLimpio && u.correo.toLowerCase() === correoLimpio
    )

    if (encontrado) {
      const dataUsuario = { nombre: encontrado.nombre, dni: encontrado.dni }
      setUsuarioAutenticado(dataUsuario)
      sessionStorage.setItem('fembioma_user', JSON.stringify(dataUsuario))
    } else {
      setError('Documento de identidad o correo no figura en el padrón oficial de inscritos confirmados.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('fembioma_user')
    setUsuarioAutenticado(null)
    setDni('')
    setCorreo('')
  }

  // Si expiró el tiempo de visualización
  if (tiempoExpirado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Acceso Finalizado</h1>
          <p className="text-sm text-slate-400">
            El periodo oficial de 45 días para la visualización de las grabaciones del FEMBIOMA World Summit 2026 ha concluido.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#f06d84]/30">
      {/* Vista 1: Formulario de Login si no está autenticado */}
      {!usuarioAutenticado ? (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f06d84]/15 border border-[#f06d84]/30 text-[#f06d84] mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Aula Virtual FEMBIOMA 2026
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Ingreso exclusivo para participantes inscritos. Digita tu documento para acceder a las ponencias.
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

                <button
                  type="submit"
                  className="w-full py-4 mt-2 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-sm transition-all shadow-lg shadow-[#f06d84]/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Validar y Ver Grabaciones
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
        /* Vista 2: Plataforma de Visualización de Videos */
        <div className="min-h-screen flex flex-col">
          {/* Header Superior */}
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-sm font-semibold text-white">FEMBIOMA World Summit 2026</h2>
                <p className="text-xs text-slate-400">
                  Participante: <span className="text-slate-200 font-medium">{usuarioAutenticado.nombre}</span> (DNI: {usuarioAutenticado.dni})
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

          {/* Contenido Principal */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Columna Izquierda: Reproductor Principal */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                
                {/* 1. Iframe de YouTube Embebido */}
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoActivo.youtubeId}?rel=0&modestbranding=1&controls=1&showinfo=0`}
                  title={videoActivo.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 select-none"
                />

                {/* 2. Capa transparente superior (Bloquea clics en el logo de YouTube y título original) */}
                <div 
                  className="absolute top-0 left-0 w-full h-16 pointer-events-auto bg-transparent z-10"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* 3. Marca de agua fija institucional (Punto 9 de Karwin) */}
                <div className="absolute top-3 right-3 z-20 pointer-events-none select-none bg-slate-950/80 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-md text-[10px] tracking-wide text-slate-300 font-mono shadow-sm">
                  FEMBIOMA 2026 · Uso Exclusivo ({usuarioAutenticado.dni}) · Prohibida su copia
                </div>
              </div>

              {/* Ficha técnica del video actual */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f06d84]/15 text-[#f06d84] text-xs font-semibold uppercase mb-2">
                  {videoActivo.fecha} · {videoActivo.duracion}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                  {videoActivo.titulo}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Este contenido está protegido por derechos de autor de Fundación FEMBIOMA. La reproducción y descarga sin autorización están prohibidas.
                </p>
              </div>
            </div>

            {/* Columna Derecha: Temario / Lista de Sesiones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Film className="w-4 h-4 text-[#f06d84]" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Módulos Disponibles
                </h4>
              </div>

              <div className="space-y-2">
                {VIDEOS_CONGRESO.map((v) => {
                  const estaActivo = v.id === videoActivo.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVideoActivo(v)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        estaActivo
                          ? 'border-[#f06d84] bg-[#f06d84]/10 text-white'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          estaActivo ? 'bg-[#f06d84] text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {v.fecha} · {v.duracion}
                        </span>
                        <p className="text-xs font-semibold leading-snug line-clamp-2 mt-0.5">
                          {v.titulo}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
                🔒 Visualización habilitada hasta el <strong>30 de Noviembre de 2026</strong>.
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
