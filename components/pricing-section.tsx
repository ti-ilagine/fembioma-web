'use client'

import { Check, Building2, Wifi } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/config'
import { trackPixelEvent } from '@/lib/pixel'

type Tier = {
  role: string
  soles: string
  usd: string
  featured?: boolean
}

type Plan = {
  mode: string
  icon: typeof Building2
  note: string
  tiers: Tier[]
}

const plans: Plan[] = [
  {
    mode: 'Presencial',
    icon: Building2,
    note: 'Incluye materiales, coffee break y networking.',
    tiers: [
      {
        role: 'Médicos',
        soles: 'S/. 450',
        usd: '$140',
        featured: true,
      },
      { role: 'Otros profesionales', soles: 'S/. 350', usd: '$120' },
      { role: 'Estudiantes', soles: 'S/. 250', usd: '$80' },
    ],
  },
  {
    mode: 'Online',
    icon: Wifi,
    note: 'Acceso en vivo a todas las sesiones y certificación digital.',
    tiers: [
      {
        role: 'Médicos',
        soles: 'S/. 350',
        usd: '$120',
        featured: true,
      },
      { role: 'Otros profesionales', soles: 'S/. 300', usd: '$100' },
      { role: 'Estudiantes', soles: 'S/. 200', usd: '$60' },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="precios" className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Inversión
        </p>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
          Elige tu modalidad de participación
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Tarifas regulares de inscripción oficial para el congreso.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.mode}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <plan.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-emphasis">{plan.mode}</h3>
                <p className="text-xs text-muted-foreground">{plan.note}</p>
              </div>
            </div>

            <ul className="flex flex-1 flex-col gap-3">
              {plan.tiers.map((tier) => (
                <li
                  key={tier.role}
                  className={`rounded-2xl border p-4 ${
                    tier.featured
                      ? 'border-primary/50 bg-accent'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                      {tier.role}
                    </span>
                    {tier.featured && (
                      <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                        Más elegido
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-serif text-2xl font-bold text-emphasis">
                        {tier.soles}
                        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                          / {tier.usd} USD
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackPixelEvent('Lead', {
                  content_name: `Inscripción Fembioma 2026 - Modalidad ${plan.mode}`,
                  plan_type: plan.mode,
                })
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              Inscribirme ({plan.mode})
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
