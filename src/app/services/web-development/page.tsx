import { HeroSection } from './components/hero-section';
import { AdvantagesSection } from './components/advantages-section';
import { TariffsSection } from './components/tariffs-section';
import { AdditionalServicesSection } from './components/additional-services-section';
import { BenefitsSection } from './components/benefits-section';
import { PortfolioSection } from './components/portfolio-section';
import { ContactSection } from './components/contact-section';
import { client } from '@/lib/sanity';

async function getProjects() {
  const query = `
    *[_type == "project"] | order(publishedAt desc) {
      _id,
      title,
      description,
      "image": image.asset->url,
      tags,
      url,
      publishedAt
    }
  `;

  return client.fetch(query);
}

export default async function WebDevelopmentPage() {
  const projects = await getProjects();

  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <TariffsSection />
      <AdditionalServicesSection />
      <BenefitsSection />
      <PortfolioSection projects={projects} />
      <ContactSection />
    </>
  );
}
