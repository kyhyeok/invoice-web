import { z } from 'zod'

export const notionConnectSchema = z.object({
  integrationToken: z.string().min(1, 'Integration Token을 입력해주세요'),
  dataSourceId: z
    .string()
    .uuid('데이터 소스 ID는 UUID 형식이어야 합니다')
    .optional(),
})

export type NotionConnectFormData = z.infer<typeof notionConnectSchema>
