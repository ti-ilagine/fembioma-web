'use client'

import { useState, useEffect } from 'react'
import { Users, X, ArrowRight, Sparkles } from 'lucide-react'

export function SociedadModal() {
  const [isOpen, setIsOpen] = useState(false)
  const SOCIEDAD_FORM_URL = 'https://forms.cloud.microsoft/r/vRHTWj7aSG'

  useEffect(() => {
    // Se muestra a los 2.5 segundos de cada carga o recarga de la página
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#f8d7df] bg-white p-6 shadow-2xl sm:p-8">
        
        {/* Botón cerrar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#e0486c]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#e0486c]">
              <Sparkles className="h-3 w-3" /> Convocatoria Médica
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4a233b] leading-tight">
              Sociedad Peruana de Microbioma Femenino
            </h3>
          </div>
        </div>

        {/* Mensaje */}
        <p className="text-sm leading-relaxed text-slate-600 mb-6">
          ¿Deseas formar parte de la Sociedad Peruana de Microbiota Femenina, con una red científica multidisciplinaria para la investigación, educación médica y práctica clínica en salud reproductiva y microbiota?
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={SOCIEDAD_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0486c] to-[#d6335c] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            <span>Inscribirme</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Ahora no
          </button>
        </div>

      </div>
    </div>
  )
}
