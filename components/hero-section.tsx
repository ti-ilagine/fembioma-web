'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, Clock, Award, Calendar } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/config'

const SLIDES = [
  {
    src: '/hero-doctores.png',
    alt: 'Doctores especialistas ponentes en el Congreso Fembioma',
  },
  {
    src: '/hero-organizadores.png',
    alt: 'Comité y entidades organizadoras del Congreso Fembioma',
  },
  {
    src: '/hero-mujer-microbiota.png',
    alt: 'Ilustración de una mujer entrelazada con una hélice de ADN y microbiota, representando la medicina de precisión femenina.',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        {/* Text column */}
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-emphasis sm:text-sm">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-balance">
              ¡Tarifas de Pronto Pago válidas hasta el 15 de Septiembre!
            </span>
          </div>

          <h1 className="font-serif leading-tight tracking-tight">
            {/* Título principal con el rosa fuerte (#f06d84) */}
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-[#f06d84]">
              FEMBIOMA World Summit 2026
            </span>

            {/* Subtítulo en tamaño 38px (o responsivo hasta 38px) y gris medio */}
            <span className="block text-2xl sm:text-3xl lg:text-[36px] font-normal text-gray-600 mt-3">
              Congreso Latinoamericano de Microbiota Femenina y Medicina de Precisión.
            </span>
          </h1>

          {/* Fecha y Sede */}
          <div className="mt-6 flex items-center justify-center gap-2 text-base font-semibold text-emphasis sm:text-lg lg:justify-start">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>17 y 18 de Octubre, 2026 • Lima, Perú</span>
          </div>

          <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            Certificación oficial con horas académicas avalada por el Colegio Médico del Perú{' '}
            <span className="font-medium text-foreground">(CRXI - Huaraz).</span>
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-animated group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Inscribirme Ahora
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#agenda"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-8 py-4 text-base font-semibold text-emphasis transition-colors hover:bg-secondary sm:w-auto"
            >
              Ver Agenda
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-primary" aria-hidden="true" />
            Ponentes internacionales · 2 días · Presencial y online
          </div>
        </div>

        {/* Featured image container / Slider */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-secondary shadow-xl shadow-primary/10">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'pointer-events-none opacity-0 z-0'
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}

            {/* Indicadores de diapositiva */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-primary/30'
                  }`}
                  aria-label={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
