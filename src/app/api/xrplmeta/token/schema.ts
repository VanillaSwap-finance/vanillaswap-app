import { z } from 'zod'

export const TokenQuerySchema = z.object({
  nameLike: z.string().optional(),
})

export const TokenResponseSchema = z.object({
  count: z.number(),
  tokens: z.array(
    z.object({
      currency: z.string(),
      issuer: z.string(),
      meta: z.object({
        token: z.object({
          name: z.string(),
          description: z.string().optional(),
          icon: z.string().url().optional(),
          weblinks: z
            .array(
              z.object({
                url: z.string().url(),
                title: z.string(),
              }),
            )
            .optional(),
        }),
        issuer: z.object({
          kyc: z.boolean(),
          name: z.string(),
          domain: z.string().optional(),
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
        exchanges_24h: z.number(),
        exchanges_7d: z.number(),
        takers_24h: z.number(),
        takers_7d: z.number(),
      }),
    }),
  ),
})

export type TokenQueryParams = z.infer<typeof TokenQuerySchema>
export type TokenResponse = z.infer<typeof TokenResponseSchema>
