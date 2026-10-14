'use client'

import { useState } from 'react'

interface Sesion {
  horario: string
  titulo: string
  subtitulo?: string
  bullets?: string[]
  ponente: string
  especialidad?: string
  pais?: string
  codigoPais?: 'pe' | 've' | 'es' | 'mx' | 'ar' | 'be' | 'uy' | 'co'
  moderador?: string
  tipo?: 'registro' | 'apertura' | 'conferencia' | 'break' | 'almuerzo' | 'mesa' | 'clausura'
}

const BANDERA_SVG: Record<string, React.ReactNode> = {
  pe: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#D91023" />
      <path d="M170.7 0h170.6v512H170.7z" fill="#FFF" />
    </svg>
  ),
  ve: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#CF142B" />
      <path d="M0 170.7h512v170.6H0z" fill="#00247D" />
      <path d="M0 0h512v170.7H0z" fill="#FFCC00" />
      <circle cx="256" cy="240" r="10" fill="#FFF" />
      <circle cx="225" cy="245" r="9" fill="#FFF" />
      <circle cx="287" cy="245" r="9" fill="#FFF" />
      <circle cx="198" cy="260" r="9" fill="#FFF" />
      <circle cx="314" cy="260" r="9" fill="#FFF" />
    </svg>
  ),
  es: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#AA151B" />
      <path d="M0 128h512v256H0z" fill="#F1BF00" />
    </svg>
  ),
  mx: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#CE1126" />
      <path d="M0 0h341.3v512H0z" fill="#FFF" />
      <path d="M0 0h170.7v512H0z" fill="#006847" />
      <circle cx="256" cy="256" r="22" fill="#964B00" />
    </svg>
  ),
  ar: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#75AADB" />
      <path d="M0 170.7h512v170.6H0z" fill="#FFF" />
      <circle cx="256" cy="256" r="24" fill="#F6B40E" />
    </svg>
  ),
  be: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#ED2939" />
      <path d="M0 0h341.3v512H0z" fill="#FAE042" />
      <path d="M0 0h170.7v512H0z" fill="#000" />
    </svg>
  ),
  uy: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#FFF" />
      <path d="M0 56.9h512v56.9H0zm0 113.8h512v56.9H0zm0 113.8h512v56.9H0zm0 113.8h512v56.9H0z" fill="#0038A8" />
      <circle cx="120" cy="120" r="45" fill="#FCD116" />
    </svg>
  ),
  co: (
    <svg className="w-5 h-5 rounded-full shadow-sm shrink-0" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#CE1126" />
      <path d="M0 0h512v384H0z" fill="#003893" />
      <path d="M0 0h512v256H0z" fill="#FCD116" />
    </svg>
  )
}

const PROGRAMA_DIA_1: Sesion[] = [
  { horario: '08:00 - 09:00', titulo: 'Mesa de registro', ponente: '', tipo: 'registro' },
  { horario: '09:00 - 09:10', titulo: 'Palabras de bienvenida e inauguración del curso.', subtitulo: 'Información sobre la metodología del curso.', ponente: 'Decano Colegio Médico', tipo: 'apertura' },
  { horario: '09:10 - 09:20', titulo: 'Video apertura', ponente: '', tipo: 'apertura' },
  { horario: '09:20 - 10:00', titulo: 'Conferencia inaugural: El Futuro de la medicina femenina.', subtitulo: 'Del microbioma a una nueva era de prevención, diagnóstico y medicina de precisión.', ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', codigoPais: 've', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '10:00 - 10:40', titulo: 'Lo que ocurre en el intestino, no se queda en el intestino.', subtitulo: 'Bases del microbioma intestinal y su impacto sistémico.', ponente: 'Dr. Marco Carvajal', especialidad: 'Médico Internista', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '10:40 - 11:20', titulo: 'Microbioma en crecimiento.', subtitulo: 'Interacciones entre microbioma, nutrición, inmunidad y desarrollo infantil.', ponente: 'Dr. Roberto Somocursio', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '11:20 - 11:50', titulo: 'Coffee Break', ponente: '', tipo: 'break' },
  { horario: '11:50 - 12:30', titulo: 'El ecosistema microbiano femenino.', subtitulo: 'Microbioma vaginal y endometrial: Bases biológicas, homeostasis y factores moduladores.', ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. María Gracia Acosta', tipo: 'conferencia' },
  { horario: '12:30 - 13:10', titulo: 'Transmisión Vertical Madre - Hijo.', bullets: ['¿Cómo influye la microbiota de la madre durante la gestación, parto?', 'Microbiota predominante durante el proceso de gestación.'], ponente: 'Dr. Juan Miguel Rodríguez Gómez', pais: 'España', codigoPais: 'es', moderador: 'Dra. María Gracia Acosta', tipo: 'conferencia' },
  { horario: '13:10 - 14:40', titulo: 'Almuerzo', ponente: '', tipo: 'almuerzo' },
  { horario: '14:40 - 15:20', titulo: 'Leche materna: Arquitecta del microbioma infantil.', subtitulo: 'Microbioma de la leche humana y desarrollo del ecosistema intestinal del lactante.', ponente: 'Dra. Beatriz Espin', pais: 'España', codigoPais: 'es', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '15:20 - 16:00', titulo: 'Modulando el microbioma reproductivo.', subtitulo: '¿Podemos mejorar los resultados reproductivos interviniendo sobre microbiota vaginal y endometrial?', ponente: 'Dra. Inmaculada Moreno', pais: 'España', codigoPais: 'es', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '16:00 - 16:40', titulo: 'Más allá de la composición microbiana.', subtitulo: 'Nuevas herramientas y aplicaciones en el estudio del microbioma vaginal y endometrial.', ponente: 'Dr. David Cotan', pais: 'España', codigoPais: 'es', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '16:40 - 17:10', titulo: 'Coffee Break', ponente: '', tipo: 'break' },
  { horario: '17:10 - 17:40', titulo: 'Nutrición en el microbioma femenino', subtitulo: '¿Cómo la alimentación modula el microbioma y sus metabolitos?', ponente: 'Ariadna Lopez', especialidad: 'Nutricionista', pais: 'Mexico', codigoPais: 'mx', moderador: 'Dra. Karina Coricaza', tipo: 'conferencia' },
  { horario: '17:40 - 18:10', titulo: 'Nutrición funcional, inflamación y metabolómica aplicada al microbioma.', subtitulo: 'La interacción entre nutrición, metabolismo, inflamación y ecosistema microbiano.', ponente: 'Lic. Yolanda Quintero', pais: 'Mexico', codigoPais: 'mx', moderador: 'Dra. Karina Coricaza', tipo: 'conferencia' },
  { horario: '18:10 - 18:40', titulo: 'Suplementación como herramienta de modulación en el microbioma femenino', ponente: 'Dra. Miluska Montalvo', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. Alesandra Huaquia', tipo: 'conferencia' },
  { horario: '18:40 - 19:10', titulo: 'Implementación clínica de programas nutricionales para restaurar el microbioma femenino', ponente: 'Lic. Karla Custodio', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. Alesandra Huaquia', tipo: 'conferencia' },
  { horario: '19:10 - 19:50', titulo: 'Mesa redonda: Nutrición, metabolismo y microbioma femenino.', subtitulo: '¿Hasta donde podemos modificar el microbioma a través de la nutrición?', ponente: 'Todos los ponentes del bloque', moderador: 'Dra. Alesandra Huaquia', tipo: 'mesa' }
]

const PROGRAMA_DIA_2: Sesion[] = [
  { horario: '09:00 - 09:40', titulo: 'El microbioma en la menopausia.', subtitulo: 'Hormonas, microbiota y transformación del ecosistema femenino.', ponente: 'Dr. Fernando Losa', pais: 'España', codigoPais: 'es', moderador: 'Dra. Vallerie Sanchez', tipo: 'conferencia' },
  { horario: '09:40 - 10:20', titulo: 'El impacto de los antibióticos en la microbiota.', subtitulo: 'Alteración de la microbiota intestinal y vaginal con el uso innecesario de antibióticos.', ponente: 'Dr. Christian Boggio Marzet', pais: 'Argentina', codigoPais: 'ar', moderador: 'Dra. Vallerie Sanchez', tipo: 'conferencia' },
  { horario: '09:40 - 10:20', titulo: 'Estudio del microbioma vaginal en el mundo y en Perú (Proyecto Laura)', subtitulo: '¿Qué hemos aprendido de más de 10 países?', ponente: 'Dra. Sandra Condori', pais: 'Bélgica', codigoPais: 'be', moderador: 'Dra. Liliana Díaz', tipo: 'conferencia' },
  { horario: '11:00 - 11:30', titulo: 'Coffee Break', ponente: '', tipo: 'break' },
  { horario: '11:30 - 12:10', titulo: 'Infecciones urinarias y microbioma.', subtitulo: 'El papel de la microbiota en pacientes con infecciones urinarias. Microbioma urinario.', ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', codigoPais: 'pe', moderador: 'Dra. Liliana Díaz', tipo: 'conferencia' },
  { horario: '12:10 - 12:50', titulo: 'Microbiota en la endometriosis.', bullets: ['El Rol de los Lactobacillus en la endometriosis', 'Epigenética en la endometriosis', 'Fisiopatología y manejo de la endometriosis con enfoque a la microbiota.'], ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', codigoPais: 've', moderador: 'Dr. Juan Cunya', tipo: 'conferencia' },
  { horario: '12:50 - 13:30', titulo: 'Infecciones vaginales: candidiasis recurrente.', bullets: ['Rol de la microbiota en la Candidiasis', 'Biofilms y resistencia antimicótica.', 'Importancia del Lactobacillus en infecciones crónicas.'], ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', codigoPais: 'pe', moderador: 'Dr. Juan Cunya', tipo: 'conferencia' },
  { horario: '13:30 - 15:00', titulo: 'Almuerzo', ponente: '', tipo: 'almuerzo' },
  { horario: '15:00 - 15:40', titulo: 'Metabolismo del estrógeno y la microbiota.', bullets: ['Estroboloma', 'Factores que alteran y mejoran el estroboloma.', 'Enfermedades relacionadas al estroboloma'], ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', codigoPais: 've', moderador: 'Dra. Sofia Saldaña', tipo: 'conferencia' },
  { horario: '15:40 - 16:20', titulo: 'Salud emocional, estrés crónico y microbioma femenino', ponente: 'Dra. Verónica Morin', pais: 'Uruguay', codigoPais: 'uy', moderador: 'Dra. Sofia Saldaña', tipo: 'conferencia' },
  { horario: '16:20 - 17:00', titulo: 'Microbiota, inmunidad y hormonas: Primer diálogo en la vida.', ponente: 'Dr. Fernando Medina', pais: 'Colombia', codigoPais: 'co', moderador: 'Marcela Ramos', tipo: 'conferencia' },
  { horario: '17:00 - 17:30', titulo: 'Clausura', ponente: '', tipo: 'clausura' }
]

export function AgendaSection() {
  const [diaActivo, setDiaActivo] = useState<1 | 2>(1)
  const sesiones = diaActivo === 1 ? PROGRAMA_DIA_1 : PROGRAMA_DIA_2
  const etiquetaDia = diaActivo === 1 ? '17 OCTUBRE' : '18 OCTUBRE'

  return (
    <section id="agenda" className="py-16 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Título de Sección */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#e0486c] tracking-tight">
          5. Programación
        </h2>
      </div>

      {/* Selector de Pestañas de Día */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setDiaActivo(1)}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border ${
            diaActivo === 1
              ? 'bg-[#e0486c] text-white border-[#e0486c] shadow-md shadow-[#e0486c]/20'
              : 'bg-white/80 dark:bg-slate-900/80 text-[#e0486c] border-[#f5b8c7] hover:bg-[#fff0f4]'
          }`}
        >
          Día 1 · 17 de Octubre
        </button>
        <button
          onClick={() => setDiaActivo(2)}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border ${
            diaActivo === 2
              ? 'bg-[#e0486c] text-white border-[#e0486c] shadow-md shadow-[#e0486c]/20'
              : 'bg-white/80 dark:bg-slate-900/80 text-[#e0486c] border-[#f5b8c7] hover:bg-[#fff0f4]'
          }`}
        >
          Día 2 · 18 de Octubre
        </button>
      </div>

      {/* Encabezado Superior Sticky (Alineado milimétricamente con el cuerpo) */}
      <div className="hidden md:block sticky top-16 z-30 mb-3 rounded-2xl border border-[#f5b8c7] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-4 text-[#915569] dark:text-[#f7a8bc] font-bold text-xs uppercase tracking-widest text-left">
          {/* Espacio reservado para la columna DÍA */}
          <div className="w-14 shrink-0 text-center">DÍA</div>
          {/* Espacio reservado para HORARIO */}
          <div className="w-[140px] shrink-0 pl-2">HORARIO</div>
          {/* Espacio reservado para TEMA */}
          <div className="flex-1 pl-2">TEMA</div>
          {/* Espacio reservado para RESPONSABLE */}
          <div className="w-[260px] shrink-0 pl-4">RESPONSABLE</div>
        </div>
      </div>

      {/* Contenedor Principal: Columna Lateral de Día + Lista de Cápsulas */}
      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Columna Vertical Lateral: Sticky mientras se navega el listado */}
        <div className="w-12 sm:w-16 shrink-0 sticky top-32 rounded-3xl border-2 border-[#f7a8bc] bg-white/70 dark:bg-slate-900/70 flex items-center justify-center py-10 shadow-sm">
          <span className="[writing-mode:vertical-rl] rotate-180 font-black text-xl sm:text-2xl tracking-[0.25em] text-[#e0486c] select-none">
            {etiquetaDia}
          </span>
        </div>

        {/* Bloque de Filas / Cápsulas */}
        <div className="flex-1 space-y-3">
          {sesiones.map((s, idx) => {
            const esDescanso = ['registro', 'break', 'almuerzo', 'apertura', 'clausura'].includes(s.tipo || '') && !s.ponente

            return (
              <div
                key={idx}
                className="rounded-3xl border border-[#f7a8bc] bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#e0486c] transition-all flex flex-col md:flex-row md:items-center gap-3 sm:gap-4"
              >
                {/* 1. Columna Horario: Ancho fijo igual al header (140px) */}
                <div className="w-full md:w-[140px] shrink-0 text-xs sm:text-sm font-bold text-[#e0486c] whitespace-nowrap pl-0 md:pl-2">
                  {s.horario}
                </div>

                {/* 2. Columna Tema y Contenido: Flexible */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                    {s.titulo}
                  </p>

                  {s.subtitulo && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {s.subtitulo}
                    </p>
                  )}

                  {s.bullets && s.bullets.length > 0 && (
                    <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5 pt-1">
                      {s.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 3. Columna Responsable / Ponente: Ancho fijo igual al header (260px) */}
                {!esDescanso ? (
                  <div className="w-full md:w-[260px] shrink-0 flex items-start justify-between gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-[#fce3eb] pl-0 md:pl-4">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {s.ponente}
                      </p>

                      {s.especialidad && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.especialidad}
                        </p>
                      )}

                      {s.pais && (
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {s.pais}
                        </p>
                      )}

                      {s.moderador && (
                        <div className="pt-1 text-[11px] leading-tight text-[#e0486c]">
                          <span className="opacity-80 block">Moderador:</span>
                          <span className="font-medium">{s.moderador}</span>
                        </div>
                      )}
                    </div>

                    {/* Bandera Redonda del País */}
                    {s.codigoPais && BANDERA_SVG[s.codigoPais] && (
                      <div className="pt-0.5">
                        {BANDERA_SVG[s.codigoPais]}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:block w-[260px] shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
