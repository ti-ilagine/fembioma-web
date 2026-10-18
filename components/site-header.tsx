'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Video, Users } from 'lucide-react'

const navLinks = [
  { label: 'Agenda', href: '#agenda' },
  { label: 'Ponentes', href: '#ponentes' },
  { label: 'Certificación', href: '#certificacion' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const SOCIEDAD_FORM_URL = 'https://forms.cloud.microsoft/r/vRHTWj7aSG'

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

        {/* MENÚ DE ESCRITORIO (PC) */}
        <nav
          className="hidden items-center gap-6 lg:flex"
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

          {/* BOTÓN: SOCIEDAD DE MICROBIOMA (Visible solo en PC) */}
          <a
            href={SOCIEDAD_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Sociedad de Microbioma</span>
          </a>
        </nav>

        {/* LADO DERECHO */}
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* BOTÓN DESTACADO: GRABACIONES (Visible en Móvil y PC) */}
          <Link
            href="/grabaciones"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:px-5 sm:py-2 sm:text-sm"
          >
            <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Grabaciones</span>
          </Link>

          {/* LOGOS INSTITUCIONALES (SOLO PC / TABLET) */}
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

          {/* BOTÓN MENÚ MÓVIL (Hamburguesa) */}
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

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1.5 px-5 py-4"
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

            {/* OPCIÓN DENTRO DE LA HAMBURGUESA EN MÓVIL */}
            <a
              href={SOCIEDAD_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
            >
              <Users className="h-4 w-4" />
              <span>Sociedad Peruana de Microbioma</span>
            </a>

            {/* LOGOS EN MENÚ MÓVIL */}
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
