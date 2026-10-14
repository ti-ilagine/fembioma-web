'use client'

export function SponsorsSection() {
  return (
    <section id="auspiciadores" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e0486c]">
          RESPALDO INSTITUCIONAL
        </span>
        <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#4a233b] dark:text-white">
          Nuestros Auspiciadores
        </h3>
      </div>

      {/* Contenedor tipo cápsula con soporte responsivo para la imagen horizontal */}
      <div className="rounded-3xl border border-[#f7a8bc] bg-white/90 dark:bg-slate-900/90 p-4 sm:p-8 shadow-sm">
        <div className="w-full overflow-x-auto flex justify-center items-center py-2 scrollbar-thin">
          <div className="min-w-[580px] md:min-w-0 w-full max-w-4xl flex justify-center">
            <img
              src="/auspicios.png"
              alt="Auspiciadores Oficiales FEMBIOMA World Summit 2026"
              className="w-full h-auto object-contain max-h-[140px] sm:max-h-[180px] select-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
