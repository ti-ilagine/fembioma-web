'use client'

import { CalendarCheck, Award, FileQuestion } from 'lucide-react'

export function HighlightsSection() {
  return (
    <>
      {/* 1. SECCIÓN AVAL Y CERTIFICACIÓN */}
      <section id="certificacion" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e0486c]">
            AVAL ACADÉMICO
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#4a233b] sm:text-4xl">
            Requisitos para tu certificación
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Válido para la recertificación médica oficial conforme a los lineamientos del Colegio Médico del Perú.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Asistencia */}
          <div className="rounded-3xl border border-[#f8d7df] bg-white p-8 shadow-sm transition-all hover:border-[#f0859c] hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#e0486c]">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4a233b]">
              Asistencia mínima del 80%
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Acredita tu participación asistiendo al menos al 80% de las sesiones académicas y conferencias del congreso.
            </p>
          </div>

          {/* Valor académico */}
          <div className="rounded-3xl border border-[#f8d7df] bg-white p-8 shadow-sm transition-all hover:border-[#f0859c] hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#e0486c]">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4a233b]">
              Certificación con valor académico
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Certificado oficial con horas académicas otorgado por el <strong>Colegio Médico del Perú (CRXI - Huaraz)</strong>, válido para la recertificación médica.
            </p>
          </div>

          {/* Cuestionario */}
          <div className="rounded-3xl border border-[#f8d7df] bg-white p-8 shadow-sm transition-all hover:border-[#f0859c] hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#e0486c]">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4a233b]">
              Cuestionario virtual
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Cuestionario virtual de autoevaluación al cierre de las jornadas para consolidar y validar los aprendizajes adquiridos.
            </p>
          </div>
        </div>

        {/* 2. BLOQUE AUSPICIADORES (Inmediatamente antes de Agenda) */}
        <div className="mt-20">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e0486c]">
              RESPALDO INSTITUCIONAL
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#4a233b] dark:text-white">
              Nuestros Auspiciadores
            </h3>
          </div>

          <div className="rounded-3xl border border-[#f7a8bc] bg-white/90 dark:bg-slate-900/90 p-4 sm:p-8 shadow-sm">
            <div className="w-full overflow-x-auto flex justify-center items-center py-2">
              <div className="min-w-[580px] md:min-w-0 w-full max-w-4xl flex justify-center">
                <div 
                  className="w-full h-28 sm:h-36 bg-contain bg-center bg-no-repeat select-none"
                  style={{ backgroundImage: "url('/auspicios.png')" }}
                  role="img"
                  aria-label="Auspiciadores Oficiales FEMBIOMA World Summit 2026"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
