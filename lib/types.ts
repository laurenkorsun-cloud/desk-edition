import { z } from "zod";

export const StorySchema = z.object({
  headline: z.string(),
  summary: z.string(),
  synopsis: z.string().optional(),
  description: z.string().optional(),
  whyItMatters: z.string(),
  sourceUrl: z.string().optional(),
  sourceName: z.string().optional(),
  imageUrl: z.string().optional(),
  talkingPoint: z
    .object({
      line: z.string(),
      question: z.string(),
    })
    .optional(),
});

export const SectionSchema = z.object({
  name: z.string(),
  stories: z.array(StorySchema),
});

export const EditionContentSchema = z.object({
  lede: z.string(),
  sections: z.array(SectionSchema),
  talkingPoints: z.array(z.string()).min(3).max(7),
  emailBullets: z.array(z.string()).min(5).max(10),
});

export type Story = z.infer<typeof StorySchema>;
export type Section = z.infer<typeof SectionSchema>;
export type EditionContent = z.infer<typeof EditionContentSchema>;

export type EditionRow = {
  id: string;
  slug: string;
  title: string;
  lede: string;
  content_json: EditionContent;
  status: "draft" | "published";
  edition_number: number | null;
  published_at: string | null;
  created_at: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  status: "pending" | "active" | "unsubscribed";
  timezone: string;
  unsubscribe_token: string;
  confirm_token: string | null;
  created_at: string;
  confirmed_at: string | null;
};
