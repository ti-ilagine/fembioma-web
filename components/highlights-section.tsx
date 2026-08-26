import Image from 'next/image'
import { CalendarCheck, ScrollText, MonitorCheck } from 'lucide-react'

const highlights = [
  {
    icon: CalendarCheck,
    title: 'Asistencia mínima del 80%',
    description:
      'Acredita tu participación asistiendo al menos al 80% de las sesiones académicas del congreso.',
  },
  {
    icon: ScrollText,
    title: 'Certificación con valor académico',
    description:
      'Certificado oficial con horas académicas avalado por el Colegio Médico del Perú (CRXI - Huaraz).',
  },
  {
    icon: MonitorCheck,
    title: 'Cuestionario virtual',
    description:
      'Completa un cuestionario virtual de evaluación para consolidar y validar tus aprendizajes.',
  },
]

export function HighlightsSection() {
  return (
    <section id="certificacion" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Aval académico
        </p>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
          Requisitos para tu certificación
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
          >
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">{item.title}</h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {/* Enfoque científico: Eje Intestino-Vagina */}
      <div className="mt-16 grid items-center gap-8 overflow-hidden rounded-3xl border border-border bg-secondary/60 p-6 sm:p-10 lg:mt-24 lg:grid-cols-2 lg:gap-12">
        <div className="relative order-last aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card lg:order-first">
          <Image
            src="/gut-vagina-axis.png"
            alt="Gráfico del eje intestino-vagina que ilustra la conexión del microbioma en la salud femenina."
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Enfoque científico
          </p>
          <h3 className="text-balance font-serif text-2xl font-semibold tracking-tight text-emphasis sm:text-3xl">
            El eje intestino-vagina y la conexión del microbioma
          </h3>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Exploraremos cómo la microbiota intestinal y vaginal se comunican e influyen en la
            inmunidad, el equilibrio hormonal y la salud reproductiva. Un abordaje integral que
            conecta la evidencia molecular con la práctica clínica diaria.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Disbiosis y su impacto en enfermedades ginecológicas
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Diagnóstico molecular y biomarcadores
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Terapias moduladoras y prevención personalizada
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
