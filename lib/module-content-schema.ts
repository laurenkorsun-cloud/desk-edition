import { z } from "zod";

export const SourceLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
});

export const ModuleItemSchema = z.object({
  headline: z.string(),
  synopsis: z.string(),
  description: z.string(),
  sourceUrl: z.string().optional(),
  sourceName: z.string().optional(),
});

export const GeneratedModuleSchema = z.object({
  title: z.string().optional(),
  synopsis: z.string(),
  description: z.string(),
  items: z.array(ModuleItemSchema).default([]),
  sources: z.array(SourceLinkSchema).default([]),
});

export const PersonalSynthesisSchema = z.object({
  lede: z.string(),
  sections: z.array(
    z.object({
      name: z.string(),
      stories: z.array(
        z.object({
          headline: z.string(),
          summary: z.string(),
          synopsis: z.string().optional(),
          description: z.string().optional(),
          whyItMatters: z.string(),
          talkingPoint: z
            .object({
              line: z.string(),
              question: z.string(),
            })
            .optional(),
          sourceUrl: z.string().optional(),
          sourceName: z.string().optional(),
        })
      ),
    })
  ),
  talkingPoints: z.array(z.string()),
  talkingPointsByCategory: z.record(z.string(), z.array(z.string())).optional(),
  emailBullets: z.array(z.string()),
  modules: z.record(z.string(), GeneratedModuleSchema).optional(),
  marketsMeta: z
    .object({
      pulse: z.string().optional(),
      intro: z.string().optional(),
      watchItems: z.array(z.string()),
    })
    .optional(),
});

export type GeneratedModule = z.infer<typeof GeneratedModuleSchema>;
export type PersonalSynthesis = z.infer<typeof PersonalSynthesisSchema>;
