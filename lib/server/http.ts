// API 统一 JSON 错误形状：{ error: string }
export const jsonError = (error: string, status: number) =>
  Response.json({ error }, { status })
