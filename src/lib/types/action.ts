export interface ActionError {
  code: string
  message: string
  field?: string
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError }
