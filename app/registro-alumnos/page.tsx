'use client'

import { useState } from 'react'
import { UserPlus, KeyRound, Copy, Check, ShieldAlert, Sparkles, Smartphone, RefreshCw, Mail, Lock } from 'lucide-react'

export default function RegistroAlumnosPage() {
  const [pestana, setPestana] = useState<'registro' | 'cambio' | 'dispositivos'>('registro')
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
      // 1. Caso: Resetear Dispositivos Autorizados
      if (pestana === 'dispositivos') {
        const res = await fetch('/api/admin-reset-dispositivos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correo: correo.trim().toLowerCase(),
            pin: pin.trim(),
          }),
        })

        const data = await res.json()

        if (res.ok && data.exito) {
          setResultado({ tipo: 'dispositivos', mensaje: data.mensaje, correo })
          setCorreo('')
        } else {
          setError(data.error || 'Ocurrió un error al resetear los dispositivos.')
        }
        return
      }

      // 2. Casos: Nuevo Registro o Cambio de Clave
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
        setResultado({ tipo: 'participante', ...data })
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-slate-50 to-slate-100 text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6">
      
      {/* Contenedor Principal en Blanco */}
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-950/5">
        
        {/* Encabezado con Logo Oficial de FEMBIOMA */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
          <div className="mb-3 p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <img
              src="/logo-fembioma.png"
              alt="FEMBIOMA World Summit 2026"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#f06d84]">
            Plataforma Administrativa
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
            Gestión de Participantes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de accesos y equipos — Fundación & Ventas
          </p>
        </div>

        {/* Pestañas de Selección en Modo Claro */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 my-6 text-center">
          <button
            type="button"
            onClick={() => { setPestana('registro'); setError(''); setResultado(null) }}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              pestana === 'registro'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className={`w-3.5 h-3.5 ${pestana === 'registro' ? 'text-[#f06d84]' : 'text-slate-400'}`} />
            <span className="truncate">Nuevo Alumno</span>
          </button>

          <button
            type="button"
            onClick={() => { setPestana('cambio'); setError(''); setResultado(null) }}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              pestana === 'cambio'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className={`w-3.5 h-3.5 ${pestana === 'cambio' ? 'text-[#f06d84]' : 'text-slate-400'}`} />
            <span className="truncate">Reset Clave</span>
          </button>

          <button
            type="button"
            onClick={() => { setPestana('dispositivos'); setError(''); setResultado(null) }}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              pestana === 'dispositivos'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${pestana === 'dispositivos' ? 'text-[#f06d84]' : 'text-slate-400'}`} />
            <span className="truncate">Liberar Equipos</span>
          </button>
        </div>

        {/* Mensaje contextual para liberación de dispositivos */}
        {pestana === 'dispositivos' && (
          <div className="mb-5 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-900 leading-relaxed">
            <span className="font-semibold block mb-0.5 text-[#e0486c]">¿Cuándo usar esta opción?</span>
            Si un médico cambió de teléfono o computadora y el sistema le indica que alcanzó el límite de 2 terminales autorizados.
          </div>
        )}

        {/* Alerta de Error Clara */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {pestana === 'registro' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nombre Completo del Participante
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Dra. Mariana López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-[#f06d84] focus:ring-2 focus:ring-[#f06d84]/20 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Correo Electrónico Registrado
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="alumno@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-[#f06d84] focus:ring-2 focus:ring-[#f06d84]/20 focus:outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {pestana === 'cambio' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nuevo Código Manual (Opcional - 5 Caracteres)
              </label>
              <input
                type="text"
                maxLength={5}
                placeholder="Dejar en blanco para autogenerar"
                value={codigoManual}
                onChange={(e) => setCodigoManual(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-mono focus:bg-white focus:border-[#f06d84] focus:ring-2 focus:ring-[#f06d84]/20 focus:outline-none uppercase transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              PIN de Autorización (Fundación)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="PIN administrativo"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-[#f06d84] focus:ring-2 focus:ring-[#f06d84]/20 focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#f06d84] hover:bg-[#e05a72] font-semibold text-white text-sm transition-all shadow-md shadow-[#f06d84]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cargando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Procesando en D1...</span>
              </>
            ) : pestana === 'registro' ? (
              'Generar y Registrar Acceso'
            ) : pestana === 'cambio' ? (
              'Actualizar Código en D1'
            ) : (
              'Desvincular Dispositivos del Alumno'
            )}
          </button>
        </form>

        {/* Tarjeta de resultado para Dispositivos Liberados */}
        {resultado?.tipo === 'dispositivos' && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Equipos liberados exitosamente</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Se borró el historial de terminales vinculadas para <span className="font-mono font-bold text-emerald-900">{resultado.correo}</span>. El médico ya puede ingresar desde sus nuevos equipos sin restricciones.
            </p>
          </div>
        )}

        {/* Tarjeta de resultado para Registro / Cambio de Clave */}
        {resultado?.participante && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{resultado.mensaje}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Código de acceso activo:</p>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#f06d84]">
                {resultado.participante.codigo}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {resultado.participante.nombre}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {resultado.participante.correo}
              </p>
            </div>

            <button
              onClick={copiarPlantillaWhatsApp}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-300 shadow-sm"
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Mensaje copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
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
