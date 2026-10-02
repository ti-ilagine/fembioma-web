import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceso a Grabaciones · FEMBIOMA World Summit 2026',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GrabacionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
