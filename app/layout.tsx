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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
