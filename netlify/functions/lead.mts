import type { Config, Context } from '@netlify/functions';
import { handleLead } from '../../src/lib/lead-handler.js';

declare const Netlify: { env: { get(name: string): string | undefined } };

/**
 * POST /api/lead. All the logic lives in src/lib/lead-handler.js so the build
 * gate can test it. This file only supplies the environment.
 *
 * Environment variables (Netlify > Project configuration > Environment variables):
 *   N8N_LEAD_WEBHOOK_URL     the production webhook URL of "BIG - Website Lead Intake"
 *   N8N_LEAD_WEBHOOK_SECRET  the shared secret that workflow checks in X-Lead-Secret
 */
export default async (req: Request, context: Context) =>
  handleLead(req, {
    webhookUrl: Netlify.env.get('N8N_LEAD_WEBHOOK_URL'),
    webhookSecret: Netlify.env.get('N8N_LEAD_WEBHOOK_SECRET'),
    ip: context.ip,
  });

export const config: Config = {
  path: '/api/lead',
  // Code based rate limit, available on every plan: 8 submissions a minute per visitor.
  rateLimit: { windowLimit: 8, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
