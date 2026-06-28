export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const tokenKey = "productflow-token";
const sessionUserKey = "productflow-user";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  roleKey: string;
  status: string;
};

export type SessionResponse = {
  token: string;
  user: AuthenticatedUser;
  expiresAt: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(tokenKey);
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(sessionUserKey);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export function storeSession(session: SessionResponse) {
  window.localStorage.setItem(tokenKey, session.token);
  window.localStorage.setItem(sessionUserKey, JSON.stringify(session.user));
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(sessionUserKey);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...requestInit } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", requestHeaders.get("Content-Type") ?? "application/json");

  const token = getToken();
  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers: requestHeaders,
  });

  const payload = await readResponse(response);
  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    throw new ApiError(response.status, payload.message);
  }

  return payload.data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

export function apiPost<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
  });
}

export async function login(email: string, password: string) {
  const session = await apiPost<SessionResponse>(
    "/api/auth/login",
    { email, password },
    { auth: false },
  );
  storeSession(session);
  return session;
}

export async function logout() {
  try {
    await apiPost<void>("/api/auth/logout");
  } finally {
    clearSession();
  }
}

export async function getCurrentUser() {
  const user = await apiGet<AuthenticatedUser>("/api/auth/me");
  window.localStorage.setItem(sessionUserKey, JSON.stringify(user));
  return user;
}

async function readResponse(response: Response): Promise<ApiEnvelope<unknown>> {
  const text = await response.text();
  if (!text) {
    return { success: response.ok, data: null, message: null };
  }

  try {
    const parsed = JSON.parse(text) as Partial<ApiEnvelope<unknown>> & { error?: string };
    if ("success" in parsed && "data" in parsed) {
      return {
        success: Boolean(parsed.success),
        data: parsed.data,
        message: parsed.message ?? null,
      };
    }
    return {
      success: response.ok,
      data: parsed,
      message: parsed.message ?? parsed.error ?? response.statusText,
    };
  } catch {
    return {
      success: response.ok,
      data: text,
      message: text || response.statusText,
    };
  }
}

export const enabledModules = [
  "auth",
  "rbac",
  "audit-log"
] as const;
