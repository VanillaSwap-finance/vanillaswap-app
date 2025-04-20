import { z } from 'zod'

export const TokenQuerySchema = z.object({
  name_like: z.string().optional(),
  expand_meta: z.boolean().optional(),
  include_changes: z.boolean().optional(),
  sort_by: z.string().optional(),
  trust_level: z.array(z.number()).optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
})

export const TokenResponseSchema = z.object({
  count: z.number(),
  tokens: z.array(
    z.object({
      currency: z.string(),
      issuer: z.string(),
      meta: z.object({
        token: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          trust_lebel: z.number().optional(),
          asset_class: z.string().optional(),
          weblinks: z
            .array(
              z
                .object({
                  url: z.string().optional(),
                  type: z.string().optional(),
                  title: z.string().optional(),
                })
                .optional(),
            )
            .optional(),
        }),
        issuer: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          kyc: z.boolean(),
          trust_lebel: z.number().optional(),
          weblinks: z
            .array(
              z
                .object({
                  url: z.string().optional(),
                  type: z.string().optional(),
                  title: z.string().optional(),
                })
                .optional(),
            )
            .optional(),
        }),
      }),
      metrics: z.object({
        trustlines: z.number(),
        holders: z.number(),
        supply: z.string(),
        marketcap: z.string(),
        price: z.string(),
        volume_24h: z.string(),
        volume_7d: z.string(),
        exchanges_24h: z.string(),
        exchanges_7d: z.string(),
        takers_24h: z.string(),
        takers_7d: z.string(),
      }),
    }),
  ),
})

export type TokenQueryParams = z.infer<typeof TokenQuerySchema>
export type TokenResponse = z.infer<typeof TokenResponseSchema>
