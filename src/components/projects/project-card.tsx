import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { Project } from '@/types/sanity';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image
    ? urlFor(project.image)
    : '/placeholder-image.jpg';

  return (
    <div className="group h-full">
      <div className="bg-background h-full border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all dark:shadow-none dark:hover:border-primary/50 flex flex-col">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {project.tags && project.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
