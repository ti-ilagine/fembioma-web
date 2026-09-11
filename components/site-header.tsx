'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/config'
import { trackPixelEvent } from '@/lib/pixel'

const navLinks = [
  { label: 'Agenda', href: '#agenda' },
  { label: 'Ponentes', href: '#ponentes' },
  { label: 'Certificación', href: '#certificacion' },
  { label: 'Precios', href: '#precios' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">

        {/* LOGO FEMBIOMA */}
        <a href="#top" className="flex shrink-0 items-center">
          <img
            src="/logo-fembioma.png"
            alt="Fembioma - Congreso Mundial de Microbioma Femenino"
            className="h-10 w-auto object-contain sm:h-12 lg:h-14"
          />
        </a>

        {/* MENÚ DE ESCRITORIO */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* LADO DERECHO */}
        <div className="flex items-center gap-3">

          {/* BOTÓN REGISTRARME (DESKTOP) */}
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackPixelEvent('Lead', {
                content_name: 'Inscripción Fembioma 2026 - Header Desktop',
              })
            }}
            className="cta-animated hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:inline-flex"
          >
            Registrarme
          </a>

          {/* LOGOS INSTITUCIONALES */}
          <div className="hidden items-center gap-4 border-l border-border/60 pl-4 md:flex">

            <img
              src="/logo-cmh.png"
              alt="Colegio Médico del Perú - Consejo Regional XI Huaraz"
              className="h-11 w-auto object-contain lg:h-12"
              title="Colegio Médico del Perú - CR XI Huaraz"
            />

            <img
              src="/logo-ilagine.png"
              alt="ILAGINE"
              className="h-9 w-auto object-contain lg:h-10"
              title="ILAGINE"
            />

          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-emphasis lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3"
            aria-label="Móvil"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}

            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackPixelEvent('Lead', {
                  content_name: 'Inscripción Fembioma 2026 - Header Móvil',
                })
              }}
              className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Registrarme
            </a>

            {/* LOGOS EN MÓVIL */}
            <div className="mt-4 flex items-center justify-center gap-6 border-t border-border/60 pt-4">
              <img
                src="/logo-cmh.png"
                alt="Colegio Médico del Perú - CR XI Huaraz"
                className="h-12 w-auto object-contain"
              />

              <img
                src="/logo-ilagine.png"
                alt="ILAGINE"
                className="h-10 w-auto object-contain"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
