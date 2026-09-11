import Script from 'next/script'
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
  metadataBase: new URL('https://fembioma.com'),
  alternates: {
    canonical: '/',
  },
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

        {/* Meta Pixel Base Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2523768638089235');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2523768638089235&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
