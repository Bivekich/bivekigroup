import { HeroSection } from './components/hero-section';
import { CaseStudySection } from './components/case-study-section';
import { AdvantagesSection } from './components/advantages-section';
import { FaqSection } from './components/faq-section';
import { ContactSection } from './components/contact-section';

export default function AdvertisingPage() {
  return (
    <>
      <HeroSection />
      <CaseStudySection />
      <AdvantagesSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
