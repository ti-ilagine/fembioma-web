'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Award, CheckCircle2 } from 'lucide-react'

interface Sesion {
  horario: string
  titulo: string
  ponente: string
  pais?: string
  moderador?: string
  tipo?: 'conferencia' | 'break' | 'mesa'
}

const PROGRAMA_DIA_1: Sesion[] = [
  { horario: '08:00 - 09:00', titulo: 'Mesa de Registro de Participantes', ponente: 'Comité Organizador', tipo: 'break' },
  { horario: '09:00 - 09:20', titulo: 'Palabras de Bienvenida, Inauguración y Video de Apertura', ponente: 'Decano Colegio Médico del Perú', tipo: 'conferencia' },
  { horario: '09:20 - 10:00', titulo: 'Conferencia Inaugural: El Futuro de la medicina femenina. Del microbioma a una nueva era de prevención, diagnóstico y medicina de precisión', ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '10:00 - 10:40', titulo: 'Lo que ocurre en el intestino, no se queda en el intestino. Bases del microbioma intestinal y su impacto sistémico', ponente: 'Dr. Marco Carvajal', pais: 'Perú', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '10:40 - 11:20', titulo: 'Microbioma en crecimiento: Interacciones entre microbioma, nutrición, inmunidad y desarrollo infantil', ponente: 'Dr. Roberto Somocursio', pais: 'Perú', moderador: 'Dra. Allyson Montenegro', tipo: 'conferencia' },
  { horario: '11:20 - 11:50', titulo: 'Coffee Break', ponente: 'Espacio de Networking', tipo: 'break' },
  { horario: '11:50 - 12:30', titulo: 'El ecosistema microbiano femenino. Microbioma vaginal y endometrial: Bases biológicas, homeostasis y factores moduladores', ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', moderador: 'Dra. María Gracia Acosta', tipo: 'conferencia' },
  { horario: '12:30 - 13:10', titulo: 'Transmisión Vertical Madre - Hijo: Influencia de la microbiota durante la gestación y parto', ponente: 'Dr. Juan Miguel Rodríguez Gómez', pais: 'España', moderador: 'Dra. María Gracia Acosta', tipo: 'conferencia' },
  { horario: '13:10 - 14:40', titulo: 'Almuerzo Libre', ponente: 'Receso general', tipo: 'break' },
  { horario: '14:40 - 15:20', titulo: 'Leche materna: Arquitecta del microbioma infantil y desarrollo del ecosistema intestinal del lactante', ponente: 'Dra. Beatriz Espin', pais: 'España', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '15:20 - 16:00', titulo: 'Modulando el microbioma reproductivo: ¿Podemos mejorar los resultados reproductivos interviniendo sobre microbiota vaginal y endometrial?', ponente: 'Dra. Inmaculada Moreno', pais: 'España', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '16:00 - 16:40', titulo: 'Nuevas herramientas y aplicaciones en el estudio del microbioma vaginal y endometrial', ponente: 'Dr. David Cotan', pais: 'España', moderador: 'Dra. Yessica Quispe', tipo: 'conferencia' },
  { horario: '16:40 - 17:10', titulo: 'Coffee Break', ponente: 'Receso de tarde', tipo: 'break' },
  { horario: '17:10 - 17:40', titulo: 'Nutrición en el microbioma femenino: ¿Cómo la alimentación modula el microbioma y sus metabolitos?', ponente: 'Nut. Ariadna López', pais: 'México', moderador: 'Dra. Karina Coricaza', tipo: 'conferencia' },
  { horario: '17:40 - 18:10', titulo: 'Nutrición funcional, inflamación y metabolómica aplicada al microbioma', ponente: 'Lic. Yolanda Quintero', pais: 'México', moderador: 'Dra. Karina Coricaza', tipo: 'conferencia' },
  { horario: '18:10 - 18:40', titulo: 'Suplementación como herramienta de modulación en el microbioma femenino', ponente: 'Dra. Miluska Montalvo', pais: 'Perú', moderador: 'Dra. Alesandra Huaquia', tipo: 'conferencia' },
  { horario: '18:40 - 19:10', titulo: 'Implementación clínica de programas nutricionales para restaurar el microbioma femenino', ponente: 'Lic. Karla Custodio', pais: 'Perú', moderador: 'Dra. Alesandra Huaquia', tipo: 'conferencia' },
  { horario: '19:10 - 19:50', titulo: 'Mesa Redonda: Nutrición, metabolismo y microbioma femenino. ¿Hasta dónde podemos modificar el microbioma a través de la nutrición?', ponente: 'Todos los ponentes del bloque', moderador: 'Dra. Alesandra Huaquia', tipo: 'mesa' },
]

const PROGRAMA_DIA_2: Sesion[] = [
  { horario: '09:00 - 09:40', titulo: 'El microbioma en la menopausia: Hormonas, microbiota y transformación del ecosistema femenino', ponente: 'Dr. Fernando Losa', pais: 'España', moderador: 'Dra. Valerie Sánchez', tipo: 'conferencia' },
  { horario: '09:40 - 10:20', titulo: 'El impacto de los antibióticos en la microbiota: Alteración intestinal y vaginal por uso innecesario', ponente: 'Dr. Christian Boggio Marzet', pais: 'Argentina', moderador: 'Dra. Valerie Sánchez', tipo: 'conferencia' },
  { horario: '10:20 - 11:00', titulo: 'Estudio del microbioma vaginal en el mundo y en Perú (Proyecto Laura): ¿Qué hemos aprendido de más de 10 países?', ponente: 'Dra. Sandra Condori', pais: 'Bélgica', moderador: 'Dra. Liliana Díaz', tipo: 'conferencia' },
  { horario: '11:00 - 11:30', titulo: 'Coffee Break', ponente: 'Espacio de Networking', tipo: 'break' },
  { horario: '11:30 - 12:10', titulo: 'Infecciones urinarias y microbioma: El papel de la microbiota urinaria en la recurrencia', ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', moderador: 'Dra. Liliana Díaz', tipo: 'conferencia' },
  { horario: '12:10 - 12:50', titulo: 'Microbiota en la endometriosis: Rol de Lactobacillus, epigenética, fisiopatología y manejo clínico', ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', moderador: 'Dr. Juan Cunya', tipo: 'conferencia' },
  { horario: '12:50 - 13:30', titulo: 'Infecciones vaginales: Candidiasis recurrente, biofilms, resistencia antimicótica y rol de Lactobacillus', ponente: 'Dr. Cristian Hidalgo Pajuelo', pais: 'Perú', moderador: 'Dr. Juan Cunya', tipo: 'conferencia' },
  { horario: '13:30 - 15:00', titulo: 'Almuerzo Libre', ponente: 'Receso general', tipo: 'break' },
  { horario: '15:00 - 15:40', titulo: 'Metabolismo del estrógeno y la microbiota: Estroboloma y patologías asociadas', ponente: 'Dra. Annalisa Di Rocco', pais: 'Venezuela', moderador: 'Dra. Sofía Saldaña', tipo: 'conferencia' },
  { horario: '15:40 - 16:20', titulo: 'Salud emocional, estrés crónico y microbioma femenino', ponente: 'Dra. Verónica Morin', pais: 'Uruguay', moderador: 'Dra. Sofía Saldaña', tipo: 'conferencia' },
  { horario: '16:20 - 17:00', titulo: 'Microbiota, inmunidad y hormonas: Primer diálogo en la vida', ponente: 'Dr. Fernando Medina', pais: 'Colombia', moderador: 'Lic. Marcela Ramos', tipo: 'conferencia' },
  { horario: '17:00 - 17:30', titulo: 'Clausura Oficial del Summit y Entrega de Directivas Académicas', ponente: 'Comité Científico y Directivo', tipo: 'conferencia' },
]

export function AgendaSection() {
  const [diaActivo, setDiaActivo] = useState<1 | 2>(1)
  const sesiones = diaActivo === 1 ? PROGRAMA_DIA_1 : PROGRAMA_DIA_2

  return (
    <section id="agenda" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-emphasis text-xs font-semibold uppercase tracking-wider mb-3">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Programa Oficial Actualizado
        </span>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
          Programa Científico y Académico
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          III Curso Internacional de Microbiota Vaginal & II Curso de Microbiota y Nutrición · 17 y 18 de Octubre
        </p>
      </div>

      {/* Selector de Días */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => setDiaActivo(1)}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            diaActivo === 1
              ? 'bg-[#f06d84] text-white shadow-lg shadow-[#f06d84]/25'
              : 'bg-card border border-border text-muted-foreground hover:text-emphasis hover:bg-secondary'
          }`}
        >
          Día 1 · Sábado 17 de Octubre
        </button>
        <button
          onClick={() => setDiaActivo(2)}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            diaActivo === 2
              ? 'bg-[#f06d84] text-white shadow-lg shadow-[#f06d84]/25'
              : 'bg-card border border-border text-muted-foreground hover:text-emphasis hover:bg-secondary'
          }`}
        >
          Día 2 · Domingo 18 de Octubre
        </button>
      </div>

      {/* Lista de Sesiones */}
      <div className="space-y-3">
        {sesiones.map((s, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              s.tipo === 'break'
                ? 'bg-secondary/40 border-border/50 opacity-75'
                : 'bg-card border-border hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-emphasis font-mono text-xs shrink-0 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {s.horario}
              </span>
              <div>
                <h4 className="text-emphasis text-sm font-semibold leading-snug">{s.titulo}</h4>
                {s.moderador && (
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Moderador: {s.moderador}
                  </span>
                )}
              </div>
            </div>

            {s.ponente && (
              <div className="sm:text-right shrink-0 pl-11 sm:pl-0">
                <p className="text-xs font-semibold text-emphasis flex items-center sm:justify-end gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {s.ponente}
                </p>
                {s.pais && (
                  <span className="text-[11px] text-primary font-medium block">
                    {s.pais}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
