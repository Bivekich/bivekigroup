import { HeroSection } from './components/hero-section';
import { AdvantagesSection } from './components/advantages-section';
import { TariffsSection } from './components/tariffs-section';
import { AdditionalServicesSection } from './components/additional-services-section';
import { BenefitsSection } from './components/benefits-section';
import { PortfolioSection } from './components/portfolio-section';
import { ContactSection } from './components/contact-section';

export default function WebDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <TariffsSection />
      <AdditionalServicesSection />
      <BenefitsSection />
      <PortfolioSection />
      <ContactSection />
    </>
  );
}
