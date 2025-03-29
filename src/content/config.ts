import { defineCollection, z } from 'astro:content';

// Collection - Projects
const projectsCollection = defineCollection({
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