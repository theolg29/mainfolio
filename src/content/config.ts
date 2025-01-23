import { defineCollection, z } from 'astro:content';

// Collection - Projects
const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    heroImage: z.string(),
    tags: z.array(z.string()),
    pin: z.boolean(),
  }),
});

export const collections = {
  projects: projectsCollection,
};