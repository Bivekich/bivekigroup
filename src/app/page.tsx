import { HeroBanner } from '@/components/hero-banner';
import { ServicesSection } from '@/components/services-section';
import { FeaturesSection } from '@/components/features-section';
import { PortfolioSection } from '@/components/portfolio-section';
import { ResponsiveSection } from '@/components/responsive-section';
import { CrmSection } from '@/components/crm-section';
import { WebsiteSection } from '@/components/website-section';
import { IntegrationsSection } from '@/components/integrations-section';
import { SupportSection } from '@/components/support-section';
import { CtaSection } from '@/components/cta-section';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <ServicesSection />
      <PortfolioSection />
      <FeaturesSection />
      <CrmSection />
      <WebsiteSection />
      <ResponsiveSection />
      <IntegrationsSection />
      <SupportSection />
      <CtaSection />
    </>
  );
}
