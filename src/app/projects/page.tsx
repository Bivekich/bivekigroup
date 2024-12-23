import { Metadata } from 'next';
import { pagesMetadata } from '@/app/metadata';
import { client } from '@/lib/sanity';
import { ProjectsList } from '@/components/projects/projects-list';

export const metadata: Metadata = {
  title: pagesMetadata['/projects'].title,
  description: pagesMetadata['/projects'].description,
};

export const revalidate = 0;

async function getProjects() {
  const query = `
    *[_type == "project"] | order(publishedAt desc) {
      _id,
      title,
      description,
      "image": image.asset->url,
      tags,
      publishedAt
    }
  `;

  return client.fetch(query);
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsList projects={projects} />;
}
