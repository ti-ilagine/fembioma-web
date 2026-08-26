import { MapPin } from 'lucide-react'

type Speaker = {
  name: string
  profession?: string
  country: string
}

const speakers: Speaker[] = [
  { name: 'Dra. Annalisa Di Rocco', country: 'Venezuela' },
  { name: 'Dr. Cristian Hidalgo Pajuelo', country: 'Perú' },
  { name: 'Dr. Marco Carvajal', profession: 'Médico Internista', country: 'Perú' },
  { name: 'Dr. Roberto Somocursio', country: 'Perú' },
  { name: 'Dra. Beatriz Espín', country: 'España' },
  { name: 'Dra. Inmaculada Moreno', country: 'España' },
  { name: 'Dr. David Cotán', country: 'España' },
  { name: 'Dr. Fernando Losa', country: 'España' },
  { name: 'Dr. Christian Boggio Marzet', country: 'Argentina' },
  { name: 'Dra. Sandra Condori', profession: 'Bióloga', country: 'Bélgica' },
  { name: 'Dra. Verónica Morín', country: 'Uruguay' },
  { name: 'Dr. Fernando Medina', country: 'Colombia' },
  { name: 'Ariadna López', profession: 'Nutricionista', country: 'México' },
  { name: 'Lic. Yolanda Quintero', country: 'México' },
  { name: 'Dra. Miluska Montalvo', country: 'Perú' },
  { name: 'Lic. Karla Custodio', country: 'Perú' },
]

function getInitials(name: string): string {
  const words = name
    .replace(/^(Dra?\.|Lic\.)\s*/i, '')
    .trim()
    .split(/\s+/)
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function FacultySection() {
  return (
    <section id="ponentes" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Faculty internacional
        </p>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
          Ponentes internacionales
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Especialistas de referencia de 8 países compartiendo la evidencia más reciente en
          microbioma y medicina de precisión femenina.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {speakers.map((speaker) => (
          <article
            key={speaker.name}
            className="flex flex-col items-center rounded-2xl border border-primary/40 bg-secondary p-6 text-center transition-shadow hover:shadow-md"
          >
            <span
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {getInitials(speaker.name)}
            </span>
            <h3 className="font-serif text-base font-semibold leading-snug text-emphasis">
              {speaker.name}
            </h3>
            {speaker.profession && (
              <p className="mt-1 text-xs font-medium text-muted-foreground">{speaker.profession}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-emphasis">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {speaker.country}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
