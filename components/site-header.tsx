'use client'

import { useState } from 'react'
import { Menu, X, Dna } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/config'

const navLinks = [
  { label: 'Agenda', href: '#agenda' },
  { label: 'Ponentes', href: '#ponentes' },
  { label: 'Certificación', href: '#certificacion' },
  { label: 'Precios', href: '#precios' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dna className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-base font-semibold leading-none tracking-tight text-emphasis sm:text-lg">
            FEMBIOMA <span className="text-primary">World Summit</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-emphasis"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Logos oficiales integrados directamente */}
          <div className="hidden items-center gap-4 border-r border-border/60 pr-4 md:flex">
            <img
              src="/logo-cmh.png"
              alt="CMP CRXI Huaraz"
              className="h-8 w-auto object-contain transition-opacity hover:opacity-85"
              title="Colegio Médico del Perú (CRXI - Huaraz)"
            />
            <img
              src="/logo-ilagine.png"
              alt="Ilagine"
              className="h-7 w-auto object-contain transition-opacity hover:opacity-85"
              title="Ilagine"
            />
          </div>

          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-animated hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            Registrarme
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-emphasis lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3" aria-label="Móvil">
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
              className="mt-1 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Registrarme
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
