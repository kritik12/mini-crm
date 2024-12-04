import { z } from "zod";

export const customerDetailsSchema = z.object({
    id: z.number().or(z.string()),
    email: z.string().email(),
    name: z.string().toLowerCase().min(4).max(64),
    total_spending: z.number().optional().default(0),
    last_visit: z.string().default(new Date().toISOString()),
    visit_count: z.number().optional().default(0),
});

export const SegmentSchemaForm = z
  .object({
    segmentName: z.string().min(4).max(64),
    lowPar: z.number().min(0).default(0),
    highPar: z.number().min(0).default(0),
    leastVisits: z.number().int().min(0).default(0),
    mostVisits: z.number().int().min(0).default(0),
    lastVisitDays: z.number().int().min(0).default(0),
  })
  .refine((data) => data.highPar >= data.lowPar, {
    message: "highPar must be greater than equal to lowPar",
    path: ["highPar"],
  })
  .refine((data) => data.mostVisits >= data.leastVisits, {
    message: "mostVisits must be greater than equal to leastVisits",
    path: ["mostVisits"],
  });

export const SegmentSchema = z.object({
    id: z.number().int().positive(),
    segment_name: z.string(),
    low_par: z.number().min(0).max(Number.MAX_VALUE).optional().default(0),
    high_par: z.number().min(0).max(Number.MAX_VALUE).optional().default(0),
    least_visits: z.number().int().min(0).optional().default(0),
    most_visits: z.number().int().min(0).optional().default(0),
    last_visit_days: z.number().int().min(0).optional().default(0),
    created_at: z.string(),
    updated_at: z.string(),
});

export const NewOrderForm = z.object({
    customerId: z.number().int().min(0).default(0),
    customerName: z.string().min(4).max(64),
    customerEmail: z.string().email(),
    purchaseAmount: z.number().min(0),
    purchaseDate: z.string(),
    mobileNumber:z.string()
});

export const CampaignSchema = z.object({
    id: z.number().int().positive(),
    audience_size: z.number().int().nonnegative(),
    segment_id: z.number().int().positive(),
    segment_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const CampaignStatsSchema = z.object({
    campaign_id: z.number().int().positive(),
    segment_id: z.number().int().positive(),
    audience_size: z.number().int().nonnegative(),
    total_sent: z.number().int().nonnegative(),
    total_failed: z.number().int().nonnegative(),
    segment_name: z.string(),
    created_at: z.string()
})

export const DeliveryReceiptSchema = z.object({
    id: z.number().int().positive(),
    customer_id: z.number().int().positive(),
    campaign_id: z.number().int().positive(),
    message: z.string(),
    status: z.enum(["SENT", "FAILED"]),
    created_at: z.string(),
    updated_at: z.string()
})

export type DeliveryReceiptType = z.infer<typeof DeliveryReceiptSchema>
export type CampaignStatsType = z.infer<typeof CampaignStatsSchema>
export type CampaignType = z.infer<typeof CampaignSchema>;
export type NewOrderFormType = z.infer<typeof NewOrderForm>;
export type CustomerDetailsType = z.infer<typeof customerDetailsSchema>;
export type SegmentFormType = z.infer<typeof SegmentSchemaForm>;
export type SegmentType = z.infer<typeof SegmentSchema>;
