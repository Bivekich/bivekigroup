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
import { client } from '@/lib/sanity';

export const revalidate = 60;

async function getProjects() {
  const query = `
    *[_type == "project"] | order(publishedAt desc) {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      tags,
      url,
      publishedAt
    }
  `;

  return client.fetch(query);
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <HeroBanner />
      <ServicesSection />
      <PortfolioSection projects={projects} />
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
