'use client'

import { MapPin } from 'lucide-react'

interface Ponente {
  iniciales: string
  nombre: string
  cargo?: string
  pais: string
}

const FACULTY_LIST: Ponente[] = [
  { iniciales: 'AD', nombre: 'Dra. Annalisa Di Rocco', cargo: 'Ginecología Funcional y Regenerativa', pais: 'Venezuela' },
  { iniciales: 'CH', nombre: 'Dr. Cristian Hidalgo Pajuelo', cargo: 'Ginecólogo Obstetra · Dir. Ilagine', pais: 'Perú' },
  { iniciales: 'MC', nombre: 'Dr. Marco Carvajal', cargo: 'Médico Internista', pais: 'Perú' },
  { iniciales: 'RS', nombre: 'Dr. Roberto Somocursio', cargo: 'Pediatra · Microbiota Infantil', pais: 'Perú' },
  { iniciales: 'JR', nombre: 'Dr. Juan Miguel Rodríguez Gómez', cargo: 'Catedrático · Microbiota Humana', pais: 'España' },
  { iniciales: 'BE', nombre: 'Dra. Beatriz Espín', cargo: 'Gastroenterología y Nutrición Pediátrica', pais: 'España' },
  { iniciales: 'IM', nombre: 'Dra. Inmaculada Moreno', cargo: 'Investigadora en Microbioma Reproductivo', pais: 'España' },
  { iniciales: 'DC', nombre: 'Dr. David Cotán', cargo: 'Biotecnología y Metagenómica', pais: 'España' },
  { iniciales: 'FL', nombre: 'Dr. Fernando Losa', cargo: 'Ginecólogo · Experto en Menopausia', pais: 'España' },
  { iniciales: 'AL', nombre: 'Ariadna López', cargo: 'Nutricionista Funcional', pais: 'México' },
  { iniciales: 'YQ', nombre: 'Lic. Yolanda Quintero', cargo: 'Nutrición y Metabolómica', pais: 'México' },
  { iniciales: 'CB', nombre: 'Dr. Christian Boggio Marzet', cargo: 'Gastroenterólogo Pediatra', pais: 'Argentina' },
  { iniciales: 'SC', nombre: 'Dra. Sandra Condori', cargo: 'Bióloga Molecular · Proyecto Laura', pais: 'Bélgica' },
  { iniciales: 'VM', nombre: 'Dra. Verónica Morín', cargo: 'Salud Emocional y Psiconeuroinmunología', pais: 'Uruguay' },
  { iniciales: 'FM', nombre: 'Dr. Fernando Medina', cargo: 'Inmunología y Microbiota', pais: 'Colombia' },
  { iniciales: 'MM', nombre: 'Dra. Miluska Montalvo', cargo: 'Medicina Integrativa y Suplementación', pais: 'Perú' },
]

export function FacultySection() {
  return (
    <section id="ponentes" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e0486c]">
          FACULTY INTERNACIONAL
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#4a233b] sm:text-4xl">
          Ponentes internacionales
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Especialistas de referencia de 8 países compartiendo la evidencia más reciente en microbioma y medicina de precisión femenina.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FACULTY_LIST.map((p, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between rounded-3xl border border-[#f8d7df] bg-[#fff5f7] p-6 text-center transition-all hover:border-[#f0859c] hover:shadow-md"
          >
            <div className="flex flex-col items-center">
              {/* Círculo de iniciales */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f06d84] text-base font-bold text-white shadow-sm">
                {p.iniciales}
              </div>

              {/* Nombre y Cargo */}
              <h3 className="font-serif text-base font-bold text-[#4a233b] leading-snug">
                {p.nombre}
              </h3>
              {p.cargo && (
                <p className="mt-1 text-xs text-slate-500 leading-tight">
                  {p.cargo}
                </p>
              )}
            </div>

            {/* Píldora de País */}
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#f8d7df] bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              <MapPin className="h-3 w-3 text-[#f06d84]" />
              <span>{p.pais}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
