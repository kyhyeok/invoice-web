export interface NotionIntegration {
  id: string
  userId: string
  integrationToken: string
  dataSourceId: string
  isActive: boolean
}

export interface NotionDataSource {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
}

export interface NotionPage {
  id: string
  title: string
  createdTime: string
  lastEditedTime: string
  properties: Record<string, unknown>
}

export type NotionBlock =
  | { type: 'paragraph'; id: string; text: string }
  | {
      type: 'heading_1' | 'heading_2' | 'heading_3'
      id: string
      text: string
    }
  | {
      type: 'bulleted_list_item' | 'numbered_list_item'
      id: string
      text: string
    }
  | { type: 'quote'; id: string; text: string }
  | { type: 'table'; id: string; rows: string[][] }
