import { Globe } from 'lucide-react'

type Slot = { time: string; title: string; speaker?: string; country?: string }

const days: { label: string; date: string; slots: Slot[] }[] = [
  {
    label: 'Día 1',
    date: 'Microbioma y salud femenina',
    slots: [
      { time: '08:30', title: 'Acreditación y bienvenida' },
      {
        time: '09:00',
        title: 'El microbioma vaginal como eje de la salud reproductiva',
        speaker: 'Dra. Inmaculada Moreno',
        country: 'España',
      },
      {
        time: '10:30',
        title: 'Disbiosis, inmunidad y enfermedades ginecológicas',
        speaker: 'Dra. Annalisa Di Rocco',
        country: 'Venezuela',
      },
      {
        time: '12:00',
        title: 'Microbiota intestinal y su impacto en la salud hormonal',
        speaker: 'Dr. Christian Boggio Marzet',
        country: 'Argentina',
      },
      {
        time: '15:00',
        title: 'Diagnóstico molecular del microbioma: casos clínicos',
        speaker: 'Dr. Cristian Hidalgo Pajuelo',
        country: 'Perú',
      },
      {
        time: '16:30',
        title: 'Nutrición y modulación de la microbiota femenina',
        speaker: 'Ariadna López',
        country: 'México',
      },
    ],
  },
  {
    label: 'Día 2',
    date: 'Diagnóstico, prevención y medicina de precisión',
    slots: [
      {
        time: '09:00',
        title: 'Biomarcadores y medicina de precisión femenina',
        speaker: 'Dr. David Cotán',
        country: 'España',
      },
      {
        time: '10:30',
        title: 'Nuevas terapias moduladoras del microbioma',
        speaker: 'Dra. Sandra Condori',
        country: 'Bélgica',
      },
      {
        time: '12:00',
        title: 'Prevención personalizada: del laboratorio a la consulta',
        speaker: 'Dr. Fernando Losa',
        country: 'España',
      },
      {
        time: '15:00',
        title: 'Abordaje clínico integral del eje intestino-vagina',
        speaker: 'Dra. Verónica Morín',
        country: 'Uruguay',
      },
      {
        time: '16:30',
        title: 'Mesa redonda internacional y conclusiones',
        speaker: 'Panel de ponentes',
        country: 'Internacional',
      },
      { time: '18:00', title: 'Cuestionario virtual y clausura' },
    ],
  },
]

const countries = [
  'Venezuela',
  'Perú',
  'España',
  'Argentina',
  'Bélgica',
  'Uruguay',
  'Colombia',
  'México',
]

export function AgendaSection() {
  return (
    <section id="agenda" className="bg-secondary/60 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Programa · 2 días
          </p>
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
            Agenda académica del congreso
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Ponentes internacionales de primer nivel compartiendo la evidencia más reciente.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {countries.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground"
            >
              <Globe className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {c}
            </span>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {days.map((day) => (
            <div key={day.label} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-6 border-b border-border pb-4">
                <span className="font-serif text-2xl font-semibold text-emphasis">{day.label}</span>
                <p className="mt-1 text-sm text-muted-foreground">{day.date}</p>
              </div>
              <ol className="space-y-5">
                {day.slots.map((slot, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 pt-0.5 font-mono text-sm font-semibold tabular-nums text-primary">
                      {slot.time}
                    </span>
                    <div>
                      <p className="text-pretty text-sm font-medium leading-snug text-foreground">
                        {slot.title}
                      </p>
                      {slot.speaker && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {slot.speaker}
                          {slot.country && (
                            <span className="text-primary"> · {slot.country}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
