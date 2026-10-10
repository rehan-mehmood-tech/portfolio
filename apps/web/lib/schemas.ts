import { z } from "zod";
export const leadSchema = z.object({
  source: z.enum(["form","chat"]).default("form"), type: z.enum(["client","recruiter"]),
  name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(200), phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(100).optional(), budget: z.string().trim().max(100).optional(), timeline: z.string().trim().max(100).optional(),
  message: z.string().trim().min(20).max(3000), landingPage: z.string().max(500).optional(), referrer: z.string().max(500).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(), consent: z.literal(true), website: z.string().max(0).optional(),
});
export const sessionSchema = z.object({ idToken: z.string().min(100) });

