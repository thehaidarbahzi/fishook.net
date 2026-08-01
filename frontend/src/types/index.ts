export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Session {
  token: string;
  webhookId: string;
  webhookUrl: string;
  expiresAt: string;
}

export interface WebhookLog {
  id: number;
  webhookId: string;
  method: HttpMethod;
  headers: Record<string, string> | null;
  queryParams: Record<string, string | string[]> | null;
  body: unknown | null;
  createdAt: string;
}

export interface ApiError {
  message: string;
}

export type WebSocketStatus = 'connecting' | 'open' | 'reconnecting' | 'closed';
