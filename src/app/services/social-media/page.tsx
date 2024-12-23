import { HeroSection } from './components/hero-section';
import { CaseStudySection } from './components/case-study-section';
import { BenefitsSection } from './components/benefits-section';
import { AdvantagesSection } from './components/advantages-section';
import { FaqSection } from './components/faq-section';
import { ContactSection } from './components/contact-section';

export default function SocialMediaPage() {
  return (
    <>
      <HeroSection />
      <CaseStudySection />
      <BenefitsSection />
      <AdvantagesSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
