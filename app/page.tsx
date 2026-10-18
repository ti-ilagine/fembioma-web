import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { HighlightsSection } from '@/components/highlights-section'
import { AgendaSection } from '@/components/agenda-section'
import { FacultySection } from '@/components/faculty-section'
import { PricingSection } from '@/components/pricing-section'
import { FooterCTA } from '@/components/footer-cta'
import { SociedadModal } from '@/components/sociedad-modal'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <HighlightsSection />
      <AgendaSection />
      <FacultySection />
      <PricingSection />
      <FooterCTA />

      {/* Pop-up de convocatoria para la Sociedad Peruana de Microbioma */}
      <SociedadModal />
    </main>
  )
}
