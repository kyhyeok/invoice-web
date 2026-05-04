export type ShareLinkStatus = 'active' | 'expired' | 'revoked'

export interface Quote {
  id: string
  userId: string
  notionPageId: string
  shareToken: string
  expiresAt: Date | null
  isActive: boolean
  createdAt: Date
}

export interface ShareLink {
  url: string
  token: string
  expiresAt: Date | null
  status: ShareLinkStatus
  createdAt: Date
}
