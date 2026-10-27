'use client'

import { useState } from 'react'
import { UserPlus, KeyRound, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react'

export default function RegistroAlumnosPage() {
  const [pestana, setPestana] = useState<'registro' | 'cambio'>('registro')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [codigoManual, setCodigoManual] = useState('')
  const [pin, setPin] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [copiado, setCopiado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResultado(null)
    setCargando(true)

    try {
      const payload = {
        accion: pestana === 'cambio' ? 'cambiar_clave' : 'nuevo_registro',
        nombre,
        correo,
        pinAutorizacion: pin,
        codigoManual: pestana === 'cambio' ? codigoManual : undefined,
      }

      const res = await fetch('/api/admin/registrar-participante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setResultado(data)
        setNombre('')
        setCorreo('')
        setCodigoManual('')
      } else {
        setError(data.error || 'Ocurrió un error al procesar la solicitud.')
      }
    } catch {
      setError('Error de comunicación con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const copiarPlantillaWhatsApp = () => {
    if (!resultado?.participante) return
    const texto = `¡Hola, ${resultado.participante.nombre}! 👋
Confirmamos tus credenciales actualizadas para las grabaciones de FEMBIOMA 2026:

🌐 Enlace: https://fembioma.com/grabaciones
📧 Correo: ${resultado.participante.correo}
🔑 Código de Acceso: ${resultado.participante.codigo}

Por favor guarda este mensaje para tu ingreso.`

    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-3 bg-[#f06d84]/15 text-[#f06d84] rounded-2xl">
            {pestana === 'registro' ? <UserPlus className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">Panel Administrativo</h1>
            <p className="text-xs text-slate-400">Gestión de Grabaciones — Fundación & Ventas</p>
          </div>
        </div>

        {/* Pestañas de Selección */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setPestana('registro'); setError(''); setResultado(null) }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              pestana === 'registro'
                ? 'bg-[#f06d84] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Registrar Nuevo Alumno
          </button>
          <button
            type="button"
            onClick={() => { setPestana('cambio'); setError(''); setResultado(null) }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              pestana === 'cambio'
                ? 'bg-[#f06d84] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cambiar / Resetear Clave
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl border border-red-500/50 bg-red-950/40 text-red-200 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {pestana === 'registro' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nombre Completo del Participante
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Dra. Mariana López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#f06d84] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Correo Electrónico Registrado
            </label>
            <input
              type="email"
              required
              placeholder="alumno@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#f06d84] focus:outline-none"
            />
          </div>

          {pestana === 'cambio' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nuevo Código Manual (Opcional - 5 Caracteres)
              </label>
              <input
                type="text"
                maxLength={5}
                placeholder="Dejar en blanco para autogenerar"
                value={codigoManual}
                onChange={(e) => setCodigoManual(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:border-[#f06d84] focus:outline-none uppercase"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              PIN de Autorización (Fundación)
            </label>
            <input
              type="password"
              required
              placeholder="PIN administrativo"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#f06d84] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cargando
              ? 'Procesando en D1...'
              : pestana === 'registro'
              ? 'Generar y Registrar Acceso'
              : 'Actualizar Código en D1'}
          </button>
        </form>

        {/* Tarjeta de resultado */}
        {resultado?.participante && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{resultado.mensaje}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400">Código de acceso activo:</p>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#f06d84]">
                {resultado.participante.codigo}
              </div>
              <p className="text-[11px] text-slate-400">
                {resultado.participante.nombre} ({resultado.participante.correo})
              </p>
            </div>

            <button
              onClick={copiarPlantillaWhatsApp}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">¡Mensaje copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar texto listo para WhatsApp</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
