'use client'

import { ArrowRight, Dna } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/config'
import { trackPixelEvent } from '@/lib/pixel'

export function FooterCTA() {
  return (
    <footer>
      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Asegura tu cupo con la tarifa de pronto pago
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Únete a FEMBIOMA World Summit y forma parte de una nueva era en la medicina de
            precisión femenina. Las tarifas de pronto pago vencen el 15 de Septiembre.
          </p>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackPixelEvent('Lead', {
                content_name: 'Inscripción Fembioma 2026 - Banner Footer CTA',
              })
            }}
            className="cta-animated cta-animated-invert group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-4 text-base font-semibold text-primary"
          >
            Registrarme Ahora
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:text-left lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dna className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-serif text-base font-semibold text-emphasis">
              FEMBIOMA <span className="text-primary">World Summit</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Avalado por el Colegio Médico del Perú (CRXI - Huaraz) ·{' '}
            {new Date().getFullYear()} FEMBIOMA World Summit
          </p>
        </div>
      </div>
    </footer>
  )
}
