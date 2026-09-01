import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FEMBIOMA World Summit 2026 | Microbioma, Nutrición y Medicina de Precisión Femenina',
  description:
    'Congreso internacional de microbiota, nutrición y medicina de precisión femenina, liderado por el Dr. Cristian Hidalgo. Avalado por el Colegio Médico del Perú (CRXI - Huaraz). 17 y 18 de Octubre, Hotel Sheraton Lima.',
  keywords: [
    'FEMBIOMA',
    'Cristian Hidalgo',
    'microbiota',
    'nutrición funcional',
    'ginecología funcional',
    'medicina de precisión',
    'congreso médico lima 2026',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7e5097',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'FEMBIOMA World Summit 2026',
  description:
    'Congreso internacional de microbiota, nutrición y medicina de precisión femenina.',
  startDate: '2026-10-17T08:00:00-05:00',
  endDate: '2026-10-18T18:00:00-05:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Hotel Sheraton Lima',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lima',
      addressCountry: 'PE',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Ilagine',
    url: 'https://ilagine.com',
  },
  performer: {
    '@type': 'Person',
    name: 'Dr. Cristian Hidalgo',
    jobTitle: 'Médico Ginecólogo y Obstetra',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
