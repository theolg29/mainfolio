import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Collection - Projects
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    heroImage: image(),
    video: z.string(),
    url: z.string(),
    archive: z.string(),
    tags: z.array(z.string()),
    pin: z.boolean(),
  }),
});

export const collections = {
  projects: projectsCollection,
};