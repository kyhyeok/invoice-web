import { z } from 'zod'

export const shareLinkSchema = z
  .object({
    expiresIn: z.enum(['none', '7d', '30d', 'custom']),
    customExpiresAt: z.date().optional(),
  })
  .refine(
    data => data.expiresIn !== 'custom' || data.customExpiresAt !== undefined,
    {
      message: '직접 입력 시 만료 일시를 선택해주세요',
      path: ['customExpiresAt'],
    }
  )

export type ShareLinkFormData = z.infer<typeof shareLinkSchema>
